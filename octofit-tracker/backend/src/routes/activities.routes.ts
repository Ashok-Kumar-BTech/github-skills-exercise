import { Router, type Request, type Response } from 'express';
import { Activity } from '../models/activity.model';

const activitiesRouter = Router();

activitiesRouter.get('/', async (_req: Request, res: Response) => {
  const activities = await Activity.find().sort({ occurredAt: -1 }).lean();
  res.json(activities);
});

activitiesRouter.post('/', async (req: Request, res: Response) => {
  const created = await Activity.create(req.body);
  res.status(201).json(created);
});

export default activitiesRouter;
