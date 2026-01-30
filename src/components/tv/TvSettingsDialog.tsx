import React from 'react';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import NativeSelect from '@/components/ui-kit/NativeSelect';
import { useTvData } from '@/contexts/TvDataContext';
import type { TvSettings } from '@/types/tv.types';

interface TvSettingsDialogProps {
  settings: TvSettings;
  onSettingsChange: (updates: Partial<TvSettings>) => void;
  currentScene: number;
  totalScenes: number;
  onSceneChange: (direction: 'prev' | 'next') => void;
}

const SCENE_INTERVAL_OPTIONS = [
  { value: '10', label: '10 giây' },
  { value: '15', label: '15 giây' },
  { value: '20', label: '20 giây' },
  { value: '25', label: '25 giây' },
  { value: '30', label: '30 giây' },
  { value: '45', label: '45 giây' },
  { value: '60', label: '60 giây' },
];

const TIME_RANGE_OPTIONS = [
  { value: '3', label: '3 ngày' },
  { value: '7', label: '7 ngày' },
  { value: '30', label: '30 ngày' },
  { value: '90', label: '90 ngày' },
];

export default function TvSettingsDialog({
  settings,
  onSettingsChange,
  currentScene,
  totalScenes,
  onSceneChange,
}: TvSettingsDialogProps) {
  const {
    filters,
    setFilters,
    layers,
    setLayers,
    autoRotationEnabled,
    setAutoRotationEnabled,
  } = useTvData();

  const handleLayerToggle = (key: keyof typeof layers) => {
    setLayers({ ...layers, [key]: !layers[key] });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title="Cài đặt màn hình"
          style={{ padding: '6px 10px' }}
        >
          <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Cài đặt màn hình TV</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <section className="space-y-3">
            <div className="text-sm font-semibold text-foreground">Trình chiếu</div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="tv-auto-play">Tự chạy cảnh</Label>
              <Switch
                id="tv-auto-play"
                checked={settings.autoPlayScenes}
                onCheckedChange={(value) => onSettingsChange({ autoPlayScenes: value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-2 text-xs text-muted-foreground">Chu kỳ đổi cảnh</Label>
                <NativeSelect
                  value={String(settings.sceneIntervalSeconds)}
                  onChange={(value) => onSettingsChange({ sceneIntervalSeconds: Number(value) })}
                  options={SCENE_INTERVAL_OPTIONS}
                />
              </div>
              <div>
                <Label className="mb-2 text-xs text-muted-foreground">Cảnh đang xem</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onSceneChange('prev')}
                    style={{ width: '36px', height: '36px' }}
                  >
                    <ChevronLeft style={{ width: '16px', height: '16px' }} />
                  </Button>
                  <div className="flex-1 rounded-md border border-border bg-muted text-center text-sm font-semibold text-foreground" style={{ padding: '8px 0' }}>
                    {currentScene}/{totalScenes}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onSceneChange('next')}
                    style={{ width: '36px', height: '36px' }}
                  >
                    <ChevronRight style={{ width: '16px', height: '16px' }} />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-border" />

          <section className="space-y-3">
            <div className="text-sm font-semibold text-foreground">Bộ lọc hiển thị</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-2 text-xs text-muted-foreground">Khoảng thời gian</Label>
                <NativeSelect
                  value={String(filters.timeRangeDays)}
                  onChange={(value) => setFilters({ ...filters, timeRangeDays: Number(value) })}
                  options={TIME_RANGE_OPTIONS}
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2">
                <Label htmlFor="tv-auto-rotate" className="text-sm">
                  Tự động xoay địa bàn
                </Label>
                <Switch
                  id="tv-auto-rotate"
                  checked={autoRotationEnabled}
                  onCheckedChange={(value) => setAutoRotationEnabled(value)}
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-border" />

          <section className="space-y-3">
            <div className="text-sm font-semibold text-foreground">Lớp dữ liệu bản đồ</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="layer-hotspots">Điểm nóng</Label>
                <Switch
                  id="layer-hotspots"
                  checked={layers.hotspots}
                  onCheckedChange={() => handleLayerToggle('hotspots')}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="layer-leads">Nguồn tin</Label>
                <Switch
                  id="layer-leads"
                  checked={layers.leads}
                  onCheckedChange={() => handleLayerToggle('leads')}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="layer-tasks">Nhiệm vụ quá hạn</Label>
                <Switch
                  id="layer-tasks"
                  checked={layers.tasks}
                  onCheckedChange={() => handleLayerToggle('tasks')}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="layer-evidences">Chứng cứ</Label>
                <Switch
                  id="layer-evidences"
                  checked={layers.evidences}
                  onCheckedChange={() => handleLayerToggle('evidences')}
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-border" />

          <section className="space-y-3">
            <div className="text-sm font-semibold text-foreground">Thành phần hiển thị</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="tv-alert-ticker">Thanh cảnh báo</Label>
                <Switch
                  id="tv-alert-ticker"
                  checked={settings.showAlertTicker}
                  onCheckedChange={(value) => onSettingsChange({ showAlertTicker: value })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="tv-emergency-banner">Banner nguy cấp</Label>
                <Switch
                  id="tv-emergency-banner"
                  checked={settings.showEmergencyBanner}
                  onCheckedChange={(value) => onSettingsChange({ showEmergencyBanner: value })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="tv-citizen-gallery">Ảnh phản ánh</Label>
                <Switch
                  id="tv-citizen-gallery"
                  checked={settings.showCitizenGallery}
                  onCheckedChange={(value) => onSettingsChange({ showCitizenGallery: value })}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
