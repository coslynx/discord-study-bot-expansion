const { SlashCommandBuilder } = require('discord.js');
const studySessionService = require('../services/studySessionService');
const userService = require('../services/userService');
const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('study')
    .setDescription('Start or manage a study session')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a new study session')
        .addIntegerOption(option =>
          option
            .setName('timer')
            .setDescription('Set the timer duration in minutes')
            .setRequired(true)
            .setMinValue(1),
        )
        .addIntegerOption(option =>
          option
            .setName('break')
            .setDescription('Set the break duration in minutes')
            .setRequired(true)
            .setMinValue(1),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stop')
        .setDescription('Stop the current study session'),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    try {
      const user = await userService.getUser(userId);

      if (!user) {
        await responseHelper.sendErrorMessage(interaction, 'You need to be registered with the bot to start a study session.');
        return;
      }

      switch (subcommand) {
        case 'start': {
          const timerDuration = interaction.options.getInteger('timer');
          const breakDuration = interaction.options.getInteger('break');
          const studySession = await studySessionService.startStudySession(userId, timerDuration, breakDuration);
          await responseHelper.sendSuccessMessage(interaction, `Study session started! You have ${timerDuration} minutes to focus.`);
          // Implement a timer that sends a message when the study session ends
          setTimeout(async () => {
            await responseHelper.sendSuccessMessage(interaction, 'Your study session is over! Take a break.');
            // Update the user's streak
            await userService.updateStreak(userId);
          }, timerDuration  60  1000);
          break;
        }
        case 'stop': {
          await studySessionService.stopStudySession(userId);
          await responseHelper.sendSuccessMessage(interaction, 'Study session stopped.');
          break;
        }
        default:
          await responseHelper.sendErrorMessage(interaction, 'Invalid study subcommand.');
      }
    } catch (error) {
      console.error(error);
      await responseHelper.sendErrorMessage(interaction, 'An error occurred while managing your study session.');
    }
  },
};