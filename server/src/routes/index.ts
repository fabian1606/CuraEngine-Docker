import { Router, Request, Response } from 'express';

import slice from './slice';


const router: Router = Router();

router.use('/slice', slice);

const startedAt: Date = new Date();

router.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
    message: 'Welcome to the API. 🚀',
    uptime: process.uptime(),
    startedAt,
  });
});

export default router;
