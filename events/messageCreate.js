const { InteractionType } = require('discord.js');
const commandHandler = require('../utils/commandHandler');
const logger = require('../utils/logger');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    try {
      if (interaction.type === InteractionType.ApplicationCommand) {
        await commandHandler.handleCommand(interaction);
      } else if (interaction.type === InteractionType.MessageComponent) {
        // Handle button clicks or other message component interactions
        // Example:
        // if (interaction.customId === 'myButton') {
        //   // Perform actions based on button click
        // }
      }
    } catch (error) {
      logger.error(error);
      await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
    }
  },
};