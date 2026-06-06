import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { getDevUsers } from './utils/devUserStore.js';
import User from './models/User.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // If there are dev users saved on disk, seed them into the DB (useful when
    // using the in-memory MongoDB fallback during development).
    try {
      const devUsers = await getDevUsers();
      if (devUsers?.length) {
        for (const u of devUsers) {
          const exists = await User.findOne({ email: u.email });
          if (!exists) {
            // insert raw document (contains hashed password)
            await User.create(u);
            console.log('[dev] seeded user to DB:', u.email);
          }
        }
      }
    } catch (err) {
      console.warn('[dev] failed to seed dev users:', err.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Fix MONGODB_URI in server/.env and ensure MongoDB Atlas allows your IP.');
    process.exit(1);
  }
};

startServer();
