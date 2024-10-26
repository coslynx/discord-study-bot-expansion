<template>
  <div class="study-container">
    <h1 class="study-title">Study Session</h1>
    <div v-if="!isStudySessionActive" class="study-options">
      <div class="study-option">
        <label for="timer-duration">Timer Duration (minutes):</label>
        <input type="number" id="timer-duration" v-model.number="timerDuration" min="1" />
      </div>
      <div class="study-option">
        <label for="break-duration">Break Duration (minutes):</label>
        <input type="number" id="break-duration" v-model.number="breakDuration" min="1" />
      </div>
      <button class="study-button" @click="startStudySession">Start Study Session</button>
    </div>
    <div v-else class="study-active">
      <p class="study-timer">{{ formattedTimer }}</p>
      <button class="study-button" @click="stopStudySession">Stop Study Session</button>
    </div>
  </div>
</template>

<script>
import studySessionService from '../services/studySessionService';
import userService from '../services/userService';

export default {
  name: 'Study',
  data() {
    return {
      timerDuration: 25, // Default timer duration (minutes)
      breakDuration: 5, // Default break duration (minutes)
      isStudySessionActive: false,
      timerInterval: null,
      remainingTime: null,
    };
  },
  computed: {
    formattedTimer() {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  mounted() {
    this.fetchStudySession();
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
  },
  methods: {
    async fetchStudySession() {
      try {
        const studySession = await studySessionService.getCurrentStudySession(this.$store.state.user.userId);
        if (studySession) {
          this.isStudySessionActive = true;
          this.timerDuration = studySession.timerDuration;
          this.breakDuration = studySession.breakDuration;
          this.remainingTime = (studySession.timerDuration  60) - (Date.now() - studySession.startTime) / 1000;
          if (this.remainingTime > 0) {
            this.startTimer();
          } else {
            this.stopTimer();
          }
        }
      } catch (error) {
        console.error('Error fetching study session:', error);
        this.$bvToast.toast('Error fetching study session.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async startStudySession() {
      try {
        await studySessionService.startStudySession(this.$store.state.user.userId, this.timerDuration, this.breakDuration);
        this.isStudySessionActive = true;
        this.remainingTime = this.timerDuration  60;
        this.startTimer();
        this.$bvToast.toast(`Study session started! You have ${this.timerDuration} minutes to focus.`, {
          variant: 'success',
          solid: true,
        });
      } catch (error) {
        console.error('Error starting study session:', error);
        this.$bvToast.toast('Error starting study session.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async stopStudySession() {
      try {
        await studySessionService.stopStudySession(this.$store.state.user.userId);
        this.isStudySessionActive = false;
        this.stopTimer();
        this.$bvToast.toast('Study session stopped.', {
          variant: 'success',
          solid: true,
        });
      } catch (error) {
        console.error('Error stopping study session:', error);
        this.$bvToast.toast('Error stopping study session.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.remainingTime -= 1;
        if (this.remainingTime <= 0) {
          this.stopTimer();
          this.$bvToast.toast('Your study session is over! Take a break.', {
            variant: 'success',
            solid: true,
          });
          userService.updateStreak(this.$store.state.user.userId);
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerInterval);
    },
  },
};
</script>

<style scoped>
.study-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.study-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.study-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.study-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.study-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.study-active {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.study-timer {
  font-size: 3rem;
  font-weight: bold;
}
</style>