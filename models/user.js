const { model, Schema } = require('mongoose');
const logger = require('../utils/logger');

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  studyActivityPoints: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: Date,
  },
  settings: {
    type: Schema.Types.ObjectId,
    ref: 'Settings',
  },
});

const User = model('User', UserSchema);

const userService = {
  async createUser(userId, username) {
    try {
      const newUser = new User({ userId, username });
      await newUser.save();
      logger.info(`User created: ${userId}`);
      return newUser;
    } catch (error) {
      logger.error(`Error creating user: ${userId}`, error);
      throw error;
    }
  },

  async getUser(userId) {
    try {
      const user = await User.findOne({ userId }).exec();
      logger.info(`User retrieved: ${userId}`);
      return user;
    } catch (error) {
      logger.error(`Error retrieving user: ${userId}`, error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    try {
      const updatedUser = await User.findOneAndUpdate({ userId }, updates, { new: true });
      logger.info(`User updated: ${userId}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user: ${userId}`, error);
      throw error;
    }
  },

  async updateStreak(userId) {
    try {
      const user = await User.findOne({ userId }).exec();
      if (!user) {
        return;
      }
      const currentDate = new Date();
      if (user.lastActiveDate
        && currentDate.getDate() === user.lastActiveDate.getDate()
        && currentDate.getMonth() === user.lastActiveDate.getMonth()
        && currentDate.getFullYear() === user.lastActiveDate.getFullYear()) {
        // Streak continues
        user.streak += 1;
        user.lastActiveDate = currentDate;
        await user.save();
        logger.info(`Streak updated for user: ${userId}`);
      } else {
        // Streak resets
        user.streak = 1;
        user.lastActiveDate = currentDate;
        await user.save();
        logger.info(`Streak reset and updated for user: ${userId}`);
      }
    } catch (error) {
      logger.error(`Error updating streak for user: ${userId}`, error);
      throw error;
    }
  },

  async addStudyActivityPoints(userId, points) {
    try {
      const user = await User.findOne({ userId }).exec();
      if (!user) {
        return;
      }
      user.studyActivityPoints += points;
      await user.save();
      logger.info(`Study activity points added for user: ${userId}`);
    } catch (error) {
      logger.error(`Error adding study activity points for user: ${userId}`, error);
      throw error;
    }
  },
};

module.exports = userService;