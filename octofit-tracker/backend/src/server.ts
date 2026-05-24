import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT) || 8000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    baseUrl,
    port,
    mongo: {
      uri: mongoUri,
      connected: mongoState === 1,
      readyState: mongoState,
    },
  });
});

async function start(): Promise<void> {
  try {
    await mongoose.connect(mongoUri, { dbName: 'octofit_db' });
    console.log(`MongoDB connected at ${mongoUri}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }

  app.listen(port, () => {
    console.log(`OctoFit backend listening on ${baseUrl}`);
  });
}

void start();
