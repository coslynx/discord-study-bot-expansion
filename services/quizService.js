const { model, Schema } = require('mongoose');
const logger = require('../utils/logger');
const constants = require('../utils/constants');

const QuizSchema = new Schema({
  subject: {
    type: String,
    enum: constants.subjects,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

const Quiz = model('Quiz', QuizSchema);

const quizService = {
  async generateQuiz(subject, numQuestions) {
    try {
      const existingQuiz = await Quiz.findOne({ subject }).exec();

      if (existingQuiz) {
        const questions = existingQuiz.questions.slice(0, numQuestions); // Get the first 'numQuestions' questions
        return {
          subject,
          questions,
        };
      }

      // If no existing quiz, generate a new one (implement logic to create new quizzes)
      // Example:
      // const questions = [];
      // for (let i = 0; i < numQuestions; i++) {
      //   // Generate a new quiz question (replace with actual logic)
      //   const question = { question: 'Sample question', options: ['Option 1', 'Option 2'], answer: 'Option 2' };
      //   questions.push(question);
      // }

      // const newQuiz = new Quiz({ subject, questions });
      // await newQuiz.save();
      // return newQuiz;
    } catch (error) {
      logger.error(`Error generating quiz for subject ${subject}:`, error);
      throw error;
    }
  },
};

module.exports = quizService;