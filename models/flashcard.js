const { model, Schema } = require('mongoose');
const logger = require('../utils/logger');

const FlashcardSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  deckName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  flashcards: [
    {
      front: {
        type: String,
        required: true,
      },
      back: {
        type: String,
        required: true,
      },
    },
  ],
});

const Flashcard = model('Flashcard', FlashcardSchema);

const flashcardService = {
  async createDeck(userId, deckName, subject) {
    try {
      const existingDeck = await Flashcard.findOne({ userId, deckName }).exec();

      if (existingDeck) {
        return existingDeck;
      }

      const newDeck = new Flashcard({ userId, deckName, subject, flashcards: [] });
      await newDeck.save();
      logger.info(`Flashcard deck created for user ${userId}: ${deckName}`);
      return newDeck;
    } catch (error) {
      logger.error(`Error creating flashcard deck for user ${userId}:`, error);
      throw error;
    }
  },

  async addFlashcard(userId, deckName, front, back) {
    try {
      const deck = await Flashcard.findOne({ userId, deckName }).exec();

      if (!deck) {
        return null;
      }

      deck.flashcards.push({ front, back });
      await deck.save();
      logger.info(`Flashcard added to deck ${deckName} for user ${userId}`);
      return deck;
    } catch (error) {
      logger.error(`Error adding flashcard to deck ${deckName} for user ${userId}:`, error);
      throw error;
    }
  },

  async getDecks(userId) {
    try {
      const decks = await Flashcard.find({ userId }).exec();
      logger.info(`Flashcard decks retrieved for user ${userId}`);
      return decks;
    } catch (error) {
      logger.error(`Error retrieving flashcard decks for user ${userId}:`, error);
      throw error;
    }
  },

  async getFlashcards(userId, deckName) {
    try {
      const deck = await Flashcard.findOne({ userId, deckName }).exec();

      if (!deck) {
        return null;
      }

      logger.info(`Flashcards retrieved for deck ${deckName} for user ${userId}`);
      return deck.flashcards;
    } catch (error) {
      logger.error(`Error retrieving flashcards for deck ${deckName} for user ${userId}:`, error);
      throw error;
    }
  },

  async deleteDeck(userId, deckName) {
    try {
      const deletedDeck = await Flashcard.findOneAndDelete({ userId, deckName }).exec();

      if (!deletedDeck) {
        return null;
      }

      logger.info(`Flashcard deck deleted for user ${userId}: ${deckName}`);
      return deletedDeck;
    } catch (error) {
      logger.error(`Error deleting flashcard deck for user ${userId}:`, error);
      throw error;
    }
  },

  async shuffleDeck(userId, deckName) {
    try {
      const deck = await Flashcard.findOne({ userId, deckName }).exec();

      if (!deck) {
        return null;
      }

      for (let i = deck.flashcards.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random()  (i + 1));
        [deck.flashcards[i], deck.flashcards[j]] = [deck.flashcards[j], deck.flashcards[i]];
      }

      await deck.save();
      logger.info(`Flashcards shuffled in deck ${deckName} for user ${userId}`);
      return deck;
    } catch (error) {
      logger.error(`Error shuffling flashcards in deck ${deckName} for user ${userId}:`, error);
      throw error;
    }
  },

  async generateQuiz(userId, deckName, quizMode) {
    try {
      const deck = await Flashcard.findOne({ userId, deckName }).exec();

      if (!deck || deck.flashcards.length === 0) {
        return null;
      }

      const questions = [];

      for (let i = 0; i < deck.flashcards.length; i += 1) {
        const flashcard = deck.flashcards[i];
        const question = { question: flashcard.front, answer: flashcard.back };

        if (quizMode === 'multiple_choice') {
          // Generate multiple choice options
          // Add logic to create correct and incorrect options
          // Add logic to shuffle options
          // Include multiple-choice-related logic for the quiz
        } else if (quizMode === 'true_false') {
          // Handle true/false questions
          // Include true/false-related logic for the quiz
        } else if (quizMode === 'matching') {
          // Handle matching questions
          // Include matching-related logic for the quiz
        }

        questions.push(question);
      }

      return {
        subject: deck.subject,
        questions,
      };
    } catch (error) {
      logger.error(`Error generating quiz for deck ${deckName} for user ${userId}:`, error);
      throw error;
    }
  },
};

module.exports = flashcardService;