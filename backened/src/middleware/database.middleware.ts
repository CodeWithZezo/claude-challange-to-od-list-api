import { Request, Response, NextFunction } from 'express';

export const healthCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  if (req.path === '/health') {
    const metrics = dbManager.getMetrics();
    const isHealthy = metrics.isConnected;
    
    return res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      database: {
        connected: isHealthy,
        lastHealthCheck: metrics.lastHealthCheck,
      },
      metrics: {
        totalQueries: metrics.queries,
        errors: metrics.errors,
        slowQueries: metrics.slowQueries,
      },
    });
  }
  next();
};