import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase'; // 🔥 NEW: Import Tables for permission queries
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export type UserLevel = 'cuc' | 'chicuc' | 'doi';
export type UserRole = 'lanhdao' | 'kehoach' | 'doitruong' | 'thanhtra' | 'canbohosocanbo' | 'phantich';

export interface UserInfo {
  _id: string;
  username: string;
  fullName: string;
  level: UserLevel;
  role: UserRole;
  roleDisplay: string; // "Quản lý cục", "Quản lý chi cục Hồ Chí Minh", etc.
  roleCode?: string;
  provinceCode?: string; // "01", "24", etc.
  provinceName?: string; // "Hà Nội", "Hồ Chí Minh", etc.
  teamCode?: string; // "01", "02", etc.
  teamName?: string; // "Đội 1", "Phường Mai Dịch", etc.
  position: string; // "Trưởng phòng kiểm tra", etc.
  department: string; // "Chi cục QLTT TP.HCM - Đội 1", etc.
  availableUnits?: Array<{
    code: string;
    name: string;
    type: 'province' | 'team';
  }>;
  permissions?: string[]; // 🔥 NEW: Permission codes (MAP_VIEW, STORES_VIEW, etc.)
  departmentInfo?: { // 🔥 NEW: Department info from department_users
    id: string;
    name: string;
    code?: string;
    level?: number;
    address?: string;
    latitude?: number;
    longitude?: number;
    parent_id?: string | null;
  };
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresUnitSelection?: boolean; error?: string }>;
  selectUnit: (unitCode: string) => void;
  logout: () => Promise<void>;
  checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔥 NEW: Fetch user permissions from database (users -> user_roles -> roles -> role_permissions -> permissions)
async function fetchUserPermissions(userId: string): Promise<string[]> {
  try {
    
    // Step 1: Get user roles from user_roles table
    const { data: userRoles, error: userRolesError } = await supabase
      .from(Tables.USER_ROLES)
      .select('role_id')
      .eq('user_id', userId);
    
    if (userRolesError) {
      console.error('❌ Error fetching user roles:', userRolesError);
      return []; // Return empty array on error
    }
    
    if (!userRoles || userRoles.length === 0) {
      return []; // User has no roles
    }
    
    const roleIds = userRoles.map(ur => ur.role_id);
    
    // Step 2: Get role permissions from role_permissions table
    const { data: rolePermissions, error: rolePermissionsError } = await supabase
      .from(Tables.ROLE_PERMISSIONS)
      .select('permission_id')
      .in('role_id', roleIds);
    
    if (rolePermissionsError) {
      console.error('❌ Error fetching role permissions:', rolePermissionsError);
      return [];
    }
    
    if (!rolePermissions || rolePermissions.length === 0) {
      return [];
    }
    
    const permissionIds = [...new Set(rolePermissions.map(rp => rp.permission_id))]; // Remove duplicates
    
    // Step 3: Get permission codes from permissions table
    const { data: permissions, error: permissionsError } = await supabase
      .from(Tables.PERMISSIONS)
      .select('code')
      .in('_id', permissionIds);
    
    if (permissionsError) {
      console.error('❌ Error fetching permission codes:', permissionsError);
      return [];
    }
    
    if (!permissions || permissions.length === 0) {
      return [];
    }
    
    const permissionCodes = permissions.map(p => p.code).filter(Boolean) as string[];
    
    return permissionCodes;
  } catch (error: any) {
    console.error('❌ Error fetching user permissions:', error);
    return []; // Return empty array on error
  }
}

// 🔥 NEW: Fetch user role name from database (users -> user_roles -> roles)
async function fetchUserRoleName(userId: string): Promise<string | null> {
  try {
    
    // Step 1: Get user roles from user_roles table
    const { data: userRoles, error: userRolesError } = await supabase
      .from(Tables.USER_ROLES)
      .select('role_id')
      .eq('user_id', userId)
      .limit(1); // Get first role (primary role)
    
    if (userRolesError) {
      console.error('❌ Error fetching user roles:', userRolesError);
      return null;
    }
    
    if (!userRoles || userRoles.length === 0) {
      return null;
    }
    
    const roleId = userRoles[0].role_id;
    
    // Step 2: Get role name from roles table
    const { data: role, error: roleError } = await supabase
      .from(Tables.ROLES)
      .select('name')
      .eq('_id', roleId)
      .single();
    
    if (roleError) {
      console.error('❌ Error fetching role name:', roleError);
      return null;
    }
    
    if (!role || !role.name) {
      return null;
    }
    
    const roleName = role.name;
    
    return roleName;
  } catch (error: any) {
    console.error('❌ Error fetching user role name:', error);
    return null;
  }
}

