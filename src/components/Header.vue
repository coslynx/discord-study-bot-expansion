<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="#">Discord Study Bot</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/flashcards">Flashcards</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/streak">Streak</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/leaderboard">Leaderboard</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/study">Study</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/quiz">Quiz</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/settings">Settings</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>