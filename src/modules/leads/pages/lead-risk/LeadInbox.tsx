import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import {
  Search,
  Plus,
  CheckSquare,
  UserPlus,

  Inbox,
  X,
  Trash2,
  CheckCircle2,
  Map,
  AlertCircle,
  Loader2,
  RefreshCw,
  Ban,
  Copy,
  Download,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useSupabaseLeads, useLeadStats } from "@/hooks/useSupabaseLeads";
import { StatusBadge } from "@/components/lead-risk/StatusBadge";
import { SLATimer } from "@/components/lead-risk/SLATimer";
import { LeadFormModal } from "@/components/lead-risk/LeadFormModal";
import { DeleteConfirmModal } from "@/components/lead-risk/DeleteConfirmModal";
import { ConfirmationDialog as ConfirmationDialogComponent } from "@/components/lead-risk/ConfirmationDialog";
import { AddNoteModal } from "@/components/lead-risk/AddNoteModal";
import { UpdateSLAModal } from "@/components/lead-risk/UpdateSLAModal";
import { RejectLeadModal } from "@/components/lead-risk/RejectLeadModal";
import { EvidenceDocumentModal } from "@/components/lead-risk/EvidenceDocumentModal";
import AssignLeadModal from "@/components/lead-risk/AssignLeadModal";
import QuickActionsSidebar from "@/components/lead-risk/QuickActionsSidebar";
import {
  LeadActionMenu,
  type LeadAction,
} from "@/components/lead-risk/LeadActionMenu";
import {
  WatchlistPanel,
  type WatchlistItem,
} from "@/components/lead-risk/WatchlistPanel";
import { LeadPreviewPanel } from "@/components/lead-risk/LeadPreviewPanel";
import MultiSelectDropdown from "@/components/lead-risk/MultiSelectDropdown";
import { AIBulkActionBar } from "@/components/lead-risk/AIBulkActionBar";
import { AIScoreCell } from "@/components/lead-risk/AIScoreCell";
import { AIInsightPanel } from "@/components/lead-risk/AIInsightPanel";
import { AIStatusBadge } from "@/components/lead-risk/AIStatusBadge";
import { Breadcrumb } from "@/components/Breadcrumb";
import CreateLeadSourceModal from "@/components/lead-risk/CreateLeadSourceModal";
import { supabase as supabaseClient } from "@/api/supabaseClient";
import type {
  Lead,
  LeadStatus,
} from "@/utils/data/lead-risk/types";
import styles from "./LeadInbox.module.css";

type FilterType =
  | "all"
  | "new"
  | "in_progress"
  | "process_paused"
  | "resolved"
  | "rejected"
  | "cancelled"
  | "sla_risk"
  | "critical"
  | "unassigned"
  | "assigned_to_me";

// Status configuration for overview cards
const STATUS_CONFIG = [
  {
    key: "all" as const,
    label: "Tổng số nguồn tin",
    icon: Inbox,
    iconColor: "var(--primary)",
    bgColor: "rgba(239, 246, 255, 1)",
    detailLabel: "Tất cả",
    getDetailValue: () => null,
    detailColor: "var(--primary)",
  },
  {
    key: "new" as const,
    label: "Mới",
    icon: CheckSquare,
    iconColor: "var(--primary)",
    bgColor: "rgba(239, 246, 255, 1)",
    detailLabel: "Cần xử lý",
    getDetailValue: () => null,
    detailColor: "var(--primary)",
  },
  {
    key: "in_progress" as const,
    label: "Đang xử lý",
    icon: CheckCircle2,
    iconColor: "rgba(59, 130, 246, 1)",
    bgColor: "rgba(219, 234, 254, 1)",
    detailLabel: "Đang thực hiện",
    getDetailValue: () => null,
    detailColor: "rgba(59, 130, 246, 1)",
  },
  {
    key: "process_paused" as const,
    label: "Tạm dừng xử lý",
    icon: CheckCircle2,
    iconColor: "rgba(59, 130, 246, 1)",
    bgColor: "rgba(219, 234, 254, 1)",
    detailLabel: "Tạm dừng",
    getDetailValue: () => null,
    detailColor: "rgba(59, 130, 246, 1)",
  },
  {
    key: "resolved" as const,
    label: "Đã xử lý",
    icon: CheckCircle2,
    iconColor: "rgba(34, 197, 94, 1)",
    bgColor: "rgba(220, 252, 231, 1)",
    detailLabel: "Hoàn thành",
    getDetailValue: () => null,
    detailColor: "rgba(34, 197, 94, 1)",
  },
];

// Get allowed actions for each status
const getAllowedActions = (
  status: LeadStatus,
): LeadAction[] => {
  switch (status) {
    case "new":
      return ["view", "assign", "reject", "cancel"];
    case "in_progress":
      return [
        "view",
        "update_sla",
        "complete",
        "hold",
        "cancel",
      ];
    case "process_paused":
      return [
        "view",
        "update_sla",
        "complete",
        "hold",
        "cancel",
      ];
    case "resolved":
      return [
        "view",
        "reopen_to_progress",
        "reopen_to_verification",
      ];
    case "rejected":
      return ["view"];
    case "cancelled":
      return ["view"];
    default:
      return ["view"];
  }
};

// Helper to translate category values
const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    price_fraud: 'Niêm yết giá không đúng',
    food_safety: 'Vi phạm VSATTP',
    counterfeit: 'Hàng giả, hàng nhái',
    origin_unknown: 'Hàng không rõ nguồn gốc',
    expired: 'Hàng hết hạn',
    commercial_fraud: 'Gian lận thương mại',
    illegal_trading: 'Vi phạm quy định kinh doanh',
    other: 'Khác',

    // Legacy mappings
    smuggling: 'Hàng không rõ nguồn gốc',
    unlicensed: 'Vi phạm quy định kinh doanh',
  };
  return labels[category] || category;
};

// Helper to translate source values
const getSourceLabel = (source: string): string => {
  const labels: Record<string, string> = {
    app: 'Mobile App',
    hotline: 'Hotline 1800',
    import: 'Import hàng loạt',
    field: 'Hiện trường',
    tip: 'Nguồn tin ẩn danh',
    system: 'Tự động phát hiện',
    social: 'Mạng xã hội',
    website: 'Website/Portal',
    email: 'Email',
    inspection: 'Kiểm tra trực tiếp',
    authority: 'Công an/Chính quyền',
    other: 'Nguồn khác',
  };
  return labels[source] || source;
};

