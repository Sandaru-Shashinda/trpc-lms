import { Router, Request, Response, NextFunction } from 'express';
import { avatarUpload } from '../middleware/upload.middleware';
import { User } from '../models/User.model';
import { verifyToken } from '../utils/jwt.utils';
import path from 'path';

const router = Router();

// Authentication middleware for upload routes
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Avatar upload endpoint
router.post(
  '/avatar',
  authenticate,
  avatarUpload.single('avatar'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = (req as any).user.userId;

      // Update user's profile picture in database
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        userId,
        { profilePicture: avatarUrl },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({
        success: true,
        avatarUrl,
        user,
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      return res.status(500).json({ error: error.message || 'Upload failed' });
    }
  }
);

export default router;
