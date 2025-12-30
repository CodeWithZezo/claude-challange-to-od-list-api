export interface DatabaseConfig {
  uri: string;
  dbName: string;
  options: {
    maxPoolSize: number;
    minPoolSize: number;
    maxIdleTimeMS?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
    connectTimeoutMS?: number;
    family?: number;
    retryWrites?: boolean;
    retryReads?: boolean;
    w?: string;
    readPreference?: string;
    compressors?: string[];
    zlibCompressionLevel?: number;
  };
}

interface DatabaseConfigs {
  development: DatabaseConfig;
  production: DatabaseConfig;
}

export const dbConfig: DatabaseConfigs = {
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME || 'dev_db',
    options: {
      maxPoolSize: 5,
      minPoolSize: 1,
    }
  },
  production: {
    uri: process.env.MONGODB_URI!,
    dbName: process.env.DB_NAME!,
    options: {
      maxPoolSize: 50,
      minPoolSize: 10,
      maxIdleTimeMS: 30000, 
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      readPreference: 'primaryPreferred',
      compressors: ['snappy', 'zlib'],
      zlibCompressionLevel: 6,
    }
  }
};