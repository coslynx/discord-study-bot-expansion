require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  discordToken: process.env.DISCORD_TOKEN,
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
};