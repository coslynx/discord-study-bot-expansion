const { Guild } = require('discord.js');
const logger = require('../utils/logger');
const settingsService = require('../services/settingsService');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    try {
      logger.info(`Joined a new guild: ${guild.name} (ID: ${guild.id})`);

      // Initialize default settings for the new guild
      await settingsService.createDefaultGuildSettings(guild.id);

      // Send a welcome message to the server
      const welcomeChannel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
      if (welcomeChannel) {
        welcomeChannel.send(`Hello, ${guild.name}! Thanks for inviting me. I'm here to help you study!`);
      }
    } catch (error) {
      logger.error(`Error joining guild ${guild.name} (ID: ${guild.id}):`, error);
    }
  },
};