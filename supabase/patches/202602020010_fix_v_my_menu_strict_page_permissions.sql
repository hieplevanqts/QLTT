-- Strict runtime menu visibility: require PAGE permissions + role_permissions.
-- Super-admin role is exempt and can see all active menus.
-- Do NOT run from the app. Execute manually in Supabase SQL editor.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'v_menus_full'
      and column_name = 'is_active'
  ) then
    execute $view$
      create or replace view public.v_my_menu as
      with user_roles as (
        select ur.user_id, r.code
        from public.user_roles ur
        join public.roles r on r._id = ur.role_id
        where ur.user_id = auth.uid()
      ),
      is_super_admin as (
        select exists(
          select 1 from user_roles where lower(code) = 'super-admin'
        ) as value
      ),
      user_page_perm_ids as (
        select distinct rp.permission_id as permission_id
        from public.user_roles ur
        join public.role_permissions rp on rp.role_id = ur.role_id
        join public.permissions p on p._id = rp.permission_id
        where ur.user_id = auth.uid()
          and p.category = 'PAGE'
          and p.status = 1
      ),
      menu_page_perm_stats as (
        select
          m._id as menu_id,
          count(p._id) as permission_count,
          count(p._id) filter (where upp.permission_id is not null) as matched_count
        from public.menus m
        left join public.menu_permissions mp on mp.menu_id = m._id
        left join public.permissions p on p._id = mp.permission_id
          and p.category = 'PAGE'
          and p.status = 1
        left join user_page_perm_ids upp on upp.permission_id = p._id
        group by m._id
      )
      select
        mf.*
      from public.v_menus_full mf
      cross join is_super_admin sa
      join menu_page_perm_stats stats on stats.menu_id = mf._id
      where
        coalesce(mf.is_active, true)
        and (
          sa.value
          or (stats.permission_count > 0 and stats.matched_count > 0)
        );
    $view$;
  else
    execute $view$
      create or replace view public.v_my_menu as
      with user_roles as (
        select ur.user_id, r.code
        from public.user_roles ur
        join public.roles r on r._id = ur.role_id
        where ur.user_id = auth.uid()
      ),
      is_super_admin as (
        select exists(
          select 1 from user_roles where lower(code) = 'super-admin'
        ) as value
      ),
      user_page_perm_ids as (
        select distinct rp.permission_id as permission_id
        from public.user_roles ur
        join public.role_permissions rp on rp.role_id = ur.role_id
        join public.permissions p on p._id = rp.permission_id
        where ur.user_id = auth.uid()
          and p.category = 'PAGE'
          and p.status = 1
      ),
      menu_page_perm_stats as (
        select
          m._id as menu_id,
          count(p._id) as permission_count,
          count(p._id) filter (where upp.permission_id is not null) as matched_count
        from public.menus m
        left join public.menu_permissions mp on mp.menu_id = m._id
        left join public.permissions p on p._id = mp.permission_id
          and p.category = 'PAGE'
          and p.status = 1
        left join user_page_perm_ids upp on upp.permission_id = p._id
        group by m._id
      )
      select
        mf.*
      from public.v_menus_full mf
      cross join is_super_admin sa
      join menu_page_perm_stats stats on stats.menu_id = mf._id
      where
        (mf.status is null or mf.status::text in ('ACTIVE', 'active', '1'))
        and coalesce(mf.is_visible, true)
        and (
          sa.value
          or (stats.permission_count > 0 and stats.matched_count > 0)
        );
    $view$;
  end if;
end $$;
