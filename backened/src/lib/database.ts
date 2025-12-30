import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import { EventEmitter } from 'events';
import { dbConfig, DatabaseConfig } from '../config/database.config';

interface DatabaseMetrics {
  queries: number;
  errors: number;
  slowQueries: number;
  lastHealthCheck: Date | null;
}

interface MetricsResponse extends DatabaseMetrics {
  isConnected: boolean;
  poolStats: any;
}

export class DatabaseManager extends EventEmitter {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private readonly maxRetries: number = 5;
  private readonly retryDelay: number = 5000;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private metrics: DatabaseMetrics = {
    queries: 0,
    errors: 0,
    slowQueries: 0,
    lastHealthCheck: null,
  };

  async connect(): Promise<Db> {
    const env = (process.env.NODE_ENV || 'development') as keyof typeof dbConfig;
    const config = dbConfig[env];

    if (!config.uri) {
      throw new Error('MongoDB URI not configured');
    }

    return this.connectWithRetry(config);
  }

  private async connectWithRetry(config: DatabaseConfig, attempt: number = 1): Promise<Db> {
    try {
      console.log(`[DB] Connection attempt ${attempt}/${this.maxRetries}`);

      this.client = new MongoClient(config.uri, config.options as MongoClientOptions);
      
      await this.client.connect();
      this.db = this.client.db(config.dbName);
      
      // Verify connection
      await this.db.admin().ping();
      
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log(`[DB] ✓ Connected to ${config.dbName}`);
      
      this.setupEventHandlers();
      this.startHealthCheck();
      this.emit('connected');
      
      return this.db;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[DB] Connection failed (attempt ${attempt}):`, errorMessage);
      
      if (attempt < this.maxRetries) {
        const delay = this.retryDelay * attempt;
        console.log(`[DB] Retrying in ${delay}ms...`);
        await this.sleep(delay);
        return this.connectWithRetry(config, attempt + 1);
      }
      
      this.emit('error', error);
      throw new Error(`Failed to connect after ${this.maxRetries} attempts`);
    }
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    // Monitor connection pool
    this.client.on('connectionPoolCreated', () => {
      console.log('[DB] Connection pool created');
    });

    this.client.on('connectionPoolClosed', () => {
      console.log('[DB] Connection pool closed');
      this.isConnected = false;
    });

    this.client.on('connectionCreated', (event) => {
      console.log(`[DB] Connection created: ${event.connectionId}`);
    });

    this.client.on('connectionClosed', (event) => {
      console.log(`[DB] Connection closed: ${event.connectionId}`);
    });

    // Monitor server events
    this.client.on('serverHeartbeatFailed', (event) => {
      console.error('[DB] Heartbeat failed:', event);
      this.metrics.errors++;
      this.emit('heartbeatFailed', event);
    });

    this.client.on('serverHeartbeatSucceeded', () => {
      // Optionally log successful heartbeats
    });

    this.client.on('topologyDescriptionChanged', () => {
      console.log('[DB] Topology changed');
    });

    // Command monitoring for performance
    this.client.on('commandStarted', () => {
      this.metrics.queries++;
    });

    this.client.on('commandSucceeded', (event) => {
      if (event.duration > 1000) { // Slow query threshold: 1s
        this.metrics.slowQueries++;
        console.warn(`[DB] Slow query detected: ${event.commandName} took ${event.duration}ms`);
      }
    });

    this.client.on('commandFailed', (event) => {
      this.metrics.errors++;
      console.error(`[DB] Command failed: ${event.commandName}`, event.failure);
    });
  }

  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        if (!this.db) return;
        await this.db.admin().ping();
        this.metrics.lastHealthCheck = new Date();
      } catch (error) {
        console.error('[DB] Health check failed:', error);
        this.isConnected = false;
        this.emit('healthCheckFailed', error);
      }
    }, 30000); // Every 30 seconds
  }

  async disconnect(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    if (this.client) {
      await this.client.close(true); // Force close
      this.isConnected = false;
      console.log('[DB] Disconnected');
      this.emit('disconnected');
    }
  }

  getDb(): Db {
    if (!this.isConnected || !this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  getClient(): MongoClient | null {
    return this.client;
  }

  getMetrics(): MetricsResponse {
    return {
      ...this.metrics,
      isConnected: this.isConnected,
      poolStats: (this.client as any)?.topology?.s?.pool?.stats || null,
    };
  }

  async executeWithRetry<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        console.warn(`[DB] Operation failed, retry ${i + 1}/${maxRetries}`);
        await this.sleep(1000 * (i + 1));
      }
    }
    throw new Error('Operation failed after all retries');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const dbManager = new DatabaseManager();