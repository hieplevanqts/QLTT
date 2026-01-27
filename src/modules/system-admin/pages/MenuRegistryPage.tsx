import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Badge } from '../../../app/components/ui/badge';
import { moduleAdminService } from '../services/moduleAdminService';
import type { MenuItem } from '../types';

const emptyMenu: MenuItem = {
  id: '',
  label: '',
  path: '',
  icon: '',
  order: 0,
  parentId: null,
  permissionsAny: [],
  rolesAny: [],
  moduleId: '',
  isEnabled: true,
};

export default function MenuRegistryPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuItem>(emptyMenu);
  const [error, setError] = useState<string | null>(null);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await moduleAdminService.getMenus();
      setMenus(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const sortedMenus = useMemo(() => {
    return [...menus].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [menus]);

  const handleEdit = (menu: MenuItem) => {
    setEditing(menu);
    setForm({
      ...menu,
      permissionsAny: menu.permissionsAny || [],
      rolesAny: menu.rolesAny || [],
    });
  };

  const handleCreate = () => {
    setEditing(null);
    setForm({ ...emptyMenu, order: sortedMenus.length + 1 });
  };

  const handleSave = async () => {
    setError(null);
    try {
      const payload: MenuItem = {
        ...form,
        permissionsAny: (form.permissionsAny || []).filter(Boolean),
        rolesAny: (form.rolesAny || []).filter(Boolean),
      };
      if (editing) {
        await moduleAdminService.updateMenu(editing.id, payload);
      } else {
        await moduleAdminService.createMenu(payload);
      }
      setForm(emptyMenu);
      setEditing(null);
      await loadMenus();
    } catch (err: any) {
      setError(err.message || 'Không thể lưu menu');
    }
  };

  const handleDelete = async (menuId: string) => {
    setError(null);
    try {
      await moduleAdminService.deleteMenu(menuId);
      await loadMenus();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa menu');
    }
  };

  const handleMove = async (menuId: string, direction: 'up' | 'down') => {
    const idx = sortedMenus.findIndex(item => item.id === menuId);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sortedMenus.length) return;
    const current = sortedMenus[idx];
    const target = sortedMenus[swapIdx];
    await Promise.all([
      moduleAdminService.updateMenu(current.id, { order: target.order }),
      moduleAdminService.updateMenu(target.id, { order: current.order }),
    ]);
    await loadMenus();
  };

  const parseList = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean);
  const listToString = (value?: string[]) => (value || []).join(', ');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản trị Menu</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh sách menu và phân quyền hiển thị</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm menu
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh sách menu</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Đang tải...</div>
          ) : (
            <div className="space-y-2">
              {sortedMenus.map(menu => (
                <div key={menu.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{menu.label}</span>
                      {!menu.isEnabled && <Badge variant="secondary">Tắt</Badge>}
                      {menu.parentId && <Badge variant="outline">Con</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {menu.path || 'Chưa có đường dẫn'} • thứ tự {menu.order ?? 0}
                    </div>
                    {(menu.permissionsAny?.length || menu.rolesAny?.length) ? (
                      <div className="text-xs text-muted-foreground">
                        {menu.permissionsAny?.length ? `Quyền: ${menu.permissionsAny.join(', ')}` : ''}
                        {menu.rolesAny?.length ? ` Vai trò: ${menu.rolesAny.join(', ')}` : ''}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleMove(menu.id, 'up')}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleMove(menu.id, 'down')}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(menu)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(menu.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{editing ? 'Cập nhật menu' : 'Tạo menu mới'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold">ID</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={form.id}
                onChange={e => setForm(prev => ({ ...prev, id: e.target.value }))}
                disabled={Boolean(editing)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Label</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={form.label}
                onChange={e => setForm(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Path</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={form.path || ''}
                onChange={e => setForm(prev => ({ ...prev, path: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Icon</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={form.icon || ''}
                onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">ID cha</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={form.parentId || ''}
                onChange={e => setForm(prev => ({ ...prev, parentId: e.target.value || null }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Thứ tự</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={form.order ?? 0}
                onChange={e => setForm(prev => ({ ...prev, order: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Quyền (dấu phẩy)</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={listToString(form.permissionsAny)}
                onChange={e => setForm(prev => ({ ...prev, permissionsAny: parseList(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Vai trò (dấu phẩy)</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={listToString(form.rolesAny)}
                onChange={e => setForm(prev => ({ ...prev, rolesAny: parseList(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">ID mô-đun</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={form.moduleId || ''}
                onChange={e => setForm(prev => ({ ...prev, moduleId: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isEnabled ?? true}
                onChange={e => setForm(prev => ({ ...prev, isEnabled: e.target.checked }))}
              />
              <span className="text-sm">Bật menu</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button onClick={handleSave}>
              {editing ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            <Button variant="outline" onClick={() => { setEditing(null); setForm(emptyMenu); }}>
              Hủy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
