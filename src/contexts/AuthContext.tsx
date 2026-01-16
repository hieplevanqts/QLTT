import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserLevel = 'cuc' | 'chicuc' | 'doi';
export type UserRole = 'lanhdao' | 'kehoach' | 'doitruong' | 'thanhtra' | 'canbohosocanbo' | 'phantich';

export interface UserInfo {
  username: string;
  fullName: string;
  level: UserLevel;
  role: UserRole;
  roleDisplay: string; // "Quản lý cục", "Quản lý chi cục Hồ Chí Minh", etc.
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
      console.log('🔄 Auto-logout: Token expired, logging out...');
      
      // Clear Supabase session
      await supabase.auth.signOut();
      
      // Clear local storage
      localStorage.removeItem('mappa-user');
      localStorage.removeItem('mappa-session-expiry');
      localStorage.removeItem('mappa-user-pending');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Error during auto-logout:', error);
      // Even if there's an error, clear local state and redirect
      localStorage.removeItem('mappa-user');
      localStorage.removeItem('mappa-session-expiry');
      localStorage.removeItem('mappa-user-pending');
      setUser(null);
      setIsAuthenticated(false);
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    } finally {
      logoutInProgressRef.current = false;
    }
  };

  // Auto-restore session on mount using Supabase
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error restoring session:', error);
          // If error getting session, user is not authenticated
          await performAutoLogout();
          setIsLoading(false);
          return;
        }

        if (session && session.user) {
          // Check if session is expired
          if (session.expires_at) {
            const expiresAt = session.expires_at * 1000; // Convert to milliseconds
            const now = Date.now();
            
            if (now >= expiresAt) {
              // Session expired, auto-logout
              console.log('⚠️ Session expired, auto-logout...');
              await performAutoLogout();
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
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // If no stored user info, create basic user info from Supabase user
            // You may want to fetch full user info from your users table here
            const userInfo: UserInfo = {
              username: supabaseUser.email || '',
              fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
              level: 'cuc', // Default, should be fetched from database
              role: 'thanhtra', // Default, should be fetched from database
              roleDisplay: 'Người dùng',
              position: 'Người dùng',
              department: 'Hệ thống',
            };
            setUser(userInfo);
            setIsAuthenticated(true);
          }
        } else {
          // No session, user is not authenticated
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error in restoreSession:', error);
        await performAutoLogout();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    // Listen for auth state changes (including token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        // User signed out or token refresh failed
        console.log('🔄 Auth event: SIGNED_OUT or token refresh failed');
        await performAutoLogout();
        return;
      }

      if (event === 'SIGNED_IN' || (event === 'TOKEN_REFRESHED' && session)) {
        // User signed in or token refreshed successfully
        if (session && session.user) {
          // Check if session is expired
          if (session.expires_at) {
            const expiresAt = session.expires_at * 1000;
            const now = Date.now();
            
            if (now >= expiresAt) {
              // Session expired even after refresh
              console.log('⚠️ Session expired after refresh, auto-logout...');
              await performAutoLogout();
              return;
            }
          }

          const storedUser = localStorage.getItem('mappa-user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // Create basic user info
            const supabaseUser = session.user;
            const userInfo: UserInfo = {
              username: supabaseUser.email || '',
              fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
              level: 'cuc',
              role: 'thanhtra',
              roleDisplay: 'Người dùng',
              position: 'Người dùng',
              department: 'Hệ thống',
            };
            setUser(userInfo);
            setIsAuthenticated(true);
          }
        }
      } else if (!session) {
        // No session - user is signed out
        console.log('🔄 No session, auto-logout...');
        await performAutoLogout();
      }
    });

    // Periodically check session expiry (every 30 seconds)
    const expiryCheckInterval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // No session, logout
          await performAutoLogout();
          return;
        }

        // Check if session is expired
        if (session.expires_at) {
          const expiresAt = session.expires_at * 1000;
          const now = Date.now();
          
          if (now >= expiresAt) {
            // Session expired
            console.log('⚠️ Session expired (periodic check), auto-logout...');
            await performAutoLogout();
          }
        }
      } catch (error) {
        console.error('Error checking session expiry:', error);
        await performAutoLogout();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      subscription.unsubscribe();
      clearInterval(expiryCheckInterval);
    };
  }, []);

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
      
      const userInfo: UserInfo = {
        username,
        fullName: supabaseUser.user_metadata?.full_name || fullName,
        ...parsedInfo,
        ...roleInfo,
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
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('mappa-user');
      localStorage.removeItem('mappa-session-expiry');
      localStorage.removeItem('mappa-user-pending');
      setUser(null);
      setIsAuthenticated(false);
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