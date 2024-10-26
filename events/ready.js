const { Client, IntentsBitField } = require('discord.js');
const logger = require('../utils/logger');
const commandHandler = require('../utils/commandHandler');
const constants = require('../utils/constants');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

client.on('ready', async () => {
  try {
    logger.info(`Logged in as ${client.user.tag}!`);

    // Register all commands globally
    await client.application.commands.set(constants.commands);

    logger.info('Successfully registered all commands.');

    // Update bot's presence
    client.user.setPresence({
      activities: [{ name: 'Study with me!', type: constants.activityTypes.PLAYING }],
      status: 'online',
    });
  } catch (error) {
    logger.error('Error during bot initialization:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.type === InteractionType.ApplicationCommand) {
      await commandHandler.handleCommand(interaction);
    }
  } catch (error) {
    logger.error('Error handling interaction:', error);
    await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);