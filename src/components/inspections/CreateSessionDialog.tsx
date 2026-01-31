import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import styles from './CreateSessionDialog.module.css';
import { toast } from 'sonner';
import { fetchMerchants } from '@/utils/api/merchantsApi';
import { fetchDepartmentUsers } from '@/utils/api/departmentUsersApi';
import { Restaurant } from '@/utils/data/restaurantData';

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roundName: string;
  roundId?: string;
  leadUnitId?: string;
  provinceId?: string;
  wardId?: string;
  onCreateSession?: (sessionData: {
    storeId: string;
    storeName: string;
    storeAddress: string;
    inspectorId: string | null;
    inspectorName: string | null;
    startDate: string;
    endDate: string;
    notes: string;
  }) => void;
}


export function CreateSessionDialog({
  open,
  onOpenChange,
  roundName,
  leadUnitId,
  provinceId,
  wardId,
  onCreateSession,
}: CreateSessionDialogProps) {
  const [merchants, setMerchants] = useState<Restaurant[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [inspectors, setInspectors] = useState<{ id: string; name: string; position: string }[]>([]);
  const [loadingInspectors, setLoadingInspectors] = useState(false);

  // Fetch merchants logic
  useEffect(() => {
    if (open) {
      const loadMerchants = async () => {
        setLoadingMerchants(true);
        try {
          const data = await fetchMerchants(undefined, undefined, undefined, provinceId, wardId);
          setMerchants(data);
        } catch (error) {
          console.error("Error fetching merchants:", error);
          toast.error("Không thể tải danh sách cửa hàng");
        } finally {
          setLoadingMerchants(false);
        }
      };
      loadMerchants();
    }
  }, [open, provinceId, wardId]);

  // Fetch inspectors logic
  useEffect(() => {
    if (open && leadUnitId) {
      const loadInspectors = async () => {
        setLoadingInspectors(true);
        try {
          const data = await fetchDepartmentUsers(leadUnitId);
          const mapped = data.map(item => ({
            id: item.user_id,
            name: item.users?.full_name || 'Không xác định',
            position: 'Thanh tra viên' // Standard position if not provided by API
          }));
          setInspectors(mapped);
        } catch (error) {
          console.error("Error fetching inspectors:", error);
          toast.error("Không thể tải danh sách thanh tra viên");
        } finally {
          setLoadingInspectors(false);
        }
      };
      loadInspectors();
    } else if (open && !leadUnitId) {
      setInspectors([]);
    }
  }, [open, leadUnitId]);
  const [formData, setFormData] = useState({
    storeId: '',
    inspectorId: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.storeId) newErrors.storeId = 'Vui lòng chọn cửa hàng';
    if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    
    // Validate date range
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit logic
    const selectedStore = merchants.find((s) => s.id === formData.storeId);
    const selectedInspector = inspectors.find((i) => i.id === formData.inspectorId);

    // Call onCreateSession callback if provided
    if (onCreateSession && selectedStore) {
      onCreateSession({
        storeId: selectedStore.id,
        storeName: selectedStore.name,
        storeAddress: selectedStore.address,
        inspectorId: selectedInspector?.id || null,
        inspectorName: selectedInspector?.name || null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
      });
    }

    toast.success(`Đã tạo phiên làm việc tại ${selectedStore?.name}`);

    // Reset form
    setFormData({
      storeId: '',
      inspectorId: '',
      startDate: '',
      endDate: '',
      notes: '',
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      storeId: '',
      inspectorId: '',
      startDate: '',
      endDate: '',
      notes: '',
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className={styles.header}>
          <div className={styles.headerContent}>
            <FileText size={24} className={styles.headerIcon} />
            <div>
              <DialogTitle className={styles.title}>
                Tạo phiên làm việc mới
              </DialogTitle>
              <DialogDescription className={styles.subtitle}>
                Thiết lập kế hoạch kiểm tra chi tiết cho đợt <span className="font-semibold text-primary">"{roundName}"</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formBody}>
            {/* Section 1: Target Info */}
            <div className={styles.section}>
              
              <div className={styles.formField}>
                <label className={styles.label}>
                  Cửa hàng kiểm tra <span className={styles.required}>*</span>
                </label>
                <Select
                  value={formData.storeId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, storeId: value });
                    setErrors({ ...errors, storeId: '' });
                  }}
                >
                  <SelectTrigger className={cn(styles.selectTrigger, errors.storeId && styles.inputError)}>
                    <SelectValue placeholder="Chọn cửa hàng kiểm tra..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {loadingMerchants ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
                        <span className="text-sm">Đang tải cửa hàng...</span>
                      </div>
                    ) : merchants.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Không tìm thấy cửa hàng nào trong khu vực này
                      </div>
                    ) : (
                      merchants.map((store) => (
                        <SelectItem key={store.id} value={store.id} className="cursor-pointer focus:bg-primary/5">
                          <div className={styles.storeOption}>
                            <div className={styles.storeName}>{store.name}</div>
                            <div className={styles.storeAddress}>{store.address}</div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.storeId && (
                  <span className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.storeId}
                  </span>
                )}
              </div>
            </div>

            {/* Section 2: Assignment */}
            <div className={styles.section}>
              
              <div className={styles.formField}>
                <label className={styles.label}>Thanh tra viên phụ trách</label>
                <Select
                  value={formData.inspectorId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, inspectorId: value });
                    setErrors({ ...errors, inspectorId: '' });
                  }}
                >
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="Chọn thanh tra viên phụ trách..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingInspectors ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
                        <span className="text-sm">Đang tải danh sách...</span>
                      </div>
                    ) : inspectors.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {!leadUnitId ? 'Vui lòng chọn đợt kiểm tra trước' : 'Không có thanh tra viên nào'}
                      </div>
                    ) : (
                      inspectors.map((inspector) => (
                        <SelectItem key={inspector.id} value={inspector.id} className="cursor-pointer focus:bg-primary/5">
                          <div className={styles.inspectorOption}>
                            <div className={styles.inspectorName}>{inspector.name}</div>
                            <div className={styles.inspectorPosition}>{inspector.position}</div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.label}>Ngày bắt đầu <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    className={cn(styles.input, errors.startDate && styles.inputError)}
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData({ ...formData, startDate: e.target.value });
                      setErrors({ ...errors, startDate: '' });
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && (
                    <span className={styles.errorText}>
                      <AlertCircle size={12} /> {errors.startDate}
                    </span>
                  )}
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Ngày kết thúc <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    className={cn(styles.input, errors.endDate && styles.inputError)}
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({ ...formData, endDate: e.target.value });
                      setErrors({ ...errors, endDate: '' });
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.endDate && (
                    <span className={styles.errorText}>
                      <AlertCircle size={12} /> {errors.endDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Notes */}
            <div className={styles.section}>
              
              <div className={styles.formField}>
                <label className={styles.label}>Nội dung chi tiết</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Nhập ghi chú hoặc yêu cầu cụ thể cho phiên làm việc này..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className={styles.cancelBtn}
            >
              Hủy
            </Button>
            <Button 
              type="submit"
              className={styles.submitBtn}
            >
              Thiết lập phiên
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
