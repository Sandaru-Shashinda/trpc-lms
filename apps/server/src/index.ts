import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Try to connect to database (graceful handling if not available)
    try {
      await connectDatabase();
      logger.info('✅ Database connected');
    } catch (dbError) {
      logger.warn('⚠️  Database connection failed - running without DB:', dbError);
      logger.warn('   Server will start but database operations will fail');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 tRPC endpoint: http://localhost:${PORT}/api/trpc`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
