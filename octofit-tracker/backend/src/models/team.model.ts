import { Schema, Types, model } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Types.ObjectId, ref: 'User', required: true },
    memberIds: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const Team = model('Team', teamSchema);
