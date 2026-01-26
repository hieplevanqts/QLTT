/**
 * Professional Token Storage
 * Provides secure token storage with multiple strategies
 */

/**
 * Storage strategies
 */
export enum StorageStrategy {
  /**
   * HttpOnly Cookies (Most Secure)
   * - Cannot be accessed by JavaScript (XSS protection)
   * - Automatically sent with requests
   * - Requires backend to set cookies
   */
  HTTP_ONLY_COOKIE = 'httpOnlyCookie',
  
  /**
   * Secure LocalStorage with Encryption
   * - Encrypted before storage
   * - Better than plain localStorage
   */
  ENCRYPTED_LOCAL_STORAGE = 'encryptedLocalStorage',
  
  /**
   * SessionStorage
   * - Automatically cleared when tab closes
   * - Good for sensitive temporary data
   */
  SESSION_STORAGE = 'sessionStorage',
  
  /**
   * IndexedDB
   * - Large storage capacity
   * - Can store encrypted data
   * - More complex but more powerful
   */
  INDEXED_DB = 'indexedDB',
  
  /**
   * Memory Storage
   * - Only in RAM, cleared on refresh
   * - Most secure but least persistent
   */
  MEMORY = 'memory',
}

/**
 * Token storage configuration
 */
interface TokenStorageConfig {
  strategy: StorageStrategy;
  encrypt?: boolean;
  keyPrefix?: string;
}

/**
 * Simple encryption/decryption (for client-side storage)
 * Note: This is basic obfuscation, not military-grade encryption
 * For production, consider using Web Crypto API or server-side encryption
 */
class SimpleEncryption {
  private static readonly KEY = 'mappa-auth-key-2024'; // In production, use env variable
  
  static encrypt(text: string): string {
    try {
      // Simple XOR encryption (for demonstration)
      // In production, use Web Crypto API: crypto.subtle.encrypt()
      let encrypted = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ this.KEY.charCodeAt(i % this.KEY.length);
        encrypted += String.fromCharCode(charCode);
      }
      return btoa(encrypted); // Base64 encode
    } catch (error) {
      console.error('Encryption error:', error);
      return text; // Fallback to plain text
    }
  }
  
  static decrypt(encrypted: string): string {
    try {
      const decoded = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ this.KEY.charCodeAt(i % this.KEY.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encrypted; // Fallback
    }
  }
}

/**
 * Memory storage (in-memory only)
 */
class MemoryStorage {
  private static storage: Map<string, string> = new Map();
  
  static setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }
  
  static getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }
  
  static removeItem(key: string): void {
    this.storage.delete(key);
  }
  
  static clear(): void {
    this.storage.clear();
  }
}

/**
 * IndexedDB storage wrapper
 */
class IndexedDBStorage {
  private static dbName = 'mappa-auth-db';
  private static storeName = 'tokens';
  private static db: IDBDatabase | null = null;
  
  static async init(): Promise<void> {
    if (this.db) return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }
  
