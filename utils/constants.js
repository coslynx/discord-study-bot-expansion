const subjects = [
  'mathematics',
  'biology',
  // Add more subjects as needed
];

const activityTypes = {
  PLAYING: 0,
  STREAMING: 1,
  LISTENING: 2,
  WATCHING: 3,
  CUSTOM: 4,
};

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const commands = {
  flashcard: {
    description: 'Manage your flashcards',
  },
  streak: {
    description: 'Manage your streak',
  },
  leaderboard: {
    description: 'View the leaderboard',
  },
  study: {
    description: 'Start or manage a study session',
  },
  quiz: {
    description: 'Take a quiz on a specific subject',
  },
  help: {
    description: 'Get help with the bot commands',
  },
  settings: {
    description: 'Manage your bot settings',
  },
};

module.exports = {
  subjects,
  activityTypes,
  letters,
  commands,
};