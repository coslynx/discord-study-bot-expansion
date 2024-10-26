const { SlashCommandBuilder } = require('discord.js');
const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with the bot commands'),
  async execute(interaction) {
    try {
      const commands = constants.commands;
      let helpMessage = 'Here are the available commands:\n\n';

      for (const command in commands) {
        helpMessage += `\`/${command}\`: ${commands[command].description}\n`;
      }

      await responseHelper.sendSuccessMessage(interaction, helpMessage);
    } catch (error) {
      console.error(error);
      await responseHelper.sendErrorMessage(interaction, 'An error occurred while retrieving help information.');
    }
  },
};