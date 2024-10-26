const { model, Schema } = require('mongoose');
const logger = require('../utils/logger');

const SettingsSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  streakReminder: {
    type: Boolean,
    default: true,
  },
  quizReminder: {
    type: Boolean,
    default: true,
  },
  timerDuration: {
    type: Number,
    default: 25,
  },
  breakDuration: {
    type: Number,
    default: 5,
  },
});

const Settings = model('Settings', SettingsSchema);

const settingsService = {
  async createDefaultSettings(userId) {
    try {
      const newSettings = new Settings({ userId });
      await newSettings.save();
      logger.info(`Default settings created for user ${userId}`);
    } catch (error) {
      logger.error(`Error creating default settings for user ${userId}:`, error);
    }
  },

  async updateSettings(userId, settings) {
    try {
      const updatedSettings = await Settings.findOneAndUpdate(
        { userId },
        settings,
        { new: true, upsert: true },
      );
      logger.info(`Settings updated for user ${userId}`);
      return updatedSettings;
    } catch (error) {
      logger.error(`Error updating settings for user ${userId}:`, error);
      throw error;
    }
  },

  async getSettings(userId) {
    try {
      const userSettings = await Settings.findOne({ userId });
      logger.info(`Settings retrieved for user ${userId}`);
      return userSettings;
    } catch (error) {
      logger.error(`Error retrieving settings for user ${userId}:`, error);
      throw error;
    }
  },
};

module.exports = settingsService;