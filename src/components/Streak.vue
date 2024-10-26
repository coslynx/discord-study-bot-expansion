<template>
  <div class="streak-container">
    <h1 class="streak-title">Streak</h1>
    <div v-if="!showHistory" class="streak-info">
      <p v-if="streak" class="streak-current">
        Your current streak is {{ streak.days }} days!
      </p>
      <p v-else class="streak-current">You do not have an active streak yet.</p>
      <b-button variant="primary" @click="showHistory = true">View History</b-button>
    </div>
    <div v-else class="streak-history">
      <b-table
        :items="streakHistory"
        :fields="fields"
        :striped="true"
        :bordered="true"
        :small="true"
      >
        <template #cell(startDate)="data">
          {{ new Date(data.item.startDate).toLocaleDateString() }}
        </template>
        <template #cell(endDate)="data">
          {{ data.item.endDate ? new Date(data.item.endDate).toLocaleDateString() : 'Active' }}
        </template>
        <template #cell(days)="data">
          {{ data.item.days }}
        </template>
      </b-table>
      <b-button variant="secondary" @click="showHistory = false">Back</b-button>
    </div>
  </div>
</template>

<script>
import streakService from '../services/streakService';

export default {
  name: 'Streak',
  data() {
    return {
      streak: null,
      streakHistory: [],
      showHistory: false,
      fields: [
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'days', label: 'Days' },
      ],
    };
  },
  mounted() {
    this.fetchStreak();
  },
  methods: {
    async fetchStreak() {
      try {
        this.streak = await streakService.getCurrentStreak(this.$store.state.user.userId);
        this.streakHistory = await streakService.getStreakHistory(this.$store.state.user.userId);
      } catch (error) {
        console.error('Error fetching streak:', error);
        this.$bvToast.toast('Error fetching streak.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
  },
};
</script>

<style scoped>
.streak-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.streak-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.streak-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.streak-current {
  font-size: 1.5rem;
}

.streak-history {
  margin-top: 2rem;
}
</style>