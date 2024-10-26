const { model, Schema } = require('mongoose');
const logger = require('../utils/logger');

const StreakSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const Streak = model('Streak', StreakSchema);

const streakService = {
  async createStreak(userId) {
    try {
      const newStreak = new Streak({ userId, startDate: new Date() });
      await newStreak.save();
      logger.info(`Streak created for user: ${userId}`);
      return newStreak;
    } catch (error) {
      logger.error(`Error creating streak for user: ${userId}`, error);
      throw error;
    }
  },

  async getCurrentStreak(userId) {
    try {
      const streak = await Streak.findOne({ userId, endDate: null }).exec();
      logger.info(`Current streak retrieved for user: ${userId}`);
      return streak;
    } catch (error) {
      logger.error(`Error retrieving current streak for user: ${userId}`, error);
      throw error;
    }
  },

  async updateStreak(userId) {
    try {
      const streak = await Streak.findOne({ userId, endDate: null }).exec();

      if (!streak) {
        // Create a new streak if no existing streak exists
        await this.createStreak(userId);
        return;
      }

      // Update the streak if it exists
      streak.days += 1;
      await streak.save();
      logger.info(`Streak updated for user: ${userId}`);
    } catch (error) {
      logger.error(`Error updating streak for user: ${userId}`, error);
      throw error;
    }
  },

  async endStreak(userId) {
    try {
      const streak = await Streak.findOneAndUpdate(
        { userId, endDate: null },
        { endDate: new Date() },
        { new: true },
      );
      logger.info(`Streak ended for user: ${userId}`);
      return streak;
    } catch (error) {
      logger.error(`Error ending streak for user: ${userId}`, error);
      throw error;
    }
  },

  async getStreakHistory(userId) {
    try {
      const streakHistory = await Streak.find({ userId }).sort({ startDate: -1 }).exec();
      logger.info(`Streak history retrieved for user: ${userId}`);
      return streakHistory;
    } catch (error) {
      logger.error(`Error retrieving streak history for user: ${userId}`, error);
      throw error;
    }
  },
};

module.exports = streakService;