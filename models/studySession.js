const { model, Schema } = require('mongoose');
const logger = require('../utils/logger');

const StudySessionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  timerDuration: {
    type: Number,
    required: true,
  },
  breakDuration: {
    type: Number,
    required: true,
  },
});

const StudySession = model('StudySession', StudySessionSchema);

const studySessionService = {
  async startStudySession(userId, timerDuration, breakDuration) {
    try {
      const existingSession = await StudySession.findOne({ userId, isActive: true }).exec();

      if (existingSession) {
        return existingSession;
      }

      const newSession = new StudySession({
        userId,
        isActive: true,
        startTime: new Date(),
        timerDuration,
        breakDuration,
      });
      await newSession.save();
      logger.info(`Study session started for user ${userId}`);
      return newSession;
    } catch (error) {
      logger.error(`Error starting study session for user ${userId}:`, error);
      throw error;
    }
  },

  async stopStudySession(userId) {
    try {
      const session = await StudySession.findOneAndUpdate(
        { userId, isActive: true },
        { isActive: false, endTime: new Date() },
        { new: true },
      );
      logger.info(`Study session stopped for user ${userId}`);
      return session;
    } catch (error) {
      logger.error(`Error stopping study session for user ${userId}:`, error);
      throw error;
    }
  },

  async getCurrentStudySession(userId) {
    try {
      const session = await StudySession.findOne({ userId, isActive: true }).exec();
      logger.info(`Current study session retrieved for user ${userId}`);
      return session;
    } catch (error) {
      logger.error(`Error retrieving current study session for user ${userId}:`, error);
      throw error;
    }
  },
};

module.exports = studySessionService;