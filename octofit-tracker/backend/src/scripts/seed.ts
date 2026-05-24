import { connectDatabase } from '../config/database';
import { Activity } from '../models/activity.model';
import { LeaderboardEntry } from '../models/leaderboard.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { Workout } from '../models/workout.model';

async function seed(): Promise<void> {
  console.log('Seed the octofit_db database with test data');

  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.insertMany([
    {
      username: 'ashok',
      email: 'ashok@octofit.dev',
      passwordHash: 'hashed_password_ashok',
    },
    {
      username: 'mona',
      email: 'mona@octofit.dev',
      passwordHash: 'hashed_password_mona',
    },
    {
      username: 'spidertocat',
      email: 'spidertocat@octofit.dev',
      passwordHash: 'hashed_password_spidertocat',
    },
  ]);

  const [ashok, mona, spidertocat] = users;

  if (!ashok || !mona || !spidertocat) {
    throw new Error('Expected three seeded users to be created.');
  }

  await Team.insertMany([
    {
      name: 'Octo Sprinters',
      ownerId: ashok._id,
      memberIds: [ashok._id, mona._id],
    },
    {
      name: 'Night Coders',
      ownerId: spidertocat._id,
      memberIds: [spidertocat._id],
    },
  ]);

  await Activity.insertMany([
    {
      userId: ashok._id,
      type: 'Running',
      durationMinutes: 45,
      caloriesBurned: 420,
      occurredAt: new Date('2026-05-20T06:30:00Z'),
    },
    {
      userId: mona._id,
      type: 'Cycling',
      durationMinutes: 60,
      caloriesBurned: 510,
      occurredAt: new Date('2026-05-21T07:00:00Z'),
    },
    {
      userId: spidertocat._id,
      type: 'HIIT',
      durationMinutes: 30,
      caloriesBurned: 350,
      occurredAt: new Date('2026-05-21T18:30:00Z'),
    },
  ]);

  await LeaderboardEntry.insertMany([
    { userId: mona._id, points: 1250, rank: 1 },
    { userId: ashok._id, points: 1120, rank: 2 },
    { userId: spidertocat._id, points: 980, rank: 3 },
  ]);

  await Workout.insertMany([
    {
      userId: ashok._id,
      title: 'Tempo Run Builder',
      difficulty: 'intermediate',
      exercises: ['Warm-up jog', 'Tempo intervals', 'Cooldown walk'],
    },
    {
      userId: mona._id,
      title: 'Endurance Ride Session',
      difficulty: 'advanced',
      exercises: ['Cadence drills', 'Hill repeats', 'Stretch routine'],
    },
    {
      userId: spidertocat._id,
      title: 'Quick Core Blast',
      difficulty: 'beginner',
      exercises: ['Plank', 'Mountain climbers', 'Russian twists'],
    },
  ]);

  console.log('Seed completed successfully.');
}

void seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
