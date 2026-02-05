import React, { useState } from 'react';
import { ImageIcon, Upload, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  StoreImage,
  ImageCategory,
  imageCategories,
  getCategoryLabel,
  getImagesByCategory,
  getImageCategoryCounts,
  addImages,
  deleteImage,
  updateImageCategory,
  generateImageId,
} from '@/utils/data/mockImages';
import { ImageDetailModal } from './ImageDetailModal';
import { UploadPhotosDialog } from './UploadPhotosDialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
  storeId: number;
  loading?: boolean;
  hasPermission?: boolean;
}

export function ImageGallery({
  storeId,
  loading = false,
  hasPermission = true,
}: ImageGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<ImageCategory>('all');
  const [selectedImage, setSelectedImage] = useState<StoreImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<StoreImage | null>(null);
  const [newCategory, setNewCategory] = useState<Exclude<ImageCategory, 'all'>>('storefront');
  const [forceUpdate, setForceUpdate] = useState(0);

  // Get images and counts - refresh when forceUpdate changes
  const images = getImagesByCategory(storeId, activeCategory);
  const categoryCounts = getImageCategoryCounts(storeId);

  // Handle image click
  const handleImageClick = (image: StoreImage, e: React.MouseEvent) => {
    // Don't open modal if clicking action buttons
    if ((e.target as HTMLElement).closest('[data-action]')) {
      return;
    }
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedImage(null), 200);
  };

  // Handle upload
  const handleUpload = (files: Array<{ file: File; preview: string; category: Exclude<ImageCategory, 'all'> }>) => {
    const now = new Date();
    const displayDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newImages: StoreImage[] = files.map((uploadFile) => ({
      id: generateImageId(),
      storeId,
      category: uploadFile.category,
      url: uploadFile.preview,
      title: uploadFile.file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      uploadedBy: 'Người dùng hiện tại', // In production: get from auth
      uploadedAt: now.toISOString(),
      displayUploadedAt: displayDate,
    }));

    addImages(newImages);
    setForceUpdate(prev => prev + 1);
    toast.success(`Đã tải lên ${newImages.length} ảnh thành công`);
  };

  // Handle delete
  const handleDelete = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteImageId(imageId);
  };

  const confirmDelete = () => {
    if (deleteImageId) {
      const success = deleteImage(deleteImageId);
      if (success) {
        setForceUpdate(prev => prev + 1);
        toast.success('Đã xóa ảnh thành công');
      } else {
        toast.error('Không thể xóa ảnh');
      }
      setDeleteImageId(null);
    }
  };

  // Handle edit category
  const handleEditCategory = (image: StoreImage, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditImage(image);
    setNewCategory(image.category);
  };

  const confirmEditCategory = () => {
    if (editImage) {
      const success = updateImageCategory(editImage.id, newCategory);
      if (success) {
        setForceUpdate(prev => prev + 1);
        toast.success('Đã cập nhật danh mục thành công');
      } else {
        toast.error('Không thể cập nhật danh mục');
      }
      setEditImage(null);
    }
  };

  // No permission
  if (!hasPermission) {
    return (
      <div className={styles.noPermission}>
        <div className={styles.noPermissionIcon}>
          <ImageIcon size={48} />
        </div>
        <div className={styles.noPermissionTitle}>Không có quyền truy cập</div>
        <div className={styles.noPermissionText}>
          Bạn không có quyền xem hình ảnh của cơ sở này.
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        {/* Header Skeleton */}
        <div className={styles.header}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonDescription} />
        </div>

        {/* Tabs Skeleton */}
        <div className={styles.tabs}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.skeletonTab} />
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state for all categories
  if (categoryCounts.all === 0) {
    return (
      <div className={styles.emptyStateWrapper}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ImageIcon size={48} />
          </div>
          <div className={styles.emptyTitle}>Chưa có hình ảnh</div>
          <div className={styles.emptyText}>
            Hình ảnh phục vụ nghiệp vụ kiểm tra và quản lý cơ sở sẽ được hiển thị tại đây.
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)} className={`${styles.emptyButton} hover:!bg-blue-700 !text-white`}>
            <Upload size={20} />
            Tải ảnh lên
          </Button>
        </div>

        {/* Upload Photos Dialog */}
        <UploadPhotosDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onUpload={handleUpload}
          storeId={storeId}
        />
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {/* Header with Upload Button */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Ảnh nghiệp vụ kiểm tra</h2>
            <p className={styles.description}>
              Hình ảnh phục vụ kiểm tra, giám sát và quản lý cửa hàng
            </p>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)} className={styles.uploadButton} className='!text-white'>
            <Upload size={20} />
            Tải ảnh lên
          </Button>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabs}>
          {imageCategories.map((category) => {
            const count = categoryCounts[category];
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                onClick={() => setActiveCategory(category)}
                disabled={count === 0 && category !== 'all'}
              >
                <span className={styles.tabLabel}>{getCategoryLabel(category)}</span>
                <span className={styles.tabCount}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {images.length === 0 ? (
          <div className={styles.emptyCategoryState}>
            <ImageIcon size={32} className={styles.emptyCategoryIcon} />
            <p className={styles.emptyCategoryText}>
              Chưa có ảnh trong danh mục "{getCategoryLabel(activeCategory)}"
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {images.map((image) => (
              <div
                key={`${image.id}-${forceUpdate}`}
                className={styles.card}
                onClick={(e) => handleImageClick(image, e)}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={image.url}
                    alt={image.title}
                    className={styles.thumbnail}
                    loading="lazy"
                  />
                  <div className={styles.overlay}>
                    <ImageIcon size={24} className={styles.overlayIcon} />
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      data-action="edit"
                      onClick={(e) => handleEditCategory(image, e)}
                      title="Sửa danh mục"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      data-action="delete"
                      onClick={(e) => handleDelete(image.id, e)}
                      title="Xóa ảnh"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>{image.title}</div>
                  <div className={styles.cardMeta}>{image.displayUploadedAt}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      <ImageDetailModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      {/* Upload Photos Dialog */}
      <UploadPhotosDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUpload}
        storeId={storeId}
      />

      {/* Delete Image Confirm Dialog */}
      <AlertDialog open={deleteImageId !== null} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa hình ảnh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hình ảnh này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex gap-3'>
            <AlertDialogCancel className='hover:!border-red-300 hover:!text-red-700 hover:!bg-transparent' onClick={() => setDeleteImageId(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction className='bg-red-800 !text-white hover:bg-red-600' onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Category Dialog */}
      <Dialog open={editImage !== null} onOpenChange={() => setEditImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>
              Chọn danh mục mới cho ảnh "{editImage?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className={styles.dialogBody}>
            <Label htmlFor="category-select">Danh mục</Label>
            <Select
              value={newCategory}
              onValueChange={(value) => setNewCategory(value as Exclude<ImageCategory, 'all'>)}
            >
              <SelectTrigger id="category-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {imageCategories.filter(cat => cat !== 'all').map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className='flex gap-3'>
            <Button variant="outline" onClick={() => setEditImage(null)} className='hover:!text-white hover:!bg-red-700'>Hủy</Button>
            <Button className='!text-white' onClick={confirmEditCategory}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

