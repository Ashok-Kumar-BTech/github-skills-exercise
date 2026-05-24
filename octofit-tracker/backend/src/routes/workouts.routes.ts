import { Router, type Request, type Response } from 'express';
import { Workout } from '../models/workout.model';

const workoutsRouter = Router();

workoutsRouter.get('/', async (_req: Request, res: Response) => {
  const workouts = await Workout.find().sort({ createdAt: -1 }).lean();
  res.json(workouts);
});

workoutsRouter.post('/', async (req: Request, res: Response) => {
  const created = await Workout.create(req.body);
  res.status(201).json(created);
});

export default workoutsRouter;
