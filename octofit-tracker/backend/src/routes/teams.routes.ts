import { Router, type Request, type Response } from 'express';
import { Team } from '../models/team.model';

const teamsRouter = Router();

teamsRouter.get('/', async (_req: Request, res: Response) => {
  const teams = await Team.find().sort({ createdAt: -1 }).lean();
  res.json(teams);
});

teamsRouter.post('/', async (req: Request, res: Response) => {
  const created = await Team.create(req.body);
  res.status(201).json(created);
});

export default teamsRouter;
