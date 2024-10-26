const { InteractionType } = require('discord.js');
const logger = require('./logger');

module.exports = {
  handleCommand: async (interaction) => {
    try {
      if (interaction.type === InteractionType.ApplicationCommand) {
        const command = interaction.commandName;
        const commandFile = require(`../commands/${command}.js`); // Dynamically import command file

        if (!commandFile) {
          await interaction.reply({ content: 'Invalid command.', ephemeral: true });
          return;
        }

        await commandFile.execute(interaction);
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