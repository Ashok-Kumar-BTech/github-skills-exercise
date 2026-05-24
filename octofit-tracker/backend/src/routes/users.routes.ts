import { Router, type Request, type Response } from 'express';
import { User } from '../models/user.model';

const usersRouter = Router();

usersRouter.get('/', async (_req: Request, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.json(users);
});

usersRouter.post('/', async (req: Request, res: Response) => {
  const created = await User.create(req.body);
  res.status(201).json(created);
});

export default usersRouter;
