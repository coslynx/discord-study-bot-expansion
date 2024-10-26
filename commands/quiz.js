const { SlashCommandBuilder } = require('discord.js');
const quizService = require('../services/quizService');
const userService = require('../services/userService');
const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Take a quiz on a specific subject')
    .addStringOption(option =>
      option
        .setName('subject')
        .setDescription('Choose a subject')
        .setRequired(true)
        .addChoices(
          { name: 'Mathematics', value: 'mathematics' },
          { name: 'Biology', value: 'biology' },
          // Add more subject choices as needed
        ),
    )
    .addIntegerOption(option =>
      option
        .setName('questions')
        .setDescription('Set the number of questions')
        .setRequired(true)
        .setMinValue(1),
    ),
  async execute(interaction) {
    const subject = interaction.options.getString('subject');
    const numQuestions = interaction.options.getInteger('questions');
    const userId = interaction.user.id;

    try {
      const user = await userService.getUser(userId);

      if (!user) {
        await responseHelper.sendErrorMessage(interaction, 'You need to be registered with the bot to take a quiz.');
        return;
      }

      const quiz = await quizService.generateQuiz(subject, numQuestions);

      if (!quiz) {
        await responseHelper.sendErrorMessage(interaction, `No quizzes available for ${subject}.`);
        return;
      }

      let quizMessage = `Quiz on ${subject}:\n\n`;

      for (let i = 0; i < quiz.questions.length; i += 1) {
        quizMessage += `Question ${i + 1}: ${quiz.questions[i].question}\n`;

        for (let j = 0; j < quiz.questions[i].options.length; j += 1) {
          quizMessage += `${constants.letters[j]}. ${quiz.questions[i].options[j]}\n`;
        }

        quizMessage += '\n';
      }

      await responseHelper.sendSuccessMessage(interaction, quizMessage);

      const filter = response => response.author.id === userId;

      const collector = interaction.channel.createMessageCollector({ filter, time: 120000 });

      collector.on('collect', async (response) => {
        const answers = response.content.toLowerCase().split('');
        const correctAnswers = quiz.questions.map((question) => {
          const correctOptionIndex = question.options.indexOf(question.answer);
          return constants.letters[correctOptionIndex];
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
    } catch (error) {
      console.error(error);
      await responseHelper.sendErrorMessage(interaction, 'An error occurred while generating the quiz.');
    }
  },
};