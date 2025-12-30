import { Db, MongoClient, ClientSession, Document } from 'mongodb';

export interface DatabaseConfig {
  uri: string;
  dbName: string;
  options: MongoClientOptions;
  poolConfig?: PoolConfig;
}

export interface MongoClientOptions {
  maxPoolSize?: number;
  minPoolSize?: number;
  maxIdleTimeMS?: number;
  serverSelectionTimeoutMS?: number;
  socketTimeoutMS?: number;
  connectTimeoutMS?: number;
  retryWrites?: boolean;
  retryReads?: boolean;
  w?: string | number;
  readPreference?: string;
  compressors?: string[];
}

export interface PoolConfig {
  maxSize: number;
  minSize: number;
  acquireTimeoutMillis: number;
  idleTimeoutMillis: number;
}

export interface DatabaseMetrics {
  queries: number;
  errors: number;
  slowQueries: number;
  transactions: number;
  connectionPoolStats: PoolStats | null;
  lastHealthCheck: Date | null;
  uptime: number;
  avgQueryTime: number;
}

export interface PoolStats {
  totalConnections: number;
  availableConnections: number;
  pendingRequests: number;
}

export interface QueryOptions {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface Logger {
  debug(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
}