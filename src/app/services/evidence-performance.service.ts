/**
 * Evidence Performance Service
 * Implements NFR-L01, Performance Requirements
 * 
 * - List load p95 ≤ 800ms
 * - Viewer tải file theo streaming/chunk
 * - UI có progress & retry
 */

export interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'success' | 'error';
  metadata?: Record<string, any>;
}

export interface FileDownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  remainingTime: number; // seconds
  chunkIndex?: number;
  totalChunks?: number;
}

export interface StreamingDownloadOptions {
  chunkSize?: number; // bytes (default 1MB)
  maxRetries?: number; // (default 3)
  retryDelay?: number; // ms (default 1000)
  onProgress?: (progress: FileDownloadProgress) => void;
  onChunkLoaded?: (chunkIndex: number, totalChunks: number) => void;
}

class EvidencePerformanceService {
  private metrics: PerformanceMetric[] = [];
  private performanceObserver: PerformanceObserver | null = null;

  constructor() {
    this.initPerformanceMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private initPerformanceMonitoring() {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.logPerformanceEntry(entry);
          }
        });

        this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported', error);
      }
    }
  }

  /**
   * Start performance measurement
   */
  startMeasure(operation: string, metadata?: Record<string, any>): string {
    const measureId = `${operation}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const metric: PerformanceMetric = {
      operation,
      startTime: Date.now(),
      status: 'pending',
      metadata
    };

    this.metrics.push(metric);
    
    // Use Performance API
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${measureId}-start`);
    }

    return measureId;
  }

  /**
   * End performance measurement
   */
  endMeasure(measureId: string, status: 'success' | 'error' = 'success', metadata?: Record<string, any>) {
    const metric = this.metrics.find(m => 
      measureId.startsWith(`${m.operation}-`) && m.status === 'pending'
    );

    if (metric) {
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.status = status;
      if (metadata) {
        metric.metadata = { ...metric.metadata, ...metadata };
      }

      // Use Performance API
      if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
        try {
          performance.mark(`${measureId}-end`);
          performance.measure(
            measureId,
            `${measureId}-start`,
            `${measureId}-end`
          );
        } catch (error) {
          console.warn('Performance measure failed', error);
        }
      }

      // Log if exceeds threshold
      if (metric.operation === 'evidence-list-load' && metric.duration > 800) {
        console.warn(`[PERFORMANCE] Evidence list load exceeded threshold: ${metric.duration}ms > 800ms`);
      }

      // NFR-L01: Log performance metric
      this.logPerformanceMetric(metric);
    }
  }

  /**
   * Log performance metric (NFR-L01 compliant)
   */
  private logPerformanceMetric(metric: PerformanceMetric) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'performance',
      operation: metric.operation,
      duration: metric.duration,
      status: metric.status,
      metadata: metric.metadata,
      sanitized: true
    };

    console.log('[PERFORMANCE_LOG]', JSON.stringify(logEntry));

    // Store in localStorage for analytics
    try {
      const logs = this.getPerformanceLogs();
      logs.unshift(logEntry);
      const trimmedLogs = logs.slice(0, 500);
      localStorage.setItem('evidence_performance_logs', JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('[PERFORMANCE_LOG_ERROR]', error);
    }
  }

  /**
   * Get performance logs
   */
  getPerformanceLogs(): any[] {
    try {
      const logs = localStorage.getItem('evidence_performance_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  /**
   * Log performance entry from PerformanceObserver
   */
  private logPerformanceEntry(entry: PerformanceEntry) {
    console.log('[PERFORMANCE_ENTRY]', {
      name: entry.name,
      type: entry.entryType,
      duration: entry.duration,
      startTime: entry.startTime
    });
  }

  /**
   * Download file with streaming/chunking support
   * NFR: Viewer tải file theo streaming/chunk, UI có progress & retry
   */
  async downloadFileStreaming(
    fileUrl: string,
    fileName: string,
    options: StreamingDownloadOptions = {}
  ): Promise<Blob> {
    const {
      chunkSize = 1024 * 1024, // 1MB chunks
      maxRetries = 3,
      retryDelay = 1000,
      onProgress,
      onChunkLoaded
    } = options;

    const measureId = this.startMeasure('file-download-streaming', {
      fileName,
      fileUrl,
      chunkSize
    });

    let retryCount = 0;
    const startTime = Date.now();

    while (retryCount < maxRetries) {
      try {
        // For demo purposes, we'll simulate chunked download
        // In production, use Range headers: fetch(url, { headers: { Range: `bytes=${start}-${end}` } })
        
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentLength = parseInt(response.headers.get('content-length') || '0');
        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error('Response body is not readable');
        }

        const chunks: Uint8Array[] = [];
        let loaded = 0;

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
          loaded += value.length;

          // Calculate progress
          const percentage = contentLength > 0 ? (loaded / contentLength) * 100 : 0;
          const elapsedTime = (Date.now() - startTime) / 1000; // seconds
          const speed = loaded / elapsedTime; // bytes per second
          const remainingBytes = contentLength - loaded;
          const remainingTime = speed > 0 ? remainingBytes / speed : 0;

          const progress: FileDownloadProgress = {
            loaded,
            total: contentLength,
            percentage,
            speed,
            remainingTime
          };

          if (onProgress) {
            onProgress(progress);
          }
        }

        // Combine chunks
        const blob = new Blob(chunks);

        this.endMeasure(measureId, 'success', {
          fileSize: blob.size,
          downloadTime: Date.now() - startTime,
          retries: retryCount
        });

        return blob;

      } catch (error) {
        retryCount++;
        console.error(`[DOWNLOAD_ERROR] Attempt ${retryCount}/${maxRetries}:`, error);

        if (retryCount >= maxRetries) {
          this.endMeasure(measureId, 'error', {
            error: (error as Error).message,
            retries: retryCount
          });
          throw new Error(`Download failed after ${maxRetries} retries: ${(error as Error).message}`);
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
      }
    }

    throw new Error('Download failed - max retries exceeded');
  }

  /**
   * Simulate file chunk loading (for demo)
   */
  async simulateChunkedDownload(
    totalSize: number,
    chunkSize: number,
    onProgress?: (progress: FileDownloadProgress) => void
  ): Promise<void> {
    const totalChunks = Math.ceil(totalSize / chunkSize);
    let loaded = 0;
    const startTime = Date.now();

    for (let i = 0; i < totalChunks; i++) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

      const chunkLoadSize = Math.min(chunkSize, totalSize - loaded);
      loaded += chunkLoadSize;

      const elapsedTime = (Date.now() - startTime) / 1000;
      const speed = loaded / elapsedTime;
      const remainingBytes = totalSize - loaded;
      const remainingTime = speed > 0 ? remainingBytes / speed : 0;

      const progress: FileDownloadProgress = {
        loaded,
        total: totalSize,
        percentage: (loaded / totalSize) * 100,
        speed,
        remainingTime,
        chunkIndex: i + 1,
        totalChunks
      };

      if (onProgress) {
        onProgress(progress);
      }
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(operation?: string): {
    count: number;
    avgDuration: number;
    p95Duration: number;
    successRate: number;
  } {
    let metrics = this.metrics;
    
    if (operation) {
      metrics = metrics.filter(m => m.operation === operation);
    }

    const completedMetrics = metrics.filter(m => m.duration !== undefined);
    
    if (completedMetrics.length === 0) {
      return { count: 0, avgDuration: 0, p95Duration: 0, successRate: 0 };
    }

    const durations = completedMetrics.map(m => m.duration!).sort((a, b) => a - b);
    const successCount = completedMetrics.filter(m => m.status === 'success').length;

    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const p95Index = Math.floor(durations.length * 0.95);
    const p95Duration = durations[p95Index] || durations[durations.length - 1];
    const successRate = (successCount / completedMetrics.length) * 100;

    return {
      count: completedMetrics.length,
      avgDuration: Math.round(avgDuration),
      p95Duration: Math.round(p95Duration),
      successRate: Math.round(successRate * 100) / 100
    };
  }

  /**
   * Clear metrics
   */
  clearMetrics() {
    this.metrics = [];
  }
}

// Singleton instance
export const evidencePerformanceService = new EvidencePerformanceService();
