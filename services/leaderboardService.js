const { model, Schema } = require('mongoose');
const logger = require('../utils/logger');

const LeaderboardSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  entries: [
    {
      userId: {
        type: String,
        required: true,
      },
      studyActivityPoints: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const Leaderboard = model('Leaderboard', LeaderboardSchema);

const leaderboardService = {
  async createLeaderboard(guildId) {
    try {
      const newLeaderboard = new Leaderboard({ guildId });
      await newLeaderboard.save();
      logger.info(`Leaderboard created for guild: ${guildId}`);
      return newLeaderboard;
    } catch (error) {
      logger.error(`Error creating leaderboard for guild: ${guildId}`, error);
      throw error;
    }
  },

  async getGlobalLeaderboard() {
    try {
      const leaderboard = await Leaderboard.findOne({ guildId: null }).exec();
      logger.info('Global leaderboard retrieved');
      return leaderboard ? leaderboard.entries : null;
    } catch (error) {
      logger.error('Error retrieving global leaderboard', error);
      throw error;
    }
  },

  async getServerLeaderboard(guildId) {
    try {
      const leaderboard = await Leaderboard.findOne({ guildId }).exec();
      logger.info(`Server leaderboard retrieved for guild: ${guildId}`);
      return leaderboard ? leaderboard.entries : null;
    } catch (error) {
      logger.error(`Error retrieving server leaderboard for guild: ${guildId}`, error);
      throw error;
    }
  },

  async updateLeaderboardEntry(guildId, userId, studyActivityPoints) {
    try {
      const leaderboard = await Leaderboard.findOneAndUpdate(
        { guildId },
        {
          $push: { entries: { userId, studyActivityPoints } },
          $pull: { entries: { userId: userId } },
        },
        { upsert: true, new: true },
      );
      logger.info(`Leaderboard entry updated for guild: ${guildId}, user: ${userId}`);
      return leaderboard;
    } catch (error) {
      logger.error(`Error updating leaderboard entry for guild: ${guildId}, user: ${userId}`, error);
      throw error;
    }
  },
};

module.exports = leaderboardService;