async function fetchUserRoleCode(userId: string): Promise<string | null> {
  try {
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId)
      .limit(1);

    if (userRolesError || !userRoles || userRoles.length === 0) {
      return null;
    }

    const roleId = userRoles[0].role_id;
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('code')
      .eq('_id', roleId)
      .single();

    if (roleError) {
      console.error('❌ Error fetching role code:', roleError);
      return null;
    }

    return role?.code || null;
  } catch (error: any) {
    console.error('❌ Error fetching user role code:', error);
    return null;
  }
}

function getDepartmentLevelFromCode(code?: string | null): number | undefined {
  if (!code) return undefined;
  const trimmed = code.trim();
  if (trimmed.length < 2 || trimmed.length % 2 !== 0) return undefined;
  return trimmed.length / 2;
}

// 🔥 NEW: Fetch user department from database (users -> department_users -> departments)
async function fetchUserDepartment(userId: string): Promise<{ _id: string; name: string; code?: string; level?: number; address?: string; latitude?: number; longitude?: number; parent_id?: string | null } | null> {
  try {
    
    // Query department_users with nested select to get departments data (including address)
    const { data: departmentUsers, error: departmentUsersError } = await supabase
      .from('department_users')
      .select(`
        department_id,
        departments (
          id:_id,
          name,
          code,
          level,
          address,
          latitude,
          longitude,
          parent_id
        )
      `)
      .eq('user_id', userId)
      .limit(1);
    
    if (departmentUsersError) {
      console.error('❌ Error fetching user department:', departmentUsersError);
      return null;
    }
    
    if (!departmentUsers || departmentUsers.length === 0) {
      return null;
    }
    
    // Extract department data from nested structure
    const departmentData = departmentUsers[0]?.departments;
    if (!departmentData || !departmentData._id) {
      return null;
    }
    
    const inferredLevel = getDepartmentLevelFromCode(departmentData.code);
    const departmentInfo = {
      _id: departmentData._id,
      name: departmentData.name || '',
      code: departmentData.code || undefined,
      level: departmentData.level ?? inferredLevel,
      address: departmentData.address || undefined,
      latitude: departmentData.latitude ?? undefined,
      longitude: departmentData.longitude ?? undefined,
      parent_id: departmentData.parent_id ?? null,
    };
    
    return departmentInfo;
  } catch (error: any) {
    console.error('❌ Error fetching user department:', error);
    return null;
  }
}

// Mock function to parse username and determine user info
function parseUsername(username: string): Partial<UserInfo> {
  const upper = username.toUpperCase();
  
  // Cấp cục: QT_HOVATEN
  if (upper.startsWith('QT_')) {
    return {
      level: 'cuc',
      username,
    };
  }
  
  // Cấp chi cục: QT{MÃ_TỈNH}_HOVATEN (QT01_NGUYENVANA)
  const chicucMatch = upper.match(/^QT(\d{2})_(.+)$/);
  if (chicucMatch) {
    const provinceCode = chicucMatch[1];
    const provinceMap: Record<string, string> = {
      '01': 'Hà Nội',
      '24': 'Hồ Chí Minh',
      '48': 'Đà Nẵng',
      '31': 'Hải Phòng',
      '92': 'Cần Thơ',
    };
    
    return {
      level: 'chicuc',
      username,
      provinceCode,
      provinceName: provinceMap[provinceCode] || `Tỉnh ${provinceCode}`,
    };
  }
  
  // Cấp đội: QT{MÃ_TỈNH}{MÃ_ĐỘI}_HOVATEN (QT0101_LETHIC)
  const doiMatch = upper.match(/^QT(\d{2})(\d{2})_(.+)$/);
  if (doiMatch) {
    const provinceCode = doiMatch[1];
    const teamCode = doiMatch[2];
    const provinceMap: Record<string, string> = {
      '01': 'Hà Nội',
      '24': 'Hồ Chí Minh',
      '48': 'Đà Nẵng',
      '31': 'Hải Phòng',
      '92': 'Cần Thơ',
    };
    
    return {
      level: 'doi',
      username,
      provinceCode,
      provinceName: provinceMap[provinceCode] || `Tỉnh ${provinceCode}`,
      teamCode,
      teamName: `Đội ${parseInt(teamCode)}`,
    };
  }
  
  // Default
  return {
    level: 'cuc',
    username,
  };
}

