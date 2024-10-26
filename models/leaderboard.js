const { SlashCommandBuilder } = require('discord.js');
const leaderboardService = require('../services/leaderboardService');
const userService = require('../services/userService');
const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the leaderboard')
    .addSubcommand(subcommand =>
      subcommand
        .setName('global')
        .setDescription('View the global leaderboard'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription('View the server leaderboard'),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    try {
      const user = await userService.getUser(userId);

      if (!user) {
        await responseHelper.sendErrorMessage(interaction, 'You need to be registered with the bot to view the leaderboard.');
        return;
      }

      let leaderboard;

      switch (subcommand) {
        case 'global': {
          leaderboard = await leaderboardService.getGlobalLeaderboard();
          break;
        }
        case 'server': {
          leaderboard = await leaderboardService.getServerLeaderboard(interaction.guildId);
          break;
        }
        default:
          await responseHelper.sendErrorMessage(interaction, 'Invalid leaderboard subcommand.');
          return;
      }

      if (!leaderboard) {
        await responseHelper.sendErrorMessage(interaction, 'No leaderboard data found.');
        return;
      }

      let leaderboardMessage = `${subcommand === 'global' ? 'Global' : 'Server'} Leaderboard:\n\n`;

      for (let i = 0; i < leaderboard.length; i += 1) {
        leaderboardMessage += `${i + 1}. <@${leaderboard[i].userId}> - ${leaderboard[i].studyActivityPoints} points\n`;
      }

      await responseHelper.sendSuccessMessage(interaction, leaderboardMessage);
    } catch (error) {
      console.error(error);
      await responseHelper.sendErrorMessage(interaction, 'An error occurred while retrieving the leaderboard.');
    }
  },
};