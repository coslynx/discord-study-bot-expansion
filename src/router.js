import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import Flashcards from '../views/Flashcards.vue';
import Streak from '../views/Streak.vue';
import Leaderboard from '../views/Leaderboard.vue';
import Study from '../views/Study.vue';
import Quiz from '../views/Quiz.vue';
import Settings from '../views/Settings.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/flashcards',
      name: 'Flashcards',
      component: Flashcards,
    },
    {
      path: '/streak',
      name: 'Streak',
      component: Streak,
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard,
    },
    {
      path: '/study',
      name: 'Study',
      component: Study,
    },
    {
      path: '/quiz',
      name: 'Quiz',
      component: Quiz,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
});