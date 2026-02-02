## PHỤ LỤC C (tuỳ chọn) — Bộ query audit nhanh cho QA (copy/paste)

### C1) Menu nào chưa gán quyền (menu_permissions trống)?
```sql
select mn.code, mn.name, mn.path
from public.menus mn
left join public.menu_permissions mp on mp.menu_id = mn._id
where mn.is_active = true
group by mn._id
having count(mp._id) = 0
order by mn.path;

## PHỤ LỤC C (tuỳ chọn) — Bộ query audit nhanh cho QA (copy/paste)

### C1) Menu nào chưa gán quyền (menu_permissions trống)?
```sql
select mn.code, mn.name, mn.path
from public.menus mn
left join public.menu_permissions mp on mp.menu_id = mn._id
where mn.is_active = true
group by mn._id
having count(mp._id) = 0
order by mn.path;
