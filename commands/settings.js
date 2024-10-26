const { SlashCommandBuilder } = require('discord.js');
const settingsService = require('../services/settingsService');
const userService = require('../services/userService');
const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Manage your bot settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('theme')
        .setDescription('Change your bot theme')
        .addStringOption(option =>
          option
            .setName('theme')
            .setDescription('Choose a theme')
            .setRequired(true)
            .addChoices(
              { name: 'Light', value: 'light' },
              { name: 'Dark', value: 'dark' },
            ),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('notifications')
        .setDescription('Manage your notification preferences')
        .addBooleanOption(option =>
          option
            .setName('streak_reminder')
            .setDescription('Receive streak reminder notifications')
            .setRequired(true),
        )
        .addBooleanOption(option =>
          option
            .setName('quiz_reminder')
            .setDescription('Receive quiz reminder notifications')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('study_session')
        .setDescription('Manage your study session settings')
        .addIntegerOption(option =>
          option
            .setName('timer_duration')
            .setDescription('Set the timer duration in minutes')
            .setRequired(true)
            .setMinValue(1),
        )
        .addIntegerOption(option =>
          option
            .setName('break_duration')
            .setDescription('Set the break duration in minutes')
            .setRequired(true)
            .setMinValue(1),
        ),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    try {
      const user = await userService.getUser(userId);

      switch (subcommand) {
        case 'theme': {
          const theme = interaction.options.getString('theme');
          await settingsService.updateSettings(userId, { theme });
          await responseHelper.sendSuccessMessage(interaction, `Your theme has been updated to ${theme}.`);
          break;
        }
        case 'notifications': {
          const streakReminder = interaction.options.getBoolean('streak_reminder');
          const quizReminder = interaction.options.getBoolean('quiz_reminder');
          await settingsService.updateSettings(userId, { streakReminder, quizReminder });
          await responseHelper.sendSuccessMessage(interaction, 'Your notification preferences have been updated.');
          break;
        }
        case 'study_session': {
          const timerDuration = interaction.options.getInteger('timer_duration');
          const breakDuration = interaction.options.getInteger('break_duration');
          await settingsService.updateSettings(userId, { timerDuration, breakDuration });
          await responseHelper.sendSuccessMessage(interaction, 'Your study session settings have been updated.');
          break;
        }
        default:
          await responseHelper.sendErrorMessage(interaction, 'Invalid settings subcommand.');
      }
    } catch (error) {
      console.error(error);
      await responseHelper.sendErrorMessage(interaction, 'An error occurred while updating your settings.');
    }
  },
};