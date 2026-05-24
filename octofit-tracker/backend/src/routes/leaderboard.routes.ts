import { Router, type Request, type Response } from 'express';
import { LeaderboardEntry } from '../models/leaderboard.model';

const leaderboardRouter = Router();

leaderboardRouter.get('/', async (_req: Request, res: Response) => {
  const entries = await LeaderboardEntry.find().sort({ rank: 1, points: -1 }).lean();
  res.json(entries);
});

leaderboardRouter.post('/', async (req: Request, res: Response) => {
  const created = await LeaderboardEntry.create(req.body);
  res.status(201).json(created);
});

export default leaderboardRouter;