export default function LeadInbox() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const renderCountRef = useRef(0);
  const [selectedLeads, setSelectedLeads] = useState<
    Set<string>
  >(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Multi-select filters
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const statusParam = searchParams.get('status');
    if (statusParam === 'all') return [];
    if (statusParam) return [statusParam];
    return ["new"];
  });
  const [selectedAssignments, setSelectedAssignments] =
    useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    string[]
  >([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default: 20 items per page

  // Preview panel state
  const [selectedLeadForPreview, setSelectedLeadForPreview] =
    useState<Lead | null>(null);
  const [showPreviewPanel, setShowPreviewPanel] =
    useState(false);

  // Quick Actions Sidebar state
  const [
    selectedLeadForQuickActions,
    setSelectedLeadForQuickActions,
  ] = useState<Lead | null>(null);
  const [showQuickActionsSidebar, setShowQuickActionsSidebar] =
    useState(false);

  // Track renders
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(
      `🎨 [LeadInbox] Render #${renderCountRef.current}`,
    );
    console.log("📊 [LeadInbox] State:", {
      selectedStatuses,
      selectedCategories,
      selectedSeverities,
      searchQuery,
      selectedAssignments,
    });
  });

  // Sync URL params to filter state
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam === 'all') {
      setSelectedStatuses((prev) => (prev.length === 0 ? prev : []));
    } else if (statusParam) {
      setSelectedStatuses((prev) => (prev.length === 1 && prev[0] === statusParam ? prev : [statusParam]));
    }
  }, [searchParams]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">(
    "create",
  );
  const [editingLead, setEditingLead] = useState<Lead | null>(
    null,
  );
  const [deletingLead, setDeletingLead] = useState<Lead | null>(
    null,
  );
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] =
    useState(false);
  const [isUpdateSLAModalOpen, setIsUpdateSLAModalOpen] =
    useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] =
    useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] =
    useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(
    null,
  );
  const [isAssignModalOpen, setIsAssignModalOpen] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Confirmation Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    type: "info" | "warning" | "danger" | "success";
    leadCode?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Xác nhn",
    type: "warning",
    onConfirm: () => { },
  });

  // Watchlist data - Empty for now (TODO: Fetch from Supabase)
  const [watchlistItems] = useState<WatchlistItem[]>([]);

  const handleRemoveFromWatchlist = (id: string) => {
    if (confirm("Bạn có chắc muốn bỏ theo dõi mục này?")) {
      alert(`Đã bỏ theo dõi: ${id}`);
    }
  };

  const handleViewWatchlistItemDetails = (
    item: WatchlistItem,
  ) => {
    if (item.type === "lead") {
      // Navigate to lead detail if we have the lead ID
      const lead = allLeads.find((l) => l.code === item.code);
      if (lead) {
        navigate(`/lead-risk/lead/${lead._id}`);
      }
    } else if (item.type === "store") {
      alert(`Xem chi tiết cơ sở: ${item.name}`);
    } else {
      alert(`Xem chi tiết địa điểm: ${item.name}`);
    }
    setIsWatchlistOpen(false);
  };

  // SUPABASE DATA FETCHING
  // Memoize options to prevent unnecessary re-fetches
  const supabaseOptions = useMemo(
    () => ({
      statuses:
        selectedStatuses.length > 0
          ? selectedStatuses
          : undefined,
      // NOTE: Passing Vietnamese category strings directly to Supabase as requested
      categories:
        selectedCategories.length > 0
          ? selectedCategories
          : undefined,
      search: searchQuery || undefined,
      // NOTE: Assignment filtering moved to CLIENT-SIDE (filteredLeads)
      // unassigned: selectedAssignments.includes('unassigned') ? true : undefined,
      limit: 200,
    }),
    [selectedStatuses, selectedCategories, searchQuery],
  );

  const {
    leads: allLeads,
    loading,
    error,
    refetch,
  } = useSupabaseLeads(supabaseOptions);

  const { stats } = useLeadStats();

  console.log("🎨 [LeadInbox] Component rendered");
  console.log(
    "📊 [LeadInbox] allLeads.length:",
    allLeads.length,
  );
  console.log(
    "📋 [LeadInbox] First 5 lead codes:",
    allLeads.slice(0, 5).map((l) => l.code),
  );
  console.log(
    "🔢 [LeadInbox] Lead IDs (first 5):",
    allLeads.slice(0, 5).map((l) => l._id),
  );

  // Check for duplicates in allLeads
  const allLeadIds = allLeads.map((l) => l._id);
  const uniqueLeadIds = new Set(allLeadIds);
  if (allLeadIds.length !== uniqueLeadIds.size) {
    console.error(
      "🚨 [LeadInbox] DUPLICATE DETECTED in allLeads!",
    );
    console.error(
      "🚨 [LeadInbox] Total leads:",
      allLeadIds.length,
      "Unique IDs:",
      uniqueLeadIds.size,
    );
    // Find which IDs are duplicated
    const duplicates = allLeadIds.filter(
      (id, index) => allLeadIds.indexOf(id) !== index,
    );
    console.error("🚨 [LeadInbox] Duplicate IDs:", [
      ...new Set(duplicates),
    ]);
  }

  // Calculate lead counts for filters using real data
  const newLeads = allLeads.filter(
    (l) => l.status === "new",
  ).length;



  // Group processing statuses
  const processingLeads = allLeads.filter(
    (l) => ["in_progress", "processing"].includes(l.status),
  ).length;

  const processPausedLeads = allLeads.filter(
    (l) => l.status === "process_paused",
  ).length;

  // Overview combined count (for stat cards if needed, or unused)
  const inProgressLeads = processingLeads + processPausedLeads;

  const resolvedLeads = allLeads.filter(
    (l) => l.status === "resolved",
  ).length;

  const rejectedLeads = allLeads.filter(
    (l) => l.status === "rejected",
  ).length;

  const cancelledLeadsOnly = allLeads.filter(
    (l) => l.status === "cancelled",
  ).length;

  const cancelledLeads = cancelledLeadsOnly + rejectedLeads;
  const assignedToMe = allLeads.filter(
    (l) => l.assignedTo?.userId === "QT24_NGUYENVANA",
  ).length;
  const unassignedLeads = allLeads.filter(
    (l) => !l.assignedTo,
  ).length;



  // Client-side filtering (Supabase already filters most, this is for assignment filter)
  const filteredLeads = allLeads.filter((lead) => {
    // Assignment filter - OR logic
    if (selectedAssignments.length > 0) {
      const matchesAssignment = selectedAssignments.some(
        (filter) => {
          if (filter === "assigned") return !!lead.assignedTo;
          if (filter === "unassigned") return !lead.assignedTo;
          if (filter === "assigned_to_me")
            return (
              lead.assignedTo?.userId === "QT24_NGUYENVANA"
            );
          return false;
        },
      );
      if (!matchesAssignment) return false;
    }



    // Severity filter
    if (selectedSeverities.length > 0) {
      if (!lead.severity || !selectedSeverities.includes(lead.severity)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination logic
  const totalPages = Math.ceil(
    filteredLeads.length / itemsPerPage,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(
    startIndex,
    endIndex,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedStatuses,
    selectedAssignments,
    selectedCategories,
    selectedSeverities,
    searchQuery,
  ]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const toggleSelectLead = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(
        new Set(filteredLeads.map((l) => l._id)),
      );
    }
  };


  const handleBulkAssign = () => {
    alert(`Giao xử lý ${selectedLeads.size} lead`);
  };

  const handleBulkReject = () => {
    if (
      confirm(
        `Bạn có chắc muốn từ chối ${selectedLeads.size} lead?`,
      )
    ) {
      alert("Đã từ chối");
    }
  };

  const handleBulkCancel = async () => {
    if (selectedLeads.size === 0) {
      toast.error("Vui lòng chọn ít nhất một lead");
      return;
    }

    const unassignedLeads = allLeads.filter(
      (l) => selectedLeads.has(l._id) && !l.assignedTo,
    );

    if (unassignedLeads.length === 0) {
      toast.error("Không có lead chưa phân công nào được chọn");
      return;
    }

    if (
      !confirm(
        `Bạn có chắc muốn hủy ${unassignedLeads.length} lead chưa phân công?`,
      )
    ) {
      return;
    }

    try {
      const supabase = supabaseClient;
      const leadIds = unassignedLeads.map((l) => l._id);

      const { error } = await supabase
        .from("leads")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .in("_id", leadIds)
        .is("assigned_to", null);

      if (error) {
        console.error("Error cancelling leads:", error);
        toast.error("Lỗi khi hủy leads: " + error.message);
        return;
      }

      toast.success(
        `Đã hủy ${unassignedLeads.length} lead thành công`,
      );
      setSelectedLeads(new Set());
      refetch(); // Refresh data
    } catch (err) {
      console.error("Error in handleBulkCancel:", err);
      toast.error("Có lỗi xảy ra khi hủy leads");
    }
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSelectedSeverities([]);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedStatuses.length > 0 ||
    selectedCategories.length > 0 ||
    selectedSeverities.length > 0 ||
    searchQuery !== "";

  // CRUD Handlers
  const handleEditLead = (lead: Lead) => {
    setFormMode("edit");
    setEditingLead(lead);
    setIsFormModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setDeletingLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setDeletingLead(null);
    setIsDeleteModalOpen(true);
  };

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (formMode === "create") {
      console.log("Creating lead:", leadData);
      alert("Lead đã được tạo thành công!");
    } else {
      console.log("Updating lead:", editingLead?._id, leadData);
      alert("Lead đã được cập nhật thành công!");
    }
    setSelectedLeads(new Set());
  };

  const handleConfirmDelete = () => {
    if (deletingLead) {
      console.log("Deleting single lead:", deletingLead._id);
      alert(`Đã xóa lead: ${deletingLead.code}`);
    } else {
      console.log("Deleting leads:", Array.from(selectedLeads));
      alert(`Đã xóa ${selectedLeads.size} leads`);
      setSelectedLeads(new Set());
    }
  };

  // [Removed verification logic]

  // Pause processing (in_progress → process_paused)
  const handlePauseProcessing = async (lead: Lead) => {
    try {
      const supabase = supabaseClient;

      console.log(
        `⏸️ [LeadInbox] Pausing processing for lead ${lead.code}`,
      );

      const { data, error } = await supabase
        .from("leads")
        .update({
          status: "process_paused",
          updated_at: new Date().toISOString(),
        })
        .eq("_id", lead._id)
        .select()
        .single();

      if (error) {
        console.error(
          "❌ [LeadInbox] Failed to pause processing:",
          error,
        );
        toast.error("Lỗi khi tạm dừng xử lý", {
          description: error.message,
        });
        return;
      }

      console.log(
        "✅ [LeadInbox] Processing paused successfully",
      );

      toast.success("Đã tạm dừng xử lý", {
        description: `Lead ${lead.code} đã được tạm dừng.`,
        duration: 3000,
      });

      // Clear filter and refetch
      setSelectedStatuses([]);
      await refetch();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Lỗi không xác định";
      console.error(
        "❌ [LeadInbox] Error pausing processing:",
        errorMessage,
      );
      toast.error("Lỗi hệ thống", {
        description: errorMessage,
      });
    }
  };

  // Resume processing (process_paused → processing)
  const handleResumeProcessing = async (lead: Lead) => {
    try {
      const supabase = supabaseClient;

      console.log(
        `▶️ [LeadInbox] Resuming processing for lead ${lead.code}`,
      );

      const { data, error } = await supabase
        .from("leads")
        .update({
          status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("_id", lead._id)
        .select()
        .single();

      if (error) {
        console.error(
          "❌ [LeadInbox] Failed to resume processing:",
          error,
        );
        toast.error("Lỗi khi tiếp tục xử lý", {
          description: error.message,
        });
        return;
      }

      console.log(
        '✅ [LeadInbox] Processing resumed successfully to "processing" status',
      );

      toast.success("Đã tiếp tục xử lý", {
        description: `Lead ${lead.code} đã được tiếp tục xử lý.`,
        duration: 3000,
      });

      // Clear filter and refetch
      setSelectedStatuses([]);
      await refetch();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Lỗi không xác định";
      console.error(
        "❌ [LeadInbox] Error resuming processing:",
        errorMessage,
      );
      toast.error("Lỗi hệ thống", {
        description: errorMessage,
      });
    }
  };

  // Complete processing (in_progress → resolved)
  const handleCompleteProcessing = async (lead: Lead) => {
    try {
      const supabase = supabaseClient;
      console.log(`✅ [LeadInbox] Completing processing for lead ${lead.code}`);

      const { data, error } = await supabase
        .from("leads")
        .update({
          status: "resolved",
          updated_at: new Date().toISOString(),
        })
        .eq("_id", lead._id)
        .select()
        .single();

      if (error) {
        console.error("❌ [LeadInbox] Failed to complete processing:", error);
        toast.error("Lỗi khi hoàn thành xử lý", { description: error.message });
        return;
      }

      console.log("✅ [LeadInbox] Processing completed successfully");
      toast.success("Đã hoàn thành xử lý", { description: `Lead ${lead.code} đã được hoàn thành.` });

      setSelectedStatuses([]);
      await refetch();
    } catch (err) {
      console.error("❌ [LeadInbox] Error completing processing:", err);
      toast.error("Lỗi hệ thống");
    }
  };

  // Cancel processing (in_progress → cancelled)
  const handleCancelProcessing = async (lead: Lead) => {
    try {
      const supabase = supabaseClient;
      console.log(`🚫 [LeadInbox] Cancelling processing for lead ${lead.code}`);

      const { data, error } = await supabase
        .from("leads")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("_id", lead._id)
        .select()
        .single();

      if (error) {
        console.error("❌ [LeadInbox] Failed to cancel processing:", error);
        toast.error("Lỗi khi hủy xử lý", { description: error.message });
        return;
      }

      console.log("✅ [LeadInbox] Processing cancelled successfully");
      toast.success("Đã hủy xử lý", { description: `Lead ${lead.code} đã được hủy.` });

      setSelectedStatuses([]);
      await refetch();
    } catch (err) {
      console.error("❌ [LeadInbox] Error cancelling processing:", err);
      toast.error("Lỗi hệ thống");
    }
  };

  // Reject lead (any status → rejected)
  const handleRejectLead = async (lead: Lead, reason: string) => {
    try {
      const supabase = supabaseClient;

      console.log(
        `🚫 [LeadInbox] Rejecting lead ${lead.code} with reason: "${reason}"`,
      );

      // Prepare update payload
      const updatePayload = {
        status: "rejected",
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("leads")
        .update(updatePayload)
        .eq("_id", lead._id)
        .select()
        .single();

      if (error) {
        console.error(
          "❌ [LeadInbox] Failed to reject lead:",
          error,
        );
        toast.error("Lỗi khi từ chối lead", {
          description: error.message,
        });
        return;
      }

      console.log(
        "✅ [LeadInbox] Lead rejected successfully",
      );

      toast.success("Đã từ chối lead", {
        description: `Lead ${lead.code} đã bị từ chối.`,
        duration: 3000,
      });

      // Clear filter and refetch
      setSelectedStatuses([]);
      await refetch();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Lỗi không xác định";
      console.error(
        "❌ [LeadInbox] Error rejecting lead:",
        errorMessage,
      );
      toast.error("Lỗi hệ thống", {
        description: errorMessage,
      });
    }
  };

  // Handle actions from menu
  const handleLeadAction = (lead: Lead, action: LeadAction) => {
    console.log(`Action ${action} on lead ${lead.code}`);

    switch (action) {
      case "view":
        navigate(`/lead-risk/lead/${lead._id}`);
        break;

      case "pause_processing":
        // Show confirmation dialog
        setConfirmDialog({
          isOpen: true,
          title: "Tạm dừng xử lý",
          message: "Bạn có chắc muốn tạm dừng xử lý lead này?",
          confirmText: "Xác nhận",
          type: "warning",
          leadCode: lead.code,
          onConfirm: () => {
            handlePauseProcessing(lead);
            setConfirmDialog({
              ...confirmDialog,
              isOpen: false,
            });
          },
        });
        break;
      case "resume_processing":
        // Show confirmation dialog
        setConfirmDialog({
          isOpen: true,
          title: "Tiếp tục xử lý",
          message: "Bạn có chắc muốn tiếp tục xử lý lead này?",
          confirmText: "Xác nhận",
          type: "success",
          leadCode: lead.code,
          onConfirm: () => {
            handleResumeProcessing(lead);
            setConfirmDialog({
              ...confirmDialog,
              isOpen: false,
            });
          },
        });
        break;
      case "assign":
        // Open assign modal for this lead
        setCurrentLead(lead);
        setIsAssignModalOpen(true);
        break;
      case "add_evidence":
        // Open evidence document modal for this lead
        setCurrentLead(lead);
        setIsEvidenceModalOpen(true);
        break;
      case "reject":
        // Open reject modal for this lead
        setCurrentLead(lead);
        setIsRejectModalOpen(true);
        break;
      // Add other cases as needed
      case "complete":
        setConfirmDialog({
          isOpen: true,
          title: "Hoàn thành xử lý",
          message: "Bạn có chắc chắn muốn hoàn thành xử lý lead này?",
          confirmText: "Xác nhận",
          type: "success",
          leadCode: lead.code,
          onConfirm: () => {
            handleCompleteProcessing(lead);
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          },
        });
        break;
      case "cancel":
        setConfirmDialog({
          isOpen: true,
          title: "Hủy bỏ xử lý",
          message: "Bạn có chắc chắn muốn hủy bỏ xử lý lead này?",
          confirmText: "Đồng ý hủy",
          type: "danger",
          leadCode: lead.code,
          onConfirm: () => {
            handleCancelProcessing(lead);
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          },
        });
        break;
      default:
        console.log(`Unhandled action: ${action}`);
    }
  };

  const handleExportExcel = () => {
    if (filteredLeads.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    const dataToExport = filteredLeads.map(lead => ({
      "Mã Lead": lead.code,
      "Tiêu đề": lead.title,
      "Trạng thái": lead.status === 'new' ? 'Mới' :
        lead.status === 'processing' ? 'Đang xử lý' :
          lead.status === 'process_paused' ? 'Tạm dừng xử lý' :
            lead.status === 'resolved' ? 'Đã giải quyết' :
              lead.status === 'cancelled' ? 'Đã hủy' :
                lead.status === 'rejected' ? 'Đã từ chối' : lead.status,
      "Mức độ": lead.severity === 'critical' ? 'Nghiêm trọng' : lead.severity === 'high' ? 'Cao' : lead.severity === 'medium' ? 'Trung bình' : 'Thấp',
      "Nguồn": getSourceLabel(lead.source),
      "Người báo": lead.reporterName || "",
      "SĐT Người báo": lead.reporterPhone || "",
      "Cửa hàng": lead.storeName || "",
      "Địa chỉ": `${lead.location.address || ""}, ${lead.location.ward || ""}, ${lead.location.district || ""}, ${lead.location.province || ""}`,
      "Mô tả": lead.description,
      "Ngày tạo": new Date(lead.reportedAt).toLocaleString('vi-VN'),
      "Hạn xử lý": new Date(lead.sla.deadline).toLocaleString('vi-VN'),
      "Người xử lý": lead.assignedTo?.userName || "Chưa giao"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    // Auto-width for columns
    const wscols = [
      { wch: 15 }, // Mã Lead
      { wch: 30 }, // Tiêu đề
      { wch: 15 }, // Trạng thái
      { wch: 12 }, // Mức độ
      { wch: 15 }, // Nguồn
      { wch: 20 }, // Người báo
      { wch: 15 }, // SĐT
      { wch: 25 }, // Cửa hàng
      { wch: 40 }, // Địa chỉ
      { wch: 50 }, // Mô tả
      { wch: 20 }, // Ngày tạo
      { wch: 20 }, // Hạn xử lý
      { wch: 20 }, // Người xử lý
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `Danh_sach_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Đã xuất file Excel thành công");
  };



  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className="mt-4">
        <Breadcrumb
          items={[
            {
              label: "Nguồn tin, Rủi ro",
              path: "/lead-risk/inbox",
            },
            { label: "Xử lý nguồn tin hằng ngày" },
          ]}
        />
      </div>


      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Xử lý nguồn tin hằng ngày</h1>
          <p className={styles.subtitle}>
            Xử lý nguồn tin hàng ngày
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.aiDemoButton}
            onClick={() => navigate("/lead-risk/inbox-ai-demo")}
            style={{
              marginRight: "var(--spacing-3)",
              height: "44px",
              padding: "0 var(--spacing-4)",
              background:
                "linear-gradient(135deg, rgba(0, 92, 182, 0.1) 0%, rgba(0, 92, 182, 0.05) 100%)",
              border: "1px solid var(--primary)",
              borderRadius: "var(--radius)",
              color: "var(--primary)",
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-semibold)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--primary)";
              e.currentTarget.style.color =
                "var(--primary-foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(0, 92, 182, 0.1) 0%, rgba(0, 92, 182, 0.05) 100%)";
              e.currentTarget.style.color = "var(--primary)";
            }}
          >
            <span style={{ fontSize: "18px" }}>🤖</span>
            <span>Trợ lý ảo của bạn</span>
          </button>
          <button
            className={styles.duplicateButton}
            onClick={() =>
              navigate("/lead-risk/duplicate-demo")
            }
            style={{
              marginRight: "var(--spacing-3)",
              height: "44px",
              padding: "0 var(--spacing-4)",
              background: "rgba(255, 255, 255, 1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--muted)";
              e.currentTarget.style.borderColor =
                "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "rgba(255, 255, 255, 1)";
              e.currentTarget.style.borderColor =
                "var(--border)";
            }}
          >
            <Copy size={16} />
            <span>Phát hiện trùng</span>
          </button>
          <button
            onClick={handleExportExcel}
            style={{
              marginRight: "var(--spacing-3)",
              height: "44px",
              padding: "0 var(--spacing-4)",
              background: "rgba(255, 255, 255, 1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <Download size={16} />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => {
              refetch();
              toast.info("Đang tải lại dữ liệu...");
            }}
            style={{
              marginRight: "var(--spacing-3)",
              height: "44px",
              padding: "0 var(--spacing-4)",
              background: "rgba(255, 255, 255, 1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <RefreshCw size={16} />
            <span>Tải lại</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              marginRight: "var(--spacing-3)",
              height: "44px",
              padding: "0 var(--spacing-4)",
              background: "var(--primary)",
              border: "none",
              borderRadius: "var(--radius)",
              color: "var(--primary-foreground)",
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-2)",
            }}
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className={styles.statsOverview}>
        <div
          className={styles.statCard}
          onClick={() => {
            setSelectedStatuses([]);
            setSelectedAssignments([]);
            setSearchQuery("");
          }}
        >
          <div
            className={styles.statIcon}
            style={{
              backgroundColor: "rgba(239, 246, 255, 1)",
              color: "var(--primary)",
            }}
          >
            <Inbox size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {allLeads.length}
            </div>
            <div className={styles.statLabel}>
              Tổng số nguồn tin
            </div>
            <div className={styles.statDetail}>
              Toàn bộ lead trong hệ thống
            </div>
          </div>
        </div>

        <div
          className={styles.statCard}
          onClick={() => {
            setSelectedStatuses(["new"]);
            setSelectedAssignments([]);
          }}
        >
          <div
            className={styles.statIcon}
            style={{
              backgroundColor: "rgba(239, 246, 255, 1)",
              color: "var(--primary)",
            }}
          >
            <CheckSquare size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{newLeads}</div>
            <div className={styles.statLabel}>
              Mới
            </div>
            <div className={styles.statDetail}>
              Cần phân loại ngay
            </div>
          </div>
        </div>



        <div
          className={styles.statCard}
          onClick={() => {
            setSelectedStatuses(["in_progress", "processing", "process_paused"]);
            setSelectedAssignments([]);
          }}
        >
          <div
            className={styles.statIcon}
            style={{
              backgroundColor: "rgba(254, 249, 195, 1)",
              color: "rgba(161, 98, 7, 1)",
            }}
          >
            <Loader2 size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {inProgressLeads}
            </div>
            <div className={styles.statLabel}>Đang xử lý / Tạm dừng xử lý</div>
            <div className={styles.statDetail}>
              Đang thực hiện
            </div>
          </div>
        </div>

        <div
          className={styles.statCard}
          onClick={() => {
            setSelectedStatuses(["resolved"]);
            setSelectedAssignments([]);
          }}
        >
          <div
            className={styles.statIcon}
            style={{
              backgroundColor: "rgba(220, 252, 231, 1)",
              color: "rgba(21, 128, 61, 1)",
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {resolvedLeads}
            </div>
            <div className={styles.statLabel}>
              Đã giải quyết
            </div>
            <div className={styles.statDetail}>
              Hoàn thành xử lý
            </div>
          </div>
        </div>

        <div
          className={styles.statCard}
          onClick={() => {
            setSelectedStatuses(["cancelled", "rejected"]);
          }}
        >
          <div
            className={styles.statIcon}
            style={{
              backgroundColor: "rgba(243, 244, 246, 1)",
              color: "rgba(75, 85, 99, 1)",
            }}
          >
            <Ban size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {cancelledLeads}
            </div>
            <div className={styles.statLabel}>Đã hủy / Từ chối</div>
            <div className={styles.statDetail}>
              Lead đã bị hủy
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Row - Single Row with All Elements */}
      <div className={styles.filterRow}>
        <MultiSelectDropdown
          label="Trạng thái"
          options={[
            { value: "new", label: "Mới", count: newLeads },
            {
              value: "processing",
              label: "Đang xử lý",
              count: processingLeads,
            },
            {
              value: "process_paused",
              label: "Tạm dừng xử lý",
              count: processPausedLeads,
            },
            {
              value: "resolved",
              label: "Đã giải quyết",
              count: resolvedLeads,
            },
            {
              value: "cancelled",
              label: "Đã hủy",
              count: cancelledLeadsOnly,
            },
            {
              value: "rejected",
              label: "Đã từ chối",
              count: rejectedLeads,
            }
          ]}
          selectedValues={selectedStatuses}
          onChange={setSelectedStatuses}
          placeholder="Tất cả"
        />

        <MultiSelectDropdown
          label="Phân công"
          options={[
            {
              value: "assigned",
              label: "Đã giao",
              count: allLeads.filter((l) => l.assignedTo)
                .length,
            },
            {
              value: "unassigned",
              label: "Chưa giao",
              count: unassignedLeads,
            },
            {
              value: "assigned_to_me",
              label: "Của tôi",
              count: assignedToMe,
            },
          ]}
          selectedValues={selectedAssignments}
          onChange={setSelectedAssignments}
          placeholder="Tất cả"
        />

        <MultiSelectDropdown
          label="Mức độ"
          options={[
            {
              value: "critical",
              label: "Nghiêm trọng",
              count: allLeads.filter((l) => l.severity === "critical").length,
            },
            {
              value: "high",
              label: "Cao",
              count: allLeads.filter((l) => l.severity === "high").length,
            },
            {
              value: "medium",
              label: "Trung bình",
              count: allLeads.filter((l) => l.severity === "medium").length,
            },
            {
              value: "low",
              label: "Thấp",
              count: allLeads.filter((l) => l.severity === "low").length,
            },
          ]}
          selectedValues={selectedSeverities}
          onChange={setSelectedSeverities}
          placeholder="Tất cả"
        />

        <MultiSelectDropdown
          label="Danh mục vi phạm"
          options={[
            {
              value: "Niêm yết giá không đúng",
              label: "Niêm yết giá không đúng",
              count: allLeads.filter((l) => l.category === "Niêm yết giá không đúng").length,
            },
            {
              value: "Vi phạm VSATTP",
              label: "Vi phạm VSATTP",
              count: allLeads.filter((l) => l.category === "Vi phạm VSATTP").length,
            },
            {
              value: "Hàng giả, hàng nhái",
              label: "Hàng giả, hàng nhái",
              count: allLeads.filter((l) => l.category === "Hàng giả, hàng nhái").length,
            },
            {
              value: "Hàng không rõ nguồn gốc",
              label: "Hàng không rõ nguồn gốc",
              count: allLeads.filter((l) => l.category === "Hàng không rõ nguồn gốc").length,
            },
            {
              value: "Hàng hết hạn",
              label: "Hàng hết hạn",
              count: allLeads.filter((l) => l.category === "Hàng hết hạn").length,
            },
            {
              value: "Gian lận thương mại",
              label: "Gian lận thương mại",
              count: allLeads.filter((l) => l.category === "Gian lận thương mại").length,
            },
            {
              value: "Vi phạm quy định kinh doanh",
              label: "Vi phạm quy định kinh doanh",
              count: allLeads.filter((l) => l.category === "Vi phạm quy định kinh doanh").length,
            },
            {
              value: "Khác",
              label: "Khác",
              count: allLeads.filter((l) => l.category === "Khác").length,
            },
          ]}
          selectedValues={selectedCategories}
          onChange={setSelectedCategories}
          placeholder="Tất cả"
        />

        {/* Search Box - On the right */}
        <div className={styles.searchBoxInline}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tiêu đề, người báo, cửa hàng"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* View Map Button */}
        <button
          className={styles.viewMapButton}
          onClick={() =>
            alert("Chức năng xem bản đồ đang được phát triển")
          }
          title="Xem bản đồ"
        >
          <Map size={18} />
          <span>Xem Map</span>
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            className={styles.clearFiltersBtn}
            onClick={clearAllFilters}
          >
            <X size={18} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {selectedLeads.size > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkActionsLeft}>
            <CheckSquare size={18} />
            <span>{selectedLeads.size} lead đã chọn</span>
            <div
              className={styles.deselectButton}
              onClick={() => setSelectedLeads(new Set())}
            >
              Bỏ chọn
            </div>
          </div>
          <div className={styles.bulkActionsRight}>
            {(() => {
              // Determine common status
              const selectedObjects = allLeads.filter((l) => selectedLeads.has(l._id));
              const statuses = new Set(selectedObjects.map((l) => l.status));

              if (statuses.size !== 1) {
                return <span style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>Chọn các lead cùng trạng thái để thao tác</span>;
              }

              const status = statuses.values().next().value;

              const performBulkUpdate = async (targetStatus: LeadStatus) => {
                try {
                  const supabase = supabaseClient;
                  const { error } = await supabase
                    .from("leads")
                    .update({ status: targetStatus, updated_at: new Date().toISOString() })
                    .in("_id", Array.from(selectedLeads));

                  if (error) throw error;
                  toast.success("Cập nhật thành công");
                  setSelectedLeads(new Set());
                  refetch();
                } catch (e: any) {
                  toast.error("Lỗi: " + e.message);
                }
              };

              const openBulkConfirm = (
                title: string,
                message: string,
                targetStatus: LeadStatus,
                type: "info" | "warning" | "danger" | "success" = "warning"
              ) => {
                setConfirmDialog({
                  isOpen: true,
                  title,
                  message,
                  confirmText: "Xác nhận",
                  type,
                  onConfirm: () => performBulkUpdate(targetStatus),
                });
              };

              switch (status) {
                case "new":
                  return (
                    <>
                      <button
                        className={styles.bulkButton}
                        onClick={() => {
                          setCurrentLead(null);
                          setIsAssignModalOpen(true);
                        }}
                      >
                        <UserPlus size={16} /> Giao việc
                      </button>
                      <button
                        className={styles.bulkButtonDanger}
                        onClick={() => openBulkConfirm(
                          "Hủy bỏ leads",
                          `Bạn có chắc muốn hủy bỏ ${selectedLeads.size} leads đang chọn? Hành động này không thể hoàn tác.`,
                          "cancelled",
                          "danger"
                        )}
                      >
                        <Ban size={16} /> Hủy bỏ
                      </button>
                    </>
                  );

                case "verifying": // Đang xác minh
                  return (
                    <>
                      <button
                        className={styles.bulkButton}
                        onClick={() => {
                          setCurrentLead(null);
                          setIsAssignModalOpen(true);
                        }}
                      >
                        Giao xử lý
                      </button>
                      <button
                        className={styles.bulkButton}
                        onClick={() => openBulkConfirm(
                          "Tạm dừng xác minh",
                          `Bạn có chắc muốn tạm dừng xác minh ${selectedLeads.size} leads đang chọn?`,
                          "verify_paused",
                          "warning"
                        )}
                      >
                        <Pause size={16} /> Tạm dừng xác minh
                      </button>
                    </>
                  );

                case "verify_paused": // Tạm dừng xác minh
                  return (
                    <button
                      className={styles.bulkButton}
                      onClick={() => openBulkConfirm(
                        "Tiếp tục xác minh",
                        `Bạn có chắc muốn tiếp tục xác minh ${selectedLeads.size} leads đang chọn?`,
                        "verifying",
                        "success"
                      )}
                    >
                      <Play size={16} /> Tiếp tục xác minh
                    </button>
                  );

                case "processing": // Đang xử lý
                  return (
                    <>
                      <button
                        className={styles.bulkButton}
                        onClick={() => openBulkConfirm(
                          "Tạm dừng xử lý",
                          `Bạn có chắc muốn tạm dừng xử lý ${selectedLeads.size} leads đang chọn?`,
                          "process_paused",
                          "warning"
                        )}
                      >
                        <Pause size={16} /> Tạm dừng xử lý
                      </button>
                      <button
                        className={styles.bulkButton}
                        onClick={() => openBulkConfirm(
                          "Hoàn thành xử lý",
                          `Bạn có chắc muốn hoàn thành ${selectedLeads.size} leads đang chọn?`,
                          "resolved",
                          "success"
                        )}
                        style={{ borderColor: "var(--green-600)", color: "var(--green-600)" }}
                      >
                        <CheckCircle2 size={16} /> Hoàn thành
                      </button>
                      <button
                        className={styles.bulkButtonDanger}
                        onClick={() => openBulkConfirm(
                          "Hủy bỏ leads",
                          `Bạn có chắc muốn hủy bỏ ${selectedLeads.size} leads đang chọn? Hành động này không thể hoàn tác.`,
                          "cancelled",
                          "danger"
                        )}
                      >
                        <Ban size={16} /> Hủy bỏ
                      </button>
                    </>
                  );

                case "process_paused": // Tạm dừng xử lý
                  return (
                    <button
                      className={styles.bulkButton}
                      onClick={() => openBulkConfirm(
                        "Tiếp tục xử lý",
                        `Bạn có chắc muốn tiếp tục xử lý ${selectedLeads.size} leads đang chọn?`,
                        "processing",
                        "success"
                      )}
                    >
                      <Play size={16} /> Tiếp tục xử lý
                    </button>
                  );

                case "resolved": // Đã xử lý
                  return (
                    <>
                      <button
                        className={styles.bulkButton}
                        onClick={() => openBulkConfirm(
                          "Mở lại xử lý",
                          `Bạn có chắc muốn mở lại ${selectedLeads.size} leads để xử lý tiếp?`,
                          "processing",
                          "info"
                        )}
                      >
                        <RefreshCw size={16} /> Mở lại
                      </button>
                      <button
                        className={styles.bulkButton}
                        onClick={() => openBulkConfirm(
                          "Yêu cầu xác minh lại",
                          `Bạn có chắc muốn yêu cầu xác minh lại ${selectedLeads.size} leads?`,
                          "verifying",
                          "warning"
                        )}
                      >
                        <RotateCcw size={16} /> Yêu cầu xác minh lại
                      </button>
                    </>
                  );

                case "rejected":
                  return null;

                default:
                  return null;
              }
            })()}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingState}>
          <Loader2 size={48} className={styles.spinner} />
          <p>Đang tải dữ liệu từ Supabase...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorState}>
          <AlertCircle size={48} />
          <p className={styles.errorTitle}>
            Lỗi kết nối Supabase
          </p>
          <p className={styles.errorMessage}>{error}</p>
          <button
            className={styles.retryButton}
            onClick={refetch}
          >
            <RefreshCw size={16} />
            Thử lại
          </button>
          <p className={styles.errorHint}>
            Hãy kiểm tra:
            <br />
            • Bảng 'leads' đã được tạo chưa?
            <br />
            • RLS policies đã được config chưa?
            <br />• Mở Console (F12) để xem logs chi tiết
          </p>
        </div>
      )}

      {/* Duplicate Warning Banner */}
      {allLeadIds.length !== uniqueLeadIds.size && !loading && (
        <div className={styles.duplicateWarning}>
          <AlertCircle size={20} />
          <div className={styles.duplicateWarningContent}>
            <strong>
              ⚠️ Phát hiện dữ liệu trùng lặp trong database!
            </strong>
            <p>
              Có {allLeadIds.length - uniqueLeadIds.size} bản
              ghi duplicate lead_code. Cần dọn dẹp để tránh lỗi
              hiển thị.
            </p>
          </div>
          <button
            className={styles.cleanupButton}
            onClick={() => navigate("/database-cleanup")}
          >
            <Trash2 size={16} />
            Dọn dẹp ngay
          </button>
        </div>
      )}

      {/* Leads Table */}
      {!loading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      filteredLeads.length > 0 &&
                      selectedLeads.size === filteredLeads.length
                    }
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                  />
                </th>
                <th style={{ width: "120px" }}>Mã Lead</th>
                <th style={{ width: "120px" }}>Mức độ</th>
                <th style={{ width: "280px" }}>Danh mục vi phạm</th>
                <th style={{ width: "180px" }}>Người báo</th>
                <th style={{ width: "160px" }}>Cửa hàng</th>
                <th style={{ width: "180px" }}>Nội dung</th>
                <th style={{ width: "140px" }}>Trạng thái</th>
                <th style={{ width: "140px" }}>Thời gian xảy ra</th>
                <th style={{ width: "140px" }}>Người xử lý</th>
                <th
                  style={{
                    width: "140px",
                    textAlign: "left",
                  }}
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className={
                    selectedLeads.has(lead._id)
                      ? styles.rowSelected
                      : ""
                  }
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(lead._id)}
                        onChange={() => toggleSelectLead(lead._id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <span className={styles.leadCode}>
                      {lead.code}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor:
                          lead.severity === "critical"
                            ? "#fee2e2"
                            : lead.severity === "high"
                              ? "#ffedd5"
                              : lead.severity === "medium"
                                ? "#fef9c3"
                                : "#dcfce7",
                        color:
                          lead.severity === "critical"
                            ? "#ef4444"
                            : lead.severity === "high"
                              ? "#f97316"
                              : lead.severity === "medium"
                                ? "#eab308"
                                : "#22c55e",
                        border: `1px solid ${lead.severity === "critical"
                          ? "#fecaca"
                          : lead.severity === "high"
                            ? "#fed7aa"
                            : lead.severity === "medium"
                              ? "#fef08a"
                              : "#bbf7d0"
                          }`,
                      }}
                    >
                      {lead.severity === "critical"
                        ? "Nghiêm trọng"
                        : lead.severity === "high"
                          ? "Cao"
                          : lead.severity === "medium"
                            ? "Trung bình"
                            : "Thấp"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.leadTitle}>
                      {getCategoryLabel(lead.category)}
                    </div>
                  </td>
                  <td>
                    <div className={styles.reporterInfo}>
                      <span className={styles.reporterName}>
                        {lead.reporterName || "-"}
                      </span>
                      <span className={styles.reporterPhone}>
                        {lead.reporterPhone || "-"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.storeName}>
                      {lead.storeName || "-"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.contentPreview}>
                      {lead.description.substring(0, 50)}...
                    </div>
                  </td>
                  <td>
                    <StatusBadge
                      status={lead.status}
                      size="sm"
                    />
                  </td>
                  <td>
                    <div className={styles.contentPreview}>
                      {lead.occurred_at
                        ? new Date(lead.occurred_at).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "-"
                      }
                    </div>
                  </td>
                  <td>
                    <span className={styles.assignee}>
                      {lead.assignedTo
                        ? lead.assignedTo.userName
                        : "Chưa giao"}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className={styles.actionButtons}>
                      <LeadActionMenu
                        status={lead.status}
                        onAction={(action) =>
                          handleLeadAction(lead, action)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className={styles.emptyState}>
              <Inbox size={48} />
              <p>Không tìm thấy lead nào</p>
              <p className={styles.emptyHint}>
                Thử điều chỉnh bộ lọc hoặc tìm kiếm
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredLeads.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {startIndex + 1}-
            {Math.min(endIndex, filteredLeads.length)} /{" "}
            {filteredLeads.length} leads
          </div>
          <div className={styles.paginationButtons}>
            <button
              className={styles.pageButton}
              disabled={currentPage === 1}
              onClick={goToPrevPage}
            >
              Trước
            </button>
            {getPageNumbers().map((page, index) => (
              <button
                key={
                  typeof page === "number"
                    ? page
                    : `ellipsis-${index}`
                }
                className={
                  currentPage === page
                    ? styles.pageButtonActive
                    : styles.pageButton
                }
                onClick={() =>
                  typeof page === "number" && goToPage(page)
                }
                disabled={typeof page !== "number"}
              >
                {page}
              </button>
            ))}
            <button
              className={styles.pageButton}
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
            >
              Sau
            </button>
          </div>

          <div style={{ marginLeft: "16px", display: "flex", alignItems: "center" }}>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                height: "36px",
                padding: "0 12px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {[20, 50, 100, 200, 500].map(size => (
                <option key={size} value={size}>
                  {size} / trang
                </option>
              ))}
            </select>
            <span style={{ marginLeft: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
              Tổng số bản ghi: {filteredLeads.length}
            </span>
          </div>

        </div>
      )}

      {/* Modals */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formMode}
        lead={editingLead}
        onSave={handleSaveLead}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deletingLead ? "Xóa Lead" : "Xóa nhiều Leads"}
        message={
          deletingLead
            ? `Bạn có chắc muốn xóa lead "${deletingLead.code}"? Hành động này không thể hoàn tác.`
            : `Bạn có chắc muốn xóa ${selectedLeads.size} leads đã chọn? Hành động này không thể hoàn tác.`
        }
        count={deletingLead ? undefined : selectedLeads.size}
      />
      <WatchlistPanel
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        items={watchlistItems}
        onRemoveItem={handleRemoveFromWatchlist}
        onViewDetails={handleViewWatchlistItemDetails}
      />
      <ConfirmationDialogComponent
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        leadCode={confirmDialog.leadCode}
      />
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        lead={currentLead}
        onSave={(note) => {
          console.log(
            "Adding note:",
            note,
            "to lead:",
            currentLead?.code,
          );
          alert(
            `Đã thêm ghi chú cho lead ${currentLead?.code}`,
          );
        }}
      />
      <UpdateSLAModal
        isOpen={isUpdateSLAModalOpen}
        onClose={() => setIsUpdateSLAModalOpen(false)}
        lead={currentLead}
        onSave={(deadline, reason) => {
          console.log(
            "Updating SLA:",
            { deadline, reason },
            "for lead:",
            currentLead?.code,
          );
          alert(
            `Đã cập nhật thời hạn cho lead ${currentLead?.code}`,
          );
        }}
      />
      <RejectLeadModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        lead={currentLead}
        onSave={(reason) => {
          if (currentLead) {
            handleRejectLead(currentLead, reason);
          }
        }}
      />
      <EvidenceDocumentModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        leadId={currentLead?.code || ""}
        leadTitle={currentLead?.title || ""}
      />
      <AssignLeadModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        lead={currentLead}
        leadCount={!currentLead ? selectedLeads.size : undefined}
        onAssign={async (data) => {
          const leadsToAssign = currentLead ? [currentLead] : allLeads.filter(l => selectedLeads.has(l._id));

          console.log(
            "👤 [LeadInbox] Assigning leads:",
            leadsToAssign.map(l => l.code),
            "with data:",
            data,
          );

          try {
            const supabase = supabaseClient;
            let successCount = 0;
            let errorCount = 0;

            // Loop through each lead and assign
            for (const lead of leadsToAssign) {
              // Step 1: Insert into map_inspection_sessions table
              const { data: sessionData, error: sessionError } =
                await supabase
                  .from("map_inspection_sessions")
                  .insert({
                    merchant_id: data.merchantId,
                    status: 1,
                    type: "passive",
                    description: data.description || null,
                  })
                  .select("_id")
                  .single();

              if (sessionError) {
                console.error(
                  `❌ [LeadInbox] Error creating session for lead ${lead.code}:`,
                  sessionError,
                );
                errorCount++;
                continue;
              }

              // Step 2: Insert into lead_sessions table
              const { error: leadSessionError } = await supabase
                .from("lead_sessions")
                .insert({
                  lead_id: lead._id,
                  session_id: sessionData._id,
                });

              if (leadSessionError) {
                console.error(
                  `❌ [LeadInbox] Error linking session for lead ${lead.code}:`,
                  leadSessionError,
                );
                errorCount++;
                continue;
              }

              // Step 3: Update lead status
              const { error: updateError } = await supabase
                .from("leads")
                .update({ status: "processing" })
                .eq("_id", lead._id);

              if (updateError) {
                console.error(
                  `❌ [LeadInbox] Error updating status for lead ${lead.code}:`,
                  updateError,
                );
                errorCount++;
                continue;
              }

              successCount++;
            }

            if (successCount > 0) {
              toast.success(`Đã giao việc thành công ${successCount} leads`);
              setIsAssignModalOpen(false);
              setSelectedLeads(new Set()); // Clear selection
              refetch();
            }

            if (errorCount > 0) {
              toast.error(`Giao việc thất bại ${errorCount} leads. Vui lòng kiểm tra lại.`);
            }

          } catch (error) {
            console.error(
              "❌ [LeadInbox] Error assigning leads:",
              error,
            );
            toast.error("Đã xảy ra lỗi khi giao việc");
          }
        }}
      />

      {/* Lead Preview Panel */}
      <LeadPreviewPanel
        lead={selectedLeadForPreview}
        isOpen={showPreviewPanel}
        onClose={() => {
          setShowPreviewPanel(false);
          setSelectedLeadForPreview(null);
        }}
        onViewFull={() => {
          if (selectedLeadForPreview) {
            navigate(`/lead-risk/lead/${selectedLeadForPreview._id}`);
          }
        }}
      />

      {/* Quick Actions Sidebar */}
      <QuickActionsSidebar
        lead={selectedLeadForQuickActions}
        isOpen={showQuickActionsSidebar}
        onClose={() => {
          setShowQuickActionsSidebar(false);
          setSelectedLeadForQuickActions(null);
        }}
        onResumeProcessing={() => {
          if (selectedLeadForQuickActions) {
            handleResumeProcessing(selectedLeadForQuickActions);
          }
        }}
      />

      {/* Create Lead Source Modal */}
      <CreateLeadSourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}


