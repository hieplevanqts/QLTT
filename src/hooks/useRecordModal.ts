import { useCallback, useState } from "react";

export function useRecordModal<T>() {
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState<T | null>(null);

  const show = useCallback((r: T) => {
    setRecord(r);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const afterClose = useCallback(() => setRecord(null), []);

  return { open, record, show, close, afterClose, setOpen, setRecord };
}
