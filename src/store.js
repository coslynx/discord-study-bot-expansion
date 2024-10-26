import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import flashcardService from '../services/flashcardService';
import userService from '../services/userService';
import streakService from '../services/streakService';
import leaderboardService from '../services/leaderboardService';
import studySessionService from '../services/studySessionService';
import quizService from '../services/quizService';
import settingsService from '../services/settingsService';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    flashcards: [],
    decks: [],
    streak: null,
    streakHistory: [],
    leaderboard: [],
    studySession: null,
    quiz: null,
    settings: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setFlashcards(state, flashcards) {
      state.flashcards = flashcards;
    },
    setDecks(state, decks) {
      state.decks = decks;
    },
    setStreak(state, streak) {
      state.streak = streak;
    },
    setStreakHistory(state, streakHistory) {
      state.streakHistory = streakHistory;
    },
    setLeaderboard(state, leaderboard) {
      state.leaderboard = leaderboard;
    },
    setStudySession(state, studySession) {
      state.studySession = studySession;
    },
    setQuiz(state, quiz) {
      state.quiz = quiz;
    },
    setSettings(state, settings) {
      state.settings = settings;
    },
  },
  actions: {
    async fetchUser({ commit }, userId) {
      try {
        const user = await userService.getUser(userId);
        commit('setUser', user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    async fetchFlashcards({ commit }, { userId, deckName }) {
      try {
        const flashcards = await flashcardService.getFlashcards(userId, deckName);
        commit('setFlashcards', flashcards);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    },
    async fetchDecks({ commit }, userId) {
      try {
        const decks = await flashcardService.getDecks(userId);
        commit('setDecks', decks);
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    },
    async fetchStreak({ commit }, userId) {
      try {
        const streak = await streakService.getCurrentStreak(userId);
        commit('setStreak', streak);
      } catch (error) {
        console.error('Error fetching streak:', error);
      }
    },
    async fetchStreakHistory({ commit }, userId) {
      try {
        const streakHistory = await streakService.getStreakHistory(userId);
        commit('setStreakHistory', streakHistory);
      } catch (error) {
        console.error('Error fetching streak history:', error);
      }
    },
    async fetchLeaderboard({ commit }, guildId) {
      try {
        const leaderboard = await leaderboardService.getServerLeaderboard(guildId);
        commit('setLeaderboard', leaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    },
    async fetchGlobalLeaderboard({ commit }) {
      try {
        const leaderboard = await leaderboardService.getGlobalLeaderboard();
        commit('setLeaderboard', leaderboard);
      } catch (error) {
        console.error('Error fetching global leaderboard:', error);
      }
    },
    async fetchStudySession({ commit }, userId) {
      try {
        const studySession = await studySessionService.getCurrentStudySession(userId);
        commit('setStudySession', studySession);
      } catch (error) {
        console.error('Error fetching study session:', error);
      }
    },
    async fetchQuiz({ commit }, { subject, numQuestions }) {
      try {
        const quiz = await quizService.generateQuiz(subject, numQuestions);
        commit('setQuiz', quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    },
    async fetchSettings({ commit }, userId) {
      try {
        const settings = await settingsService.getSettings(userId);
        commit('setSettings', settings);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    },
  },
  modules: {},
  plugins: [
    createPersistedState({
      key: 'discord-study-bot-expansion',
      storage: localStorage,
    }),
  ],
});

export default store;