import { Schema, Types, model } from 'mongoose';

const workoutSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    exercises: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const Workout = model('Workout', workoutSchema);
