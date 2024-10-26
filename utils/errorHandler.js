const { MessageEmbed } = require('discord.js');
const logger = require('./logger');

const responseHelper = {
  sendSuccessMessage: async (interaction, message) => {
    try {
      await interaction.reply({ content: message, ephemeral: true });
    } catch (error) {
      logger.error(`Error sending success message: ${error}`);
    }
  },

  sendErrorMessage: async (interaction, message) => {
    try {
      const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription(message);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      logger.error(`Error sending error message: ${error}`);
    }
  },
};

module.exports = responseHelper;