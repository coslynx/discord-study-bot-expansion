const express = require('express');
const router = express.Router();
const flashcardService = require('../services/flashcardService');
const userService = require('../services/userService');
const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

// GET /flashcards/:deckName
router.get('/flashcards/:deckName', async (req, res) => {
  const { deckName } = req.params;
  const userId = req.user.id;

  try {
    const flashcards = await flashcardService.getFlashcards(userId, deckName);

    if (!flashcards) {
      return responseHelper.sendErrorMessage(res, `No flashcards found in deck "${deckName}"`);
    }

    return responseHelper.sendSuccessMessage(res, flashcards);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while retrieving flashcards.');
  }
});

// POST /flashcards/:deckName
router.post('/flashcards/:deckName', async (req, res) => {
  const { deckName } = req.params;
  const userId = req.user.id;
  const { front, back } = req.body;

  try {
    const deck = await flashcardService.addFlashcard(userId, deckName, front, back);

    if (!deck) {
      return responseHelper.sendErrorMessage(res, `Deck "${deckName}" not found.`);
    }

    return responseHelper.sendSuccessMessage(res, `Flashcard added to deck "${deckName}" successfully!`);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while adding a flashcard.');
  }
});

// DELETE /flashcards/:deckName
router.delete('/flashcards/:deckName', async (req, res) => {
  const { deckName } = req.params;
  const userId = req.user.id;

  try {
    const deletedDeck = await flashcardService.deleteDeck(userId, deckName);

    if (!deletedDeck) {
      return responseHelper.sendErrorMessage(res, `Deck "${deckName}" not found.`);
    }

    return responseHelper.sendSuccessMessage(res, `Deck "${deckName}" deleted successfully!`);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while deleting a flashcard deck.');
  }
});

// GET /flashcards
router.get('/flashcards', async (req, res) => {
  const userId = req.user.id;

  try {
    const decks = await flashcardService.getDecks(userId);

    if (!decks) {
      return responseHelper.sendErrorMessage(res, 'No flashcard decks found.');
    }

    return responseHelper.sendSuccessMessage(res, decks);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while retrieving flashcard decks.');
  }
});

// POST /flashcards
router.post('/flashcards', async (req, res) => {
  const userId = req.user.id;
  const { name, subject } = req.body;

  try {
    const deck = await flashcardService.createDeck(userId, name, subject);

    return responseHelper.sendSuccessMessage(res, `Flashcard deck "${name}" created successfully!`);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while creating a flashcard deck.');
  }
});

// GET /quizzes/:subject
router.get('/quizzes/:subject', async (req, res) => {
  const { subject } = req.params;
  const userId = req.user.id;
  const { numQuestions = 10 } = req.query;

  try {
    const user = await userService.getUser(userId);

    if (!user) {
      return responseHelper.sendErrorMessage(res, 'You need to be registered with the bot to take a quiz.');
    }

    const quiz = await flashcardService.generateQuiz(userId, subject, numQuestions);

    if (!quiz) {
      return responseHelper.sendErrorMessage(res, `No quizzes available for ${subject}.`);
    }

    return responseHelper.sendSuccessMessage(res, quiz);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while generating the quiz.');
  }
});

// GET /streaks/:userId
router.get('/streaks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const streak = await flashcardService.getCurrentStreak(userId);

    if (!streak) {
      return responseHelper.sendErrorMessage(res, 'No active streak found for this user.');
    }

    return responseHelper.sendSuccessMessage(res, streak);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while retrieving the streak.');
  }
});

// GET /streaks/:userId/history
router.get('/streaks/:userId/history', async (req, res) => {
  const { userId } = req.params;

  try {
    const streakHistory = await flashcardService.getStreakHistory(userId);

    if (!streakHistory) {
      return responseHelper.sendErrorMessage(res, 'No streak history found for this user.');
    }

    return responseHelper.sendSuccessMessage(res, streakHistory);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while retrieving the streak history.');
  }
});

// POST /streaks/:userId
router.post('/streaks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await flashcardService.updateStreak(userId);

    return responseHelper.sendSuccessMessage(res, 'Streak updated successfully!');
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while updating the streak.');
  }
});

// GET /leaderboards/global
router.get('/leaderboards/global', async (req, res) => {
  try {
    const leaderboard = await flashcardService.getGlobalLeaderboard();

    if (!leaderboard) {
      return responseHelper.sendErrorMessage(res, 'No global leaderboard data found.');
    }

    return responseHelper.sendSuccessMessage(res, leaderboard);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while retrieving the global leaderboard.');
  }
});

// GET /leaderboards/:guildId
router.get('/leaderboards/:guildId', async (req, res) => {
  const { guildId } = req.params;

  try {
    const leaderboard = await flashcardService.getServerLeaderboard(guildId);

    if (!leaderboard) {
      return responseHelper.sendErrorMessage(res, 'No server leaderboard data found.');
    }

    return responseHelper.sendSuccessMessage(res, leaderboard);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while retrieving the server leaderboard.');
  }
});

// POST /leaderboards/:guildId
router.post('/leaderboards/:guildId', async (req, res) => {
  const { guildId } = req.params;
  const { userId, studyActivityPoints } = req.body;

  try {
    const leaderboard = await flashcardService.updateLeaderboardEntry(guildId, userId, studyActivityPoints);

    return responseHelper.sendSuccessMessage(res, 'Leaderboard entry updated successfully!');
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while updating the leaderboard entry.');
  }
});

// GET /users/:userId/settings
router.get('/users/:userId/settings', async (req, res) => {
  const { userId } = req.params;

  try {
    const settings = await flashcardService.getSettings(userId);

    if (!settings) {
      return responseHelper.sendErrorMessage(res, 'No settings found for this user.');
    }

    return responseHelper.sendSuccessMessage(res, settings);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while retrieving the user settings.');
  }
});

// POST /users/:userId/settings
router.post('/users/:userId/settings', async (req, res) => {
  const { userId } = req.params;
  const { theme, streakReminder, quizReminder, timerDuration, breakDuration } = req.body;

  try {
    const settings = await flashcardService.updateSettings(userId, { theme, streakReminder, quizReminder, timerDuration, breakDuration });

    return responseHelper.sendSuccessMessage(res, 'User settings updated successfully!');
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while updating the user settings.');
  }
});

// GET /users/:userId
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userService.getUser(userId);

    if (!user) {
      return responseHelper.sendErrorMessage(res, 'User not found.');
    }

    return responseHelper.sendSuccessMessage(res, user);
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while retrieving the user.');
  }
});

// POST /users
router.post('/users', async (req, res) => {
  const { userId, username } = req.body;

  try {
    const user = await userService.createUser(userId, username);

    return responseHelper.sendSuccessMessage(res, 'User created successfully!');
  } catch (error) {
    console.error(error);
    return responseHelper.sendErrorMessage(res, 'An error occurred while creating the user.');
  }
});

module.exports = router;