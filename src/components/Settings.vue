<template>
  <div class="settings-container">
    <h1 class="settings-title">Settings</h1>
    <div class="settings-section">
      <h2>Theme</h2>
      <div class="settings-option">
        <label for="theme">Choose a theme:</label>
        <select id="theme" v-model="selectedTheme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button class="settings-button" @click="updateTheme">Save Theme</button>
    </div>
    <div class="settings-section">
      <h2>Notifications</h2>
      <div class="settings-option">
        <label for="streak_reminder">Streak Reminders:</label>
        <input type="checkbox" id="streak_reminder" v-model="streakReminder" />
      </div>
      <div class="settings-option">
        <label for="quiz_reminder">Quiz Reminders:</label>
        <input type="checkbox" id="quiz_reminder" v-model="quizReminder" />
      </div>
      <button class="settings-button" @click="updateNotifications">Save Notifications</button>
    </div>
    <div class="settings-section">
      <h2>Study Session</h2>
      <div class="settings-option">
        <label for="timer_duration">Timer Duration (minutes):</label>
        <input type="number" id="timer_duration" v-model.number="timerDuration" min="1" />
      </div>
      <div class="settings-option">
        <label for="break_duration">Break Duration (minutes):</label>
        <input type="number" id="break_duration" v-model.number="breakDuration" min="1" />
      </div>
      <button class="settings-button" @click="updateStudySession">Save Study Session Settings</button>
    </div>
  </div>
</template>

<script>
import settingsService from '../services/settingsService';

export default {
  name: 'Settings',
  data() {
    return {
      selectedTheme: this.$store.state.settings.theme,
      streakReminder: this.$store.state.settings.streakReminder,
      quizReminder: this.$store.state.settings.quizReminder,
      timerDuration: this.$store.state.settings.timerDuration,
      breakDuration: this.$store.state.settings.breakDuration,
    };
  },
  methods: {
    async updateTheme() {
      try {
        await settingsService.updateSettings(this.$store.state.user.userId, { theme: this.selectedTheme });
        this.$store.dispatch('fetchSettings', this.$store.state.user.userId);
        this.$bvToast.toast('Theme updated successfully!', {
          variant: 'success',
          solid: true,
        });
      } catch (error) {
        console.error('Error updating theme:', error);
        this.$bvToast.toast('Error updating theme.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async updateNotifications() {
      try {
        await settingsService.updateSettings(this.$store.state.user.userId, {
          streakReminder: this.streakReminder,
          quizReminder: this.quizReminder,
        });
        this.$store.dispatch('fetchSettings', this.$store.state.user.userId);
        this.$bvToast.toast('Notification preferences updated successfully!', {
          variant: 'success',
          solid: true,
        });
      } catch (error) {
        console.error('Error updating notifications:', error);
        this.$bvToast.toast('Error updating notifications.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async updateStudySession() {
      try {
        await settingsService.updateSettings(this.$store.state.user.userId, {
          timerDuration: this.timerDuration,
          breakDuration: this.breakDuration,
        });
        this.$store.dispatch('fetchSettings', this.$store.state.user.userId);
        this.$bvToast.toast('Study session settings updated successfully!', {
          variant: 'success',
          solid: true,
        });
      } catch (error) {
        console.error('Error updating study session settings:', error);
        this.$bvToast.toast('Error updating study session settings.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
  },
};
</script>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.settings-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.settings-section {
  margin-bottom: 2rem;
  width: 100%;
}

.settings-option {
  margin-bottom: 1rem;
}

.settings-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>