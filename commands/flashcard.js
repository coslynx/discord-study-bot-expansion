const { SlashCommandBuilder } = require('discord.js');
const flashcardService = require('../services/flashcardService');
const userService = require('../services/userService');
const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flashcard')
    .setDescription('Manage your flashcards')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new flashcard deck')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Enter the name for your new deck')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('subject')
            .setDescription('Choose a subject for your deck')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add flashcards to a deck')
        .addStringOption(option =>
          option
            .setName('deck')
            .setDescription('Enter the name of the deck')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('front')
            .setDescription('Enter the front side of the flashcard')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('back')
            .setDescription('Enter the back side of the flashcard')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all your flashcard decks'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('show')
        .setDescription('Show flashcards in a deck')
        .addStringOption(option =>
          option
            .setName('deck')
            .setDescription('Enter the name of the deck')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete a flashcard deck')
        .addStringOption(option =>
          option
            .setName('deck')
            .setDescription('Enter the name of the deck')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('shuffle')
        .setDescription('Shuffle the flashcards in a deck')
        .addStringOption(option =>
          option
            .setName('deck')
            .setDescription('Enter the name of the deck')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('quiz')
        .setDescription('Take a quiz on a flashcard deck')
        .addStringOption(option =>
          option
            .setName('deck')
            .setDescription('Enter the name of the deck')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('mode')
            .setDescription('Choose a quiz mode')
            .setRequired(true)
            .addChoices(
              { name: 'Multiple Choice', value: 'multiple_choice' },
              { name: 'True/False', value: 'true_false' },
              { name: 'Matching', value: 'matching' },
            ),
        ),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    try {
      const user = await userService.getUser(userId);

      if (!user) {
        await responseHelper.sendErrorMessage(interaction, 'You need to be registered with the bot to use flashcards.');
        return;
      }

      switch (subcommand) {
        case 'create': {
          const deckName = interaction.options.getString('name');
          const subject = interaction.options.getString('subject');

          await flashcardService.createDeck(userId, deckName, subject);
          await responseHelper.sendSuccessMessage(interaction, `Flashcard deck "${deckName}" created successfully!`);
          break;
        }
        case 'add': {
          const deckName = interaction.options.getString('deck');
          const front = interaction.options.getString('front');
          const back = interaction.options.getString('back');

          await flashcardService.addFlashcard(userId, deckName, front, back);
          await responseHelper.sendSuccessMessage(interaction, `Flashcard added to deck "${deckName}" successfully!`);
          break;
        }
        case 'list': {
          const decks = await flashcardService.getDecks(userId);

          if (decks.length > 0) {
            let decksMessage = 'Your flashcard decks:\n\n';

            for (const deck of decks) {
              decksMessage += `- ${deck.name} (${deck.subject})\n`;
            }

            await responseHelper.sendSuccessMessage(interaction, decksMessage);
          } else {
            await responseHelper.sendSuccessMessage(interaction, 'You do not have any flashcard decks yet.');
          }
          break;
        }
        case 'show': {
          const deckName = interaction.options.getString('deck');
          const flashcards = await flashcardService.getFlashcards(userId, deckName);

          if (flashcards.length > 0) {
            let flashcardsMessage = `Flashcards in deck "${deckName}":\n\n`;

            for (const flashcard of flashcards) {
              flashcardsMessage += `Front: ${flashcard.front}\nBack: ${flashcard.back}\n\n`;
            }

            await responseHelper.sendSuccessMessage(interaction, flashcardsMessage);
          } else {
            await responseHelper.sendSuccessMessage(interaction, `No flashcards found in deck "${deckName}".`);
          }
          break;
        }
        case 'delete': {
          const deckName = interaction.options.getString('deck');

          await flashcardService.deleteDeck(userId, deckName);
          await responseHelper.sendSuccessMessage(interaction, `Deck "${deckName}" deleted successfully!`);
          break;
        }
        case 'shuffle': {
          const deckName = interaction.options.getString('deck');

          await flashcardService.shuffleDeck(userId, deckName);
          await responseHelper.sendSuccessMessage(interaction, `Flashcards in deck "${deckName}" shuffled successfully!`);
          break;
        }
        case 'quiz': {
          const deckName = interaction.options.getString('deck');
          const quizMode = interaction.options.getString('mode');

          const quiz = await flashcardService.generateQuiz(userId, deckName, quizMode);

          if (!quiz) {
            await responseHelper.sendErrorMessage(interaction, `No flashcards found in deck "${deckName}".`);
            return;
          }

          let quizMessage = `Quiz on deck "${deckName}":\n\n`;

          for (let i = 0; i < quiz.questions.length; i += 1) {
            quizMessage += `Question ${i + 1}: ${quiz.questions[i].question}\n`;

            if (quizMode === 'multiple_choice') {
              const options = quiz.questions[i].options.sort(() => 0.5 - Math.random());
              for (let j = 0; j < options.length; j += 1) {
                quizMessage += `${constants.letters[j]}. ${options[j]}\n`;
              }
            } else if (quizMode === 'true_false') {
              quizMessage += '1. True\n2. False\n';
            } else if (quizMode === 'matching') {
              quizMessage += `${quiz.questions[i].front} - ?\n`;
            }

            quizMessage += '\n';
          }

          await responseHelper.sendSuccessMessage(interaction, quizMessage);

          const filter = response => response.author.id === userId;

          const collector = interaction.channel.createMessageCollector({ filter, time: 120000 });

          collector.on('collect', async (response) => {
            const answers = response.content.toLowerCase().split('');
            const correctAnswers = quiz.questions.map((question) => {
              if (quizMode === 'multiple_choice') {
                const correctOptionIndex = question.options.indexOf(question.answer);
                return constants.letters[correctOptionIndex];
              } else if (quizMode === 'true_false') {
                return question.answer ? '1' : '2';
              } else if (quizMode === 'matching') {
                return question.answer;
              }
            });

            let score = 0;

            for (let i = 0; i < answers.length; i += 1) {
              if (answers[i] === correctAnswers[i]) {
                score += 1;
              }
            }

            const scorePercentage = (score / quiz.questions.length)  100;
            await responseHelper.sendSuccessMessage(interaction, `You scored ${score} out of ${quiz.questions.length} (${scorePercentage.toFixed(2)}%).`);

            // Update user's streak if they answered at least one question correctly
            if (score > 0) {
              await userService.updateStreak(userId);
            }

            collector.stop();
          });

          collector.on('end', collected => {
            if (collected.size === 0) {
              responseHelper.sendSuccessMessage(interaction, 'Time is up! You did not answer any questions.');
            }
          });
          break;
        }
        default:
          await responseHelper.sendErrorMessage(interaction, 'Invalid flashcard subcommand.');
      }
    } catch (error) {
      console.error(error);
      await responseHelper.sendErrorMessage(interaction, 'An error occurred while managing your flashcards.');
    }
  },
};