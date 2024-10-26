const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database.config');
const { port, discordToken, mongodbUri } = require('./config/env.config');
const router = require('./routes/api');
const errorHandler = require('./middleware/errorHandling');
const authentication = require('./middleware/authentication');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Authentication middleware
app.use(authentication);

// Routes
app.use('/api', router);

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

// Start Discord bot
const { Client, IntentsBitField } = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

client.on('ready', async () => {
  try {
    logger.info(`Logged in as ${client.user.tag}!`);
    // ... (rest of your ready event logic from events/ready.js)
  } catch (error) {
    logger.error('Error during bot initialization:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    // ... (rest of your interactionCreate event logic from events/interactionCreate.js)
  } catch (error) {
    logger.error('Error handling interaction:', error);
    await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
  }
});

client.login(discordToken);