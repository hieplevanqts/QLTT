import React, { createContext, useContext, useMemo, useReducer } from "react";
import { mockAiRespond } from "./mockAi";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

export type ThreadContext = {
  page?: string;
  focus?: {
    kind: "lead" | "tag" | null;
    leadId?: string;
    tag?: string;
  };
  selectedLeadIds?: string[];
  selectedTag?: string;
  selectedLeads?: Array<{
    id: string;
    code: string;
    title: string;
    categoryLabel: string;
    locationText?: string;
    wardLabel?: string;
    reliability: number;
    hasVideo: boolean;
    hasImage: boolean;
    status: string;
  }>;
};

export type ChatThread = {
  id: string;
  title: string;
  scope: "global" | "lead-risk";
  context?: ThreadContext;
  messages: ChatMessage[];
  updatedAt: number;
};

type AssistantState = {
  threads: ChatThread[];
  activeThreadId: string | null;
  drawerOpen: boolean;
};

type Action =
  | { type: "createThread"; payload: ChatThread }
  | { type: "setActiveThread"; payload: { id: string | null } }
  | { type: "setDrawerOpen"; payload: { open: boolean } }
  | { type: "appendMessage"; payload: { threadId: string; message: ChatMessage } }
  | { type: "clearThread"; payload: { threadId: string } }
  | { type: "renameThread"; payload: { threadId: string; title: string } }
  | { type: "updateThreadContext"; payload: { threadId: string; context: ThreadContext } };

const initialState: AssistantState = {
  threads: [],
  activeThreadId: null,
  drawerOpen: false,
};

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const now = () => Date.now();

function reducer(state: AssistantState, action: Action): AssistantState {
  switch (action.type) {
    case "createThread": {
      const thread = action.payload;
      return {
        ...state,
        threads: [thread, ...state.threads],
        activeThreadId: thread.id,
      };
    }
    case "setActiveThread":
      return { ...state, activeThreadId: action.payload.id };
    case "setDrawerOpen":
      return { ...state, drawerOpen: action.payload.open };
    case "appendMessage": {
      const { threadId, message } = action.payload;
      return {
        ...state,
        threads: state.threads.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                messages: [...thread.messages, message],
                updatedAt: now(),
              }
            : thread
        ),
      };
    }
    case "clearThread": {
      const { threadId } = action.payload;
      return {
        ...state,
        threads: state.threads.map((thread) =>
          thread.id === threadId
            ? { ...thread, messages: [], updatedAt: now() }
            : thread
        ),
      };
    }
    case "renameThread": {
      const { threadId, title } = action.payload;
      return {
        ...state,
        threads: state.threads.map((thread) =>
          thread.id === threadId ? { ...thread, title } : thread
        ),
      };
    }
    case "updateThreadContext": {
      const { threadId, context } = action.payload;
      return {
        ...state,
        threads: state.threads.map((thread) =>
          thread.id === threadId
            ? { ...thread, context: { ...thread.context, ...context }, updatedAt: now() }
            : thread
        ),
      };
    }
    default:
      return state;
  }
}

type AssistantContextValue = AssistantState & {
  createThread: (scope: ChatThread["scope"], title: string, context?: ThreadContext) => string;
  getOrCreateThread: (scope: ChatThread["scope"], title: string, context?: ThreadContext) => string;
  setActiveThread: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  appendMessage: (threadId: string, message: ChatMessage) => void;
  clearThread: (threadId: string) => void;
  renameThread: (threadId: string, title: string) => void;
  updateThreadContext: (threadId: string, context: ThreadContext) => void;
  updateContext: (threadId: string, context: ThreadContext) => void;
  getActiveThread: () => ChatThread | null;
  getActiveThreadContext: () => ThreadContext | undefined;
};

const AssistantContext = createContext<AssistantContextValue | undefined>(undefined);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo<AssistantContextValue>(() => {
    const createThread = (scope: ChatThread["scope"], title: string, context?: ThreadContext) => {
      const id = createId();
      const thread: ChatThread = {
        id,
        title,
        scope,
        context,
        messages: [],
        updatedAt: now(),
      };
      dispatch({ type: "createThread", payload: thread });
      return id;
    };

    return {
      ...state,
      createThread,
      getOrCreateThread: (scope, title, context) => {
        const existing = state.threads.find(
          (thread) => thread.scope === scope && thread.title === title
        );
        if (existing?.id) {
          return existing.id;
        }
        return createThread(scope, title, context);
      },
      setActiveThread: (id) => dispatch({ type: "setActiveThread", payload: { id } }),
      setDrawerOpen: (open) => dispatch({ type: "setDrawerOpen", payload: { open } }),
      appendMessage: (threadId, message) =>
        dispatch({ type: "appendMessage", payload: { threadId, message } }),
      clearThread: (threadId) => dispatch({ type: "clearThread", payload: { threadId } }),
      renameThread: (threadId, title) =>
        dispatch({ type: "renameThread", payload: { threadId, title } }),
      updateThreadContext: (threadId, context) => {
        const thread = state.threads.find((item) => item.id === threadId);
        const nextFocus =
          context?.focus === undefined
            ? thread?.context?.focus
            : context.focus?.kind === null
            ? { kind: null }
            : { ...thread?.context?.focus, ...context.focus };
        dispatch({
          type: "updateThreadContext",
          payload: { threadId, context: { ...context, focus: nextFocus } },
        });
      },
      updateContext: (threadId, context) => {
        const thread = state.threads.find((item) => item.id === threadId);
        const nextFocus =
          context?.focus === undefined
            ? thread?.context?.focus
            : context.focus?.kind === null
            ? { kind: null }
            : { ...thread?.context?.focus, ...context.focus };
        dispatch({
          type: "updateThreadContext",
          payload: { threadId, context: { ...context, focus: nextFocus } },
        });
      },
      getActiveThread: () =>
        state.activeThreadId
          ? state.threads.find((thread) => thread.id === state.activeThreadId) ?? null
          : null,
      getActiveThreadContext: () =>
        state.activeThreadId
          ? state.threads.find((thread) => thread.id === state.activeThreadId)?.context
          : undefined,
    };
  }, [state]);

  return <AssistantContext.Provider value={api}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within AssistantProvider");
  }
  return context;
}

export { createId, now };
export { mockAiRespond };
