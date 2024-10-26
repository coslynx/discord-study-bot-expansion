<h1 align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
  <br>discord-study-bot-expansion
</h1>
<h4 align="center">A Discord bot to enhance student learning experiences with flashcards, streaks, leaderboards, and more.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<p align="center">
  <img src="https://img.shields.io/badge/Framework-Vue.js-blue" alt="Framework: Vue.js">
  <img src="https://img.shields.io/badge/Frontend-Javascript,_HTML,_CSS-red" alt="Frontend: Javascript, HTML, CSS">
  <img src="https://img.shields.io/badge/Backend-Node.js-blue" alt="Backend: Node.js">
  <img src="https://img.shields.io/badge/Database-MongoDB-green" alt="Database: MongoDB">
</p>
<p align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/discord-study-bot-expansion?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/discord-study-bot-expansion?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/discord-study-bot-expansion?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</p>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
This repository contains the Discord Study Bot, a comprehensive learning companion designed to enhance student experiences within the Discord environment. The bot offers a range of features including flashcard creation, streak tracking, leaderboards, and various study methods, all aimed at improving motivation, engagement, and academic success. 

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| 🧠 | Flashcard System  | Create and manage your own personalized flashcards for various subjects.  Features include multiple quiz modes, deck organization, and sharing with others. |
| 📈 | Streak System     | Track your daily or weekly study activity to maintain consistent learning habits. Earn streaks and rewards for achieving specific milestones.          |
| 🏆 | Leaderboards      | Compete with other students in a friendly and motivating environment. View global and server-specific leaderboards based on study activity points.     |
| 📚 | Study Methods    | Explore a variety of study methods beyond flashcards, including quizzes, spaced repetition, study timers, and integration with external learning resources.  |
| 🎉 | Gamification      | Stay motivated with badges, achievements, points, and challenges designed to make learning more engaging and enjoyable.                       |
| 🎨 | Customizability   | Tailor your learning experience with themes, notification preferences, and study session settings. Create study groups or channels for collaboration. |
| 🌐 | User Interface    | Experience an intuitive and user-friendly interface for seamless Discord interactions with clear commands, menus, and visual elements.              |
| 🔒 | Security        | Secure API connections, authentication protocols, and data encryption ensure the protection of user data and the bot's integrity.             |

## 📂 Structure
The project's file structure is designed to be modular and scalable, promoting maintainability and organization:

```
├── commands
│   ├── flashcard.js
│   ├── streak.js
│   ├── leaderboard.js
│   ├── study.js
│   ├── quiz.js
│   ├── help.js
│   └── settings.js
├── events
│   ├── ready.js
│   ├── messageCreate.js
│   ├── guildCreate.js
│   └── interactionCreate.js
├── services
│   ├── flashcardService.js
│   ├── streakService.js
│   ├── leaderboardService.js
│   ├── userService.js
│   ├── studySessionService.js
│   ├── quizService.js
│   └── settingsService.js
├── models
│   ├── flashcard.js
│   ├── user.js
│   ├── streak.js
│   ├── leaderboard.js
│   ├── studySession.js
│   └── settings.js
├── utils
│   ├── commandHandler.js
│   ├── logger.js
│   ├── errorHandler.js
│   ├── responseHelper.js
│   └── constants.js
├── config
│   ├── env.config.js
│   └── database.config.js
├── routes
│   ├── api.js
│   └── web.js
├── middleware
│   ├── authentication.js
│   ├── authorization.js
│   └── errorHandling.js
├── .env
├── package.json
├── README.md
└── src
    ├── main.js
    ├── components
    │   ├── Flashcard.vue
    │   ├── Streak.vue
    │   ├── Leaderboard.vue
    │   ├── Study.vue
    │   ├── Quiz.vue
    │   ├── Settings.vue
    │   ├── Header.vue
    │   └── Footer.vue
    ├── router.js
    ├── store.js
    ├── styles
    │   ├── main.css
    │   └── tailwind.css
    └── public
        ├── index.html
        └── favicon.ico
```

## 💻 Installation
### 🔧 Prerequisites
- Node.js
- npm
- MongoDB

### 🚀 Setup Instructions
1. Clone the repository:
   - `git clone https://github.com/coslynx/discord-study-bot-expansion.git`
2. Navigate to the project directory:
   - `cd discord-study-bot-expansion`
3. Install dependencies:
   - `npm install`
4. Configure environment variables in `.env`:
   - `DISCORD_TOKEN=your_discord_bot_token`
   - `MONGODB_URI=your_mongodb_connection_string`
5. Start the development server:
   - `npm run dev`

## 🏗️ Usage
To use the Discord Study Bot, simply add it to your Discord server and start using the commands. Here are some examples:

- `/flashcard create`: Create a new flashcard deck.
- `/flashcard add`: Add flashcards to a deck.
- `/streak show`: View your current streak.
- `/leaderboard global`: View the global leaderboard.
- `/study start`: Start a timed study session.

## 🌐 Hosting
### 🚀 Deployment Instructions
1. Build the project:
   - `npm run build`
2. Deploy the built application to a hosting service like Heroku or AWS.

## 📄 License
This project is licensed under the MIT License.

## 👏 Authors
- Author Name - [Spectra.codes](https://spectra.codes)
- Creator Name - [DRIX10](https://github.com/Drix10)

<p align="center">
    <h1 align="center">🌐 Spectra.Codes</h1>
  </p>
  <p align="center">
    <em>Why only generate Code? When you can generate the whole Repository!</em>
  </p>
  <p align="center">
	<img src="https://img.shields.io/badge/Developer-Drix10-red" alt="">
	<img src="https://img.shields.io/badge/Website-Spectra.codes-blue" alt="">
	<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
	<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4-black" alt="">
  <p>