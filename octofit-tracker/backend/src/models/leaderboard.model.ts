import { Schema, Types, model } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, default: 0, min: 0 },
    rank: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const LeaderboardEntry = model('LeaderboardEntry', leaderboardEntrySchema);