// Mock function to get user role and permissions
function getUserRoleInfo(username: string): Pick<UserInfo, 'role' | 'roleDisplay' | 'position' | 'department'> {
  // This would come from backend in real app
  // For demo, we'll use some mock logic
  const parsedInfo = parseUsername(username);
  
  // Mock role assignment based on username pattern
  let role: UserRole = 'thanhtra';
  let position = 'Thanh tra viên';
  
  if (username.toLowerCase().includes('lanhdao')) {
    role = 'lanhdao';
    position = 'Lãnh đạo';
  } else if (username.toLowerCase().includes('kehoach')) {
    role = 'kehoach';
    position = 'Chuyên viên kế hoạch';
  } else if (username.toLowerCase().includes('doitruong')) {
    role = 'doitruong';
    position = 'Đội trưởng';
  }
  
  // Generate roleDisplay based on level
  let roleDisplay = '';
  let department = '';
  
  if (parsedInfo.level === 'cuc') {
    roleDisplay = 'Quản lý cục';
    department = 'Cục Quản lý thị trường';
  } else if (parsedInfo.level === 'chicuc') {
    roleDisplay = `Quản lý chi cục ${parsedInfo.provinceName}`;
    department = `Chi cục QLTT ${parsedInfo.provinceName}`;
  } else if (parsedInfo.level === 'doi') {
    roleDisplay = `Quản lý ${parsedInfo.teamName} - ${parsedInfo.provinceName}`;
    department = `Chi cục QLTT ${parsedInfo.provinceName} - ${parsedInfo.teamName}`;
  }
  
  return {
    role,
    roleDisplay,
    position,
    department,
  };
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const logoutInProgressRef = useRef(false);

  // Auto-logout function (no confirmation)
  const performAutoLogout = async () => {
    // Prevent multiple logout calls
    if (logoutInProgressRef.current) return;
    logoutInProgressRef.current = true;

    try {
      // FIRST: Clear all storage immediately to prevent any reads
      try {
        localStorage.clear();
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
        // Clear all cookies
        if (typeof document !== 'undefined' && document.cookie) {
          const cookies = document.cookie.split(';');
          cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            // Clear cookie for all possible paths and domains
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
            // Also try to clear without domain (for localhost)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
          });
        }
      } catch (clearError) {
        console.error('Error clearing storage:', clearError);
      }
      
      // Update state BEFORE attempting signOut to prevent any re-renders from reading storage
      setUser(null);
      setIsAuthenticated(false);
      
      // THEN: Try to clear Supabase session (wrap in try-catch to handle AbortError)
      // Use a timeout to prevent hanging on abort
      try {
        const signOutPromise = supabase.auth.signOut();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('SignOut timeout')), 2000)
        );
        await Promise.race([signOutPromise, timeoutPromise]);
      } catch (signOutError: any) {
        // Ignore AbortError and timeout during signOut - storage already cleared
        if (signOutError?.name !== 'AbortError' && 
            !signOutError?.message?.includes('aborted') &&
            !signOutError?.message?.includes('timeout')) {
          console.error('Error during signOut:', signOutError);
        }
      }
      
      // Redirect to login page - use full page reload to clear all state
      // Use window.location.href for complete reset
      // Add a small delay to ensure storage is cleared
      if (!window.location.pathname.includes('/auth/login')) {
        // Use replace instead of href to prevent back button issues
        setTimeout(() => {
          window.location.replace('/auth/login');
        }, 100);
      } else {
        // If already on login page, just clear state (already done above)
        logoutInProgressRef.current = false;
      }
    } catch (error: any) {
      console.error('Error during auto-logout:', error);
      // Even if there's an error (including AbortError), clear everything
      try {
        localStorage.clear();
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
        if (typeof document !== 'undefined' && document.cookie) {
          const cookies = document.cookie.split(';');
          cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          });
        }
      } catch (clearError) {
        console.error('Error clearing storage:', clearError);
      }
      setUser(null);
      setIsAuthenticated(false);
      // Redirect to login page - use replace to prevent back button
      if (!window.location.pathname.includes('/auth/login')) {
        setTimeout(() => {
          window.location.replace('/auth/login');
        }, 100);
      } else {
        logoutInProgressRef.current = false;
      }
    }
  };

  // Auto-restore session on mount using Supabase
  // 🔥 FIX: Disable AuthContext restore session when using Redux auth
  // Redux auth system handles session restore via rootSaga
  useEffect(() => {
    // 🔥 FIX: Check if we're using Redux auth (token exists in localStorage)
    // If token exists, let Redux handle restore, don't interfere
    const token = localStorage.getItem('mappa_auth_access_token');
    if (token) {
      setIsLoading(false);
      return; // Early return - don't run AuthContext restore
    }

    const restoreSession = async () => {
      try {
        // Check if we're on login page - don't trigger logout redirect if already there
        const isOnLoginPage = window.location.pathname === '/auth/login';
        
        // Get current session from Supabase
        let session, error;
        try {
          const sessionResult = await supabase.auth.getSession();
          session = sessionResult.data.session;
          error = sessionResult.error;
        } catch (err: any) {
          // Handle AbortError or other errors during session check
          if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
            console.warn('⚠️ AuthContext: Session check aborted - likely session expired');
            // 🔥 FIX: Check if token exists in storage before clearing
            const hasTokenInStorage = localStorage.getItem('mappa_auth_access_token');
            if (hasTokenInStorage) {
              setUser(null);
              setIsAuthenticated(false);
              setIsLoading(false);
              return;
            }
            // No token, clear everything and logout
            if (!isOnLoginPage) {
              await performAutoLogout();
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
            setIsLoading(false);
            return;
          }
          error = err;
        }
        
        if (error) {
          console.error('⚠️ AuthContext: Error restoring session:', error);
          // 🔥 FIX: Check if token exists in storage before clearing
          const hasTokenInStorage = localStorage.getItem('mappa_auth_access_token');
          if (hasTokenInStorage) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
          // If error getting session and no token, user is not authenticated
          // Only call performAutoLogout if not already on login page to avoid double reload
          if (!isOnLoginPage) {
            await performAutoLogout();
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setIsLoading(false);
          return;
        }

        if (session && session.user) {
          // Check if session is expired using expires_at from backend
          if (session.expires_at) {
            const expiresAt = session.expires_at * 1000; // Convert to milliseconds
            const now = Date.now();
            
            if (now >= expiresAt) {
              // Session expired, but check if token exists in storage
              // 🔥 FIX: Don't clear localStorage if token exists - let Redux auth system handle it
              const hasTokenInStorage = localStorage.getItem('mappa_auth_access_token');
              if (hasTokenInStorage) {
                setUser(null);
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
              }
              // Session expired and no token, auto-logout
              // Only call performAutoLogout if not already on login page to avoid double reload
              if (!isOnLoginPage) {
                await performAutoLogout();
              } else {
                setUser(null);
                setIsAuthenticated(false);
              }
              setIsLoading(false);
              return;
            }
          }

          // Session exists and is valid
          // Get user info from Supabase user metadata or fetch from database
          const supabaseUser = session.user;
          
          // Try to get user info from localStorage (for backward compatibility)
          // or fetch from database using supabaseUser.id
          const storedUser = localStorage.getItem('mappa-user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as UserInfo;
            // 🔥 NEW: Refresh permissions, department, and role name if user doesn't have them yet
            if (!parsedUser.permissions || parsedUser.permissions.length === 0 || !parsedUser.departmentInfo || !parsedUser.roleDisplay || parsedUser.roleDisplay === 'Người dùng' || parsedUser.roleDisplay.includes('Quản lý')) {
              const [permissionCodes, departmentInfo, roleName] = await Promise.all([
                fetchUserPermissions(supabaseUser.id),
                fetchUserDepartment(supabaseUser.id),
                fetchUserRoleName(supabaseUser.id),
              ]);
              parsedUser.permissions = permissionCodes;
              parsedUser.departmentInfo = departmentInfo || undefined;
              if (roleName) {
                parsedUser.roleDisplay = roleName; // 🔥 FIX: Update roleDisplay with role name from database
              }
              localStorage.setItem('mappa-user', JSON.stringify(parsedUser));
            }
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // If no stored user info, create basic user info from Supabase user
            // 🔥 NEW: Fetch user permissions, department, and role name from database
            const [permissionCodes, departmentInfo, roleName] = await Promise.all([
              fetchUserPermissions(supabaseUser.id),
              fetchUserDepartment(supabaseUser.id),
              fetchUserRoleName(supabaseUser.id),
            ]);
            const userInfo: UserInfo = {
              _id: supabaseUser.id,
              username: supabaseUser.email || '',
              fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
              level: 'cuc', // Default, should be fetched from database
              role: 'thanhtra', // Default, should be fetched from database
              roleDisplay: roleName || 'Người dùng', // 🔥 FIX: Use role name from database
              position: 'Người dùng',
              department: 'Hệ thống',
              permissions: permissionCodes, // 🔥 NEW: Add permissions to user info
              departmentInfo: departmentInfo || undefined, // 🔥 NEW: Add department info
            };
            setUser(userInfo);
            setIsAuthenticated(true);
          }
        } else {
          // No Supabase session, but check if we have token in localStorage
          // 🔥 FIX: Don't clear localStorage if token exists - let Redux auth system handle it
          const hasTokenInStorage = localStorage.getItem('mappa_auth_access_token');
          if (hasTokenInStorage) {
            // Don't clear localStorage - Redux auth system will restore from token
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
          
          // No session and no token, user is not authenticated
          // Don't trigger logout redirect if already on login page
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('⚠️ AuthContext: Error in restoreSession:', error);
        // 🔥 FIX: Check if token exists in storage before clearing
        const hasTokenInStorage = localStorage.getItem('mappa_auth_access_token');
        if (hasTokenInStorage) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        // Only call performAutoLogout if not already on login page and no token exists
        const isOnLoginPage = window.location.pathname === '/auth/login';
        if (!isOnLoginPage) {
          await performAutoLogout();
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // No token, use AuthContext restore (legacy mode)
    restoreSession();
  }, []); // Only run once on mount

  // 🔥 FIX: Separate useEffect for Supabase auth listeners
  // This ensures hooks are always called in the same order
  useEffect(() => {
    // Check if we're using Redux auth (token exists in localStorage)
    const token = localStorage.getItem('mappa_auth_access_token');
    if (token) {
      return; // Early return - don't set up Supabase listeners
    }

    // Listen for auth state changes (including token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        // User signed out or token refresh failed
        // 🔥 FIX: Check if token exists in storage before clearing
        const hasTokenInStorage = localStorage.getItem('mappa_auth_access_token');
        if (hasTokenInStorage) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        // No token, perform logout
        await performAutoLogout();
        return;
      }

      if (event === 'SIGNED_IN' || (event === 'TOKEN_REFRESHED' && session)) {
        // User signed in or token refreshed successfully
        if (session && session.user) {
          // Check if session is expired using expires_at from backend
          if (session.expires_at) {
            const expiresAt = session.expires_at * 1000;
            const now = Date.now();
            
            if (now >= expiresAt) {
              // Session expired even after refresh
              // 🔥 FIX: Check if token exists in storage before clearing
              const hasTokenInStorage = localStorage.getItem('mappa_auth_access_token');
              if (hasTokenInStorage) {
                setUser(null);
                setIsAuthenticated(false);
                return;
              }
              // No token, perform logout
              await performAutoLogout();
              return;
            }
          }

          const storedUser = localStorage.getItem('mappa-user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as UserInfo;
            // 🔥 FIX: Refresh role name if it's still the default/mock value
            if (!parsedUser.roleDisplay || parsedUser.roleDisplay === 'Người dùng' || parsedUser.roleDisplay.includes('Quản lý')) {
              const roleName = await fetchUserRoleName(session.user._id);
              if (roleName) {
                parsedUser.roleDisplay = roleName;
                localStorage.setItem('mappa-user', JSON.stringify(parsedUser));
              }
            }
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Create basic user info
            const supabaseUser = session.user;
            // 🔥 FIX: Fetch role name from database
            const roleName = await fetchUserRoleName(supabaseUser.id);
            const userInfo: UserInfo = {
              _id: supabaseUser.id,
              username: supabaseUser.email || '',
              fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
              level: 'cuc',
              role: 'thanhtra',
              roleDisplay: roleName || 'Người dùng',
              position: 'Người dùng',
              department: 'Hệ thống',
            };
            setUser(userInfo);
            setIsAuthenticated(true);
          }
        }
      } else if (event === 'USER_UPDATED' && !session) {
        // User updated but no session - likely expired
        await performAutoLogout();
      } else if (!session) {
        // No session - user is signed out
        await performAutoLogout();
      }
    });

    // Periodically check session expiry (every 10 seconds for faster detection)
    const expiryCheckInterval = setInterval(async () => {
      if (!isAuthenticated || logoutInProgressRef.current) return;
      
      try {
        let session, error;
        try {
          const sessionResult = await supabase.auth.getSession();
          session = sessionResult.data.session;
          error = sessionResult.error;
        } catch (err: any) {
          // Handle AbortError or other errors during session check
          if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
            console.warn('Session expiry check aborted - likely session expired');
            await performAutoLogout();
            return;
          }
          error = err;
        }
        
        if (error || !session) {
          // No session or error, logout immediately
          await performAutoLogout();
          return;
        }

        // Check if session is expired using expires_at from backend
        if (session.expires_at) {
          const expiresAt = session.expires_at * 1000;
          const now = Date.now();
          
          // Check if expired or will expire in next 5 seconds
          if (now >= expiresAt || (expiresAt - now) < 5000) {
            // Session expired or about to expire
            await performAutoLogout();
            return;
          }
        }
      } catch (error) {
        console.error('Error checking session expiry:', error);
        await performAutoLogout();
      }
    }, 10000); // Check every 10 seconds for faster detection

    return () => {
      subscription.unsubscribe();
      clearInterval(expiryCheckInterval);
    };
  }, [isAuthenticated]); // Include isAuthenticated in dependencies

  const login = async (email: string, password: string): Promise<{ success: boolean; requiresUnitSelection?: boolean; error?: string }> => {
    // Validate email và password không rỗng
    if (!email || !password) {
      return { success: false, error: 'Email và mật khẩu không được để trống' };
    }

    try {
      // Call Supabase auth API: /auth/v1/token?grant_type=password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        return { 
          success: false, 
          error: error.message || 'Tên đăng nhập hoặc mật khẩu không đúng' 
        };
      }

      if (!data.user || !data.session) {
        return { success: false, error: 'Đăng nhập thất bại' };
      }

      // Login successful - get user info
      const supabaseUser = data.user;
      
      // Try to parse username from email or use email as username
      // You may want to fetch full user info from your users table using supabaseUser.id
      const username = email.trim();
      
      // Parse username to get basic info (if username follows the format)
      // Otherwise, use email as username
      const parsedInfo = parseUsername(username);
      const roleInfo = getUserRoleInfo(username);
      
      // Extract full name from email or use email prefix
      const namePart = username.split('@')[0] || username.split('_').pop() || 'User';
      const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
      
      // Check if user has multiple units (this should come from database)
      const hasMultipleUnits = false; // For now, single unit
      
      // 🔥 NEW: Fetch user permissions, department, and role name from database
      const [permissionCodes, departmentInfo, roleName] = await Promise.all([
        fetchUserPermissions(supabaseUser.id),
        fetchUserDepartment(supabaseUser.id),
        fetchUserRoleName(supabaseUser.id),
      ]);
      
      const userInfo: UserInfo = {
        _id: supabaseUser.id,
        username,
        fullName: supabaseUser.user_metadata?.full_name || fullName,
        ...parsedInfo,
        ...roleInfo,
        roleDisplay: roleName || roleInfo.roleDisplay, // 🔥 FIX: Use role name from database, fallback to mock roleInfo
        permissions: permissionCodes, // 🔥 NEW: Add permissions to user info
        departmentInfo: departmentInfo || undefined, // 🔥 NEW: Add department info
      } as UserInfo;
      
      if (hasMultipleUnits) {
        // Store partial user info and require unit selection
        localStorage.setItem('mappa-user-pending', JSON.stringify(userInfo));
        return { success: true, requiresUnitSelection: true };
      }
      
      // Store user info in localStorage for backward compatibility
      localStorage.setItem('mappa-user', JSON.stringify(userInfo));
      
      // Supabase handles session automatically, but we can store expiry for reference
      if (data.session.expires_at) {
        const sessionExpiry = data.session.expires_at * 1000; // Convert to milliseconds
        localStorage.setItem('mappa-session-expiry', sessionExpiry.toString());
      }
      
      setUser(userInfo);
      setIsAuthenticated(true);
      
      return { success: true, requiresUnitSelection: false };
    } catch (err) {
      console.error('Login exception:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
      };
    }
  };

  const selectUnit = (unitCode: string) => {
    const pendingUser = localStorage.getItem('mappa-user-pending');
    if (!pendingUser) return;
    
    const userInfo = JSON.parse(pendingUser) as UserInfo;
    
    // Update user info with selected unit
    // This would update provinceCode/teamCode based on selection
    
    const sessionExpiry = Date.now() + (8 * 60 * 60 * 1000);
    localStorage.setItem('mappa-user', JSON.stringify(userInfo));
    localStorage.setItem('mappa-session-expiry', sessionExpiry.toString());
    localStorage.removeItem('mappa-user-pending');
    
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // Prevent multiple logout calls
    if (logoutInProgressRef.current) {
      return;
    }
    logoutInProgressRef.current = true;

    try {
      
      // Get current session to get access token
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call Supabase logout API endpoint explicitly: /auth/v1/logout
      if (session?.access_token) {
        try {
          const supabaseUrl = `https://${projectId}.supabase.co`;
          const logoutUrl = `${supabaseUrl}/auth/v1/logout`;
          
          await fetch(logoutUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
              'apikey': publicAnonKey,
            },
            body: JSON.stringify({}),
          });
          
        } catch (apiError) {
          // Continue with signOut even if API call fails
        }
      }
      
      // Sign out from Supabase (this clears Supabase session and tokens)
      await supabase.auth.signOut();
      
      // Clear ALL localStorage items
      localStorage.clear();
      
      // Clear ALL sessionStorage items
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
      
      // Clear all cookies
      if (typeof document !== 'undefined' && document.cookie) {
        // Get all cookies
        const cookies = document.cookie.split(';');
        // Clear each cookie by setting it to expire in the past
        cookies.forEach(cookie => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          // Clear cookie for current domain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        });
      }
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if there's an error, clear everything
      try {
        localStorage.clear();
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
        // Clear cookies on error too
        if (typeof document !== 'undefined' && document.cookie) {
          const cookies = document.cookie.split(';');
          cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          });
        }
      } catch (clearError) {
        console.error('Error clearing storage:', clearError);
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      logoutInProgressRef.current = false;
    }
  };

  const checkSession = (): boolean => {
    // Check Supabase session synchronously
    // Note: This is a synchronous check, for async check use getSession()
    // Supabase automatically refreshes tokens, so we just check if user is authenticated
    if (!isAuthenticated) {
      return false;
    }

    // Additional check: verify Supabase session is still valid
    // This is done asynchronously in the auth state change listener
    // For synchronous check, we rely on isAuthenticated state
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, selectUnit, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