  static async setItem(key: string, value: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('IndexedDB not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  
  static async getItem(key: string): Promise<string | null> {
    await this.init();
    if (!this.db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }
  
  static async removeItem(key: string): Promise<void> {
    await this.init();
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  
  static async clear(): Promise<void> {
    await this.init();
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

/**
 * Professional Token Storage Manager
 */
export class TokenStorage {
  private config: TokenStorageConfig;
  private keyPrefix: string;
  
  constructor(config: TokenStorageConfig) {
    this.config = config;
    this.keyPrefix = config.keyPrefix || 'mappa_auth_';
  }
  
  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
  
  /**
   * Store token based on strategy
   */
  async setToken(token: string, expiresIn?: number): Promise<void> {
    const key = this.getKey('access_token');
    let value = token;
    
    console.log('💾 TokenStorage.setToken:', { 
      key, 
      strategy: this.config.strategy, 
      encrypt: this.config.encrypt,
      tokenLength: token.length 
    });
    
    // Encrypt if enabled
    if (this.config.encrypt && this.config.strategy !== StorageStrategy.HTTP_ONLY_COOKIE) {
      value = SimpleEncryption.encrypt(token);
      console.log('🔐 TokenStorage: Token encrypted', { encryptedLength: value.length });
    }
    
    // Store based on strategy
    switch (this.config.strategy) {
      case StorageStrategy.HTTP_ONLY_COOKIE:
        // Note: HttpOnly cookies must be set by server
        // This is a placeholder - actual implementation requires backend
        console.warn('HttpOnly cookies must be set by server. Falling back to localStorage.');
        localStorage.setItem(key, value);
        break;
        
      case StorageStrategy.ENCRYPTED_LOCAL_STORAGE:
        localStorage.setItem(key, value);
        // Verify token was stored correctly
        const stored = localStorage.getItem(key);
        console.log('✅ TokenStorage: Token stored in localStorage', { 
          key, 
          hasValue: !!value,
          valueLength: value.length,
          stored: !!stored,
          storedLength: stored?.length || 0,
          storedMatches: stored === value,
          // Log all auth keys after storing
          allAuthKeys: Object.keys(localStorage).filter(k => k.includes('auth') || k.includes('token') || k.includes('mappa'))
        });
        if (!stored || stored !== value) {
          console.error('❌ TokenStorage: Token was not stored correctly!', {
            expectedLength: value.length,
            storedLength: stored?.length || 0
          });
        }
        if (expiresIn) {
          // expiresIn is in seconds, convert to milliseconds
          const expiresAt = Date.now() + expiresIn * 1000;
          localStorage.setItem(this.getKey('token_expires_at'), expiresAt.toString());
          const now = new Date();
          const expiryDate = new Date(expiresAt);
          const durationMinutes = Math.round((expiresAt - Date.now()) / 1000 / 60);
          console.log('✅ TokenStorage: Expiry stored', { 
            expiresIn: `${expiresIn}s (${Math.round(expiresIn / 60)} minutes)`,
            expiresAt: expiryDate.toISOString(),
            now: now.toISOString(),
            durationMinutes: `${durationMinutes} minutes`,
            durationHours: `${(durationMinutes / 60).toFixed(2)} hours`
          });
        } else {
          console.warn('⚠️ TokenStorage: No expiresIn provided, token will not expire automatically');
        }
        break;
        
      case StorageStrategy.SESSION_STORAGE:
        sessionStorage.setItem(key, value);
        if (expiresIn) {
          const expiresAt = Date.now() + expiresIn * 1000;
          sessionStorage.setItem(this.getKey('token_expires_at'), expiresAt.toString());
        }
        break;
        
      case StorageStrategy.INDEXED_DB:
        await IndexedDBStorage.setItem(key, value);
        if (expiresIn) {
          const expiresAt = Date.now() + expiresIn * 1000;
          await IndexedDBStorage.setItem(this.getKey('token_expires_at'), expiresAt.toString());
        }
        break;
        
      case StorageStrategy.MEMORY:
        MemoryStorage.setItem(key, value);
        if (expiresIn) {
          const expiresAt = Date.now() + expiresIn * 1000;
          MemoryStorage.setItem(this.getKey('token_expires_at'), expiresAt.toString());
        }
        break;
    }
  }
  
  /**
   * Get token based on strategy
   */
  async getToken(): Promise<string | null> {
    const key = this.getKey('access_token');
    let value: string | null = null;
    
    console.log('🔍 TokenStorage.getToken:', { 
      key, 
      strategy: this.config.strategy,
      encrypt: this.config.encrypt 
    });
    
    // Retrieve based on strategy
    switch (this.config.strategy) {
      case StorageStrategy.HTTP_ONLY_COOKIE:
        // HttpOnly cookies are not accessible from JavaScript
        // This would need to be handled by backend/API calls
        value = localStorage.getItem(key);
        break;
        
      case StorageStrategy.ENCRYPTED_LOCAL_STORAGE:
        value = localStorage.getItem(key);
        const allAuthKeys = Object.keys(localStorage).filter(k => k.includes('auth') || k.includes('token') || k.includes('mappa'));
        console.log('🔍 TokenStorage: Retrieved from localStorage', { 
          key, 
          hasValue: !!value,
          valueLength: value?.length || 0,
          valueType: typeof value,
          isEmpty: value === '',
          isNull: value === null,
          allAuthKeys: allAuthKeys,
          allAuthKeysCount: allAuthKeys.length,
          localStorageSize: localStorage.length,
          // Check if key exists in localStorage
          keyExists: localStorage.hasOwnProperty(key),
          // Check all localStorage keys for debugging
          allLocalStorageKeys: Object.keys(localStorage).slice(0, 20) // First 20 keys
        });
        // If value is empty string, treat as null
        if (value === '') {
          console.warn('⚠️ TokenStorage: Empty string found, treating as null');
          value = null;
        }
        // If value is null, check if there's a token stored with a different key
        if (value === null && allAuthKeys.length > 0) {
          console.warn('⚠️ TokenStorage: Token not found with expected key, but found other auth keys:', allAuthKeys);
          // Try to find token in other keys
          for (const otherKey of allAuthKeys) {
            const otherValue = localStorage.getItem(otherKey);
            if (otherValue && otherValue.length > 100) {
              console.log(`🔍 TokenStorage: Found potential token in key: ${otherKey}`, { length: otherValue.length });
            }
          }
        }
        break;
        
      case StorageStrategy.SESSION_STORAGE:
        value = sessionStorage.getItem(key);
        break;
        
      case StorageStrategy.INDEXED_DB:
        value = await IndexedDBStorage.getItem(key);
        break;
        
      case StorageStrategy.MEMORY:
        value = MemoryStorage.getItem(key);
        break;
    }
    
    // Decrypt if needed
    if (value && this.config.encrypt && this.config.strategy !== StorageStrategy.HTTP_ONLY_COOKIE) {
      console.log('🔓 TokenStorage: Attempting to decrypt token...', {
        valueLength: value.length,
        valuePreview: value.substring(0, 20) + '...'
      });
      try {
        const decrypted = SimpleEncryption.decrypt(value);
        console.log('🔓 TokenStorage: Token decrypted', { 
          hasDecrypted: !!decrypted,
          decryptedLength: decrypted?.length || 0,
          decryptedPreview: decrypted ? decrypted.substring(0, 20) + '...' : 'empty'
        });
        if (!decrypted || decrypted.length === 0) {
          console.warn('⚠️ TokenStorage: Decryption returned empty string, token might not be encrypted');
          // If decryption returns empty, token might not be encrypted
          // Try returning original value
          return value;
        }
        return decrypted;
      } catch (error) {
        console.error('❌ TokenStorage: Decryption error:', error);
        console.warn('⚠️ TokenStorage: Token might not be encrypted, trying to return original value');
        // If decryption fails, token might not be encrypted
        // Try returning original value as fallback
        return value;
      }
    }
    
    console.log('✅ TokenStorage: Returning token', { 
      hasValue: !!value,
      valueLength: value?.length || 0,
      isEncrypted: false
    });
    return value;
  }
  
  /**
   * Get token expiry timestamp
   */
  async getTokenExpiry(): Promise<number | null> {
    const expiresKey = this.getKey('token_expires_at');
    let expiresAt: string | null = null;
    
    switch (this.config.strategy) {
      case StorageStrategy.HTTP_ONLY_COOKIE:
      case StorageStrategy.ENCRYPTED_LOCAL_STORAGE:
        expiresAt = localStorage.getItem(expiresKey);
        break;
        
      case StorageStrategy.SESSION_STORAGE:
        expiresAt = sessionStorage.getItem(expiresKey);
        break;
        
      case StorageStrategy.INDEXED_DB:
        expiresAt = await IndexedDBStorage.getItem(expiresKey);
        break;
        
      case StorageStrategy.MEMORY:
        expiresAt = MemoryStorage.getItem(expiresKey);
        break;
    }
    
    if (!expiresAt) {
      return null;
    }
    
    const timestamp = parseInt(expiresAt, 10);
    return isNaN(timestamp) ? null : timestamp;
  }
  
  /**
   * Remove token
   */
  async removeToken(): Promise<void> {
    const key = this.getKey('access_token');
    const expiresKey = this.getKey('token_expires_at');
    
    switch (this.config.strategy) {
      case StorageStrategy.HTTP_ONLY_COOKIE:
        localStorage.removeItem(key);
        localStorage.removeItem(expiresKey);
        // Backend should clear cookie
        break;
        
      case StorageStrategy.ENCRYPTED_LOCAL_STORAGE:
        localStorage.removeItem(key);
        localStorage.removeItem(expiresKey);
        break;
        
      case StorageStrategy.SESSION_STORAGE:
        sessionStorage.removeItem(key);
        sessionStorage.removeItem(expiresKey);
        break;
        
      case StorageStrategy.INDEXED_DB:
        await IndexedDBStorage.removeItem(key);
        await IndexedDBStorage.removeItem(expiresKey);
        break;
        
      case StorageStrategy.MEMORY:
        MemoryStorage.removeItem(key);
        MemoryStorage.removeItem(expiresKey);
        break;
    }
  }
  
  /**
   * Store refresh token
   */
  async setRefreshToken(refreshToken: string): Promise<void> {
    const key = this.getKey('refresh_token');
    let value = refreshToken;
    
    // Encrypt if enabled
    if (this.config.encrypt && this.config.strategy !== StorageStrategy.HTTP_ONLY_COOKIE) {
      value = SimpleEncryption.encrypt(refreshToken);
    }
    
    switch (this.config.strategy) {
      case StorageStrategy.HTTP_ONLY_COOKIE:
      case StorageStrategy.ENCRYPTED_LOCAL_STORAGE:
        localStorage.setItem(key, value);
        break;
      case StorageStrategy.SESSION_STORAGE:
        sessionStorage.setItem(key, value);
        break;
      case StorageStrategy.INDEXED_DB:
        await IndexedDBStorage.setItem(key, value);
        break;
      case StorageStrategy.MEMORY:
        MemoryStorage.setItem(key, value);
        break;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    const key = this.getKey('refresh_token');
    let value: string | null = null;
    
    switch (this.config.strategy) {
      case StorageStrategy.HTTP_ONLY_COOKIE:
      case StorageStrategy.ENCRYPTED_LOCAL_STORAGE:
        value = localStorage.getItem(key);
        break;
      case StorageStrategy.SESSION_STORAGE:
        value = sessionStorage.getItem(key);
        break;
      case StorageStrategy.INDEXED_DB:
        value = await IndexedDBStorage.getItem(key);
        break;
      case StorageStrategy.MEMORY:
        value = MemoryStorage.getItem(key);
        break;
    }
    
    // Decrypt if needed
    if (value && this.config.encrypt && this.config.strategy !== StorageStrategy.HTTP_ONLY_COOKIE) {
      try {
        return SimpleEncryption.decrypt(value);
      } catch (error) {
        console.error('Decryption error for refresh token:', error);
        return null;
      }
    }
    
    return value;
  }

  /**
   * Check if token is expired or will expire soon (with buffer time)
   * @param bufferMinutes - Buffer time in minutes before actual expiry (default: 0 = only check if truly expired)
   */
  async isTokenExpired(bufferMinutes: number = 0): Promise<boolean> {
    const expiresKey = this.getKey('token_expires_at');
    let expiresAt: string | null = null;
    
    switch (this.config.strategy) {
      case StorageStrategy.HTTP_ONLY_COOKIE:
      case StorageStrategy.ENCRYPTED_LOCAL_STORAGE:
        expiresAt = localStorage.getItem(expiresKey);
        break;
        
      case StorageStrategy.SESSION_STORAGE:
        expiresAt = sessionStorage.getItem(expiresKey);
        break;
        
      case StorageStrategy.INDEXED_DB:
        expiresAt = await IndexedDBStorage.getItem(expiresKey);
        break;
        
      case StorageStrategy.MEMORY:
        expiresAt = MemoryStorage.getItem(expiresKey);
        break;
    }
    
    const now = Date.now();
    const expiresAtTimestamp = expiresAt ? parseInt(expiresAt, 10) : null;
    const timeUntilExpiry = expiresAtTimestamp ? expiresAtTimestamp - now : null;
    const minutesUntilExpiry = timeUntilExpiry ? Math.round(timeUntilExpiry / 1000 / 60) : null;
    
    console.log('⏰ TokenStorage.isTokenExpired:', { 
      expiresKey, 
      hasExpiresAt: !!expiresAt,
      expiresAt: expiresAtTimestamp ? new Date(expiresAtTimestamp).toISOString() : null,
      now: new Date(now).toISOString(),
      timeUntilExpiry: timeUntilExpiry ? `${Math.round(timeUntilExpiry / 1000)}s` : null,
      minutesUntilExpiry: minutesUntilExpiry !== null ? `${minutesUntilExpiry} minutes` : null,
    });
    
    // If no expiry stored, assume token is valid (no expiry)
    // This handles cases where token was stored without expiresIn
    if (!expiresAt) {
      console.log('⚠️ TokenStorage: No expiry stored, assuming token is valid');
      return false;
    }
    
    // Check if expired or will expire within buffer time
    const bufferMs = bufferMinutes * 60 * 1000;
    const isExpired = now >= expiresAtTimestamp!;
    const willExpireSoon = !isExpired && timeUntilExpiry! <= bufferMs;
    
    if (isExpired) {
      console.log('❌ TokenStorage: Token is EXPIRED', { 
        expiredBy: `${Math.abs(minutesUntilExpiry!)} minutes ago` 
      });
    } else if (willExpireSoon) {
      console.log('⚠️ TokenStorage: Token will expire soon (within buffer)', { 
        expiresIn: `${minutesUntilExpiry} minutes`,
        bufferMinutes
      });
    } else {
      console.log('✅ TokenStorage: Token is VALID', { 
        expiresIn: `${minutesUntilExpiry} minutes` 
      });
    }
    
    // Return true if expired or will expire soon (to trigger refresh)
    return isExpired || willExpireSoon;
  }
  
  /**
   * Clear all auth data
   */
  async clear(): Promise<void> {
    await this.removeToken();
    
    // Also clear refresh token if exists
    const refreshKey = this.getKey('refresh_token');
    switch (this.config.strategy) {
      case StorageStrategy.HTTP_ONLY_COOKIE:
      case StorageStrategy.ENCRYPTED_LOCAL_STORAGE:
        localStorage.removeItem(refreshKey);
        break;
      case StorageStrategy.SESSION_STORAGE:
        sessionStorage.removeItem(refreshKey);
        break;
      case StorageStrategy.INDEXED_DB:
        await IndexedDBStorage.removeItem(refreshKey);
        break;
      case StorageStrategy.MEMORY:
        MemoryStorage.removeItem(refreshKey);
        break;
    }
  }
}

/**
 * Default token storage instance
 * Configure based on your security requirements
 */
export const tokenStorage = new TokenStorage({
  strategy: StorageStrategy.ENCRYPTED_LOCAL_STORAGE, // Change to your preferred strategy
  encrypt: true, // Enable encryption
  keyPrefix: 'mappa_auth_',
});

/**
 * Factory function to create token storage with custom config
 */
export function createTokenStorage(config: TokenStorageConfig): TokenStorage {
  return new TokenStorage(config);
}

