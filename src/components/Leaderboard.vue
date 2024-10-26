<template>
  <div class="leaderboard-container">
    <h1 class="leaderboard-title">Leaderboard</h1>
    <div class="leaderboard-tabs">
      <b-button
        v-for="(tab, index) in tabs"
        :key="index"
        :variant="activeTab === index ? 'primary' : 'outline-primary'"
        @click="activeTab = index"
      >
        {{ tab.name }}
      </b-button>
    </div>
    <div class="leaderboard-table">
      <b-table
        :items="leaderboardData"
        :fields="fields"
        :striped="true"
        :bordered="true"
        :small="true"
      >
        <template #cell(rank)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(username)="data">
          {{ data.item.username }}
        </template>
        <template #cell(studyActivityPoints)="data">
          {{ data.item.studyActivityPoints }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import leaderboardService from '../services/leaderboardService';

export default {
  name: 'Leaderboard',
  data() {
    return {
      tabs: [
        { name: 'Global' },
        { name: 'Server' },
      ],
      activeTab: 0,
      leaderboardData: [],
      fields: [
        { key: 'rank', label: 'Rank' },
        { key: 'username', label: 'Username' },
        { key: 'studyActivityPoints', label: 'Study Activity Points' },
      ],
    };
  },
  mounted() {
    this.fetchLeaderboard();
  },
  methods: {
    async fetchLeaderboard() {
      try {
        if (this.activeTab === 0) {
          this.leaderboardData = await leaderboardService.getGlobalLeaderboard();
        } else {
          this.leaderboardData = await leaderboardService.getServerLeaderboard(this.$store.state.user.guildId);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        this.$bvToast.toast('Error fetching leaderboard.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
  },
  watch: {
    activeTab: {
      handler: 'fetchLeaderboard',
      immediate: true,
    },
  },
};
</script>

<style scoped>
.leaderboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.leaderboard-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.leaderboard-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.leaderboard-table {
  width: 100%;
}
</style>