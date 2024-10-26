const { SlashCommandBuilder } = require('discord.js');
const streakService = require('../services/streakService');
const userService = require('../services/userService');
const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('streak')
    .setDescription('Manage your streak')
    .addSubcommand(subcommand =>
      subcommand
        .setName('show')
        .setDescription('View your current streak'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('history')
        .setDescription('View your streak history'),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    try {
      const user = await userService.getUser(userId);

      if (!user) {
        await responseHelper.sendErrorMessage(interaction, 'You need to be registered with the bot to view your streak.');
        return;
      }

      switch (subcommand) {
        case 'show': {
          const streak = await streakService.getCurrentStreak(userId);

          if (streak) {
            await responseHelper.sendSuccessMessage(interaction, `Your current streak is ${streak.days} days!`);
          } else {
            await responseHelper.sendSuccessMessage(interaction, 'You do not have an active streak yet.');
          }
          break;
        }
        case 'history': {
          const streakHistory = await streakService.getStreakHistory(userId);

          if (streakHistory.length > 0) {
            let streakHistoryMessage = 'Your streak history:\n\n';

            for (const streak of streakHistory) {
              streakHistoryMessage += `- Streak of ${streak.days} days from ${new Date(streak.startDate).toLocaleDateString()} to ${new Date(streak.endDate).toLocaleDateString()}\n`;
            }

            await responseHelper.sendSuccessMessage(interaction, streakHistoryMessage);
          } else {
            await responseHelper.sendSuccessMessage(interaction, 'You have no streak history yet.');
          }
          break;
        }
        default:
          await responseHelper.sendErrorMessage(interaction, 'Invalid streak subcommand.');
      }
    } catch (error) {
      console.error(error);
      await responseHelper.sendErrorMessage(interaction, 'An error occurred while retrieving your streak.');
    }
  },
};