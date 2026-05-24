import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase, MONGO_URI } from './config/database';
import activitiesRouter from './routes/activities.routes';
import leaderboardRouter from './routes/leaderboard.routes';
import teamsRouter from './routes/teams.routes';
import usersRouter from './routes/users.routes';
import workoutsRouter from './routes/workouts.routes';

const app = express();
const port = Number(process.env.PORT) || 8000;

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

app.get('/api/health', async (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    baseUrl,
    port,
    mongo: {
      uri: MONGO_URI,
      connected: mongoState === 1,
      readyState: mongoState,
    },
  });
});

async function start(): Promise<void> {
  try {
    await connectDatabase();
    console.log(`MongoDB connected at ${MONGO_URI}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }

  app.listen(port, () => {
    console.log(`OctoFit backend listening on ${baseUrl}`);
  });
}

void start();
