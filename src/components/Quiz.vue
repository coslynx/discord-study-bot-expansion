<template>
  <div class="quiz-container">
    <h1 class="quiz-title">Quiz</h1>
    <div class="quiz-info">
      <p>Subject: {{ quiz.subject }}</p>
      <p>Number of questions: {{ quiz.questions.length }}</p>
    </div>
    <div v-if="!showResults" class="quiz-questions">
      <div v-for="(question, index) in quiz.questions" :key="index" class="quiz-question">
        <p class="question-text">{{ question.question }}</p>
        <div v-if="question.mode === 'multiple_choice'" class="options">
          <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="option">
            <input type="radio" :id="'option-' + optionIndex" :value="option" v-model="selectedAnswers[index]">
            <label :for="'option-' + optionIndex">{{ option }}</label>
          </div>
        </div>
        <div v-if="question.mode === 'true_false'" class="options">
          <div class="option">
            <input type="radio" :id="'option-true-' + index" value="true" v-model="selectedAnswers[index]">
            <label :for="'option-true-' + index">True</label>
          </div>
          <div class="option">
            <input type="radio" :id="'option-false-' + index" value="false" v-model="selectedAnswers[index]">
            <label :for="'option-false-' + index">False</label>
          </div>
        </div>
        <div v-if="question.mode === 'matching'" class="options">
          <div v-for="(match, matchIndex) in question.matches" :key="matchIndex" class="matching-pair">
            <span class="match-item">{{ match.front }}</span>
            <select v-model="selectedAnswers[index][matchIndex]">
              <option value="">Choose an option</option>
              <option v-for="(matchOption, optionIndex) in match.options" :key="optionIndex" :value="optionIndex">
                {{ matchOption }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <button class="quiz-button" @click="submitQuiz">Submit Quiz</button>
    </div>
    <div v-if="showResults" class="quiz-results">
      <p>Your score: {{ score }} / {{ quiz.questions.length }}</p>
      <p>Percentage: {{ scorePercentage.toFixed(2) }}%</p>
      <button class="quiz-button" @click="restartQuiz">Restart Quiz</button>
    </div>
  </div>
</template>

<script>
import quizService from '../services/quizService';
import userService from '../services/userService';

export default {
  name: 'Quiz',
  data() {
    return {
      quiz: null,
      selectedAnswers: [],
      showResults: false,
      score: 0,
      scorePercentage: 0,
    };
  },
  mounted() {
    this.fetchQuiz();
  },
  methods: {
    async fetchQuiz() {
      try {
        const subject = this.$route.params.subject;
        const numQuestions = this.$route.query.questions || 10;
        this.quiz = await quizService.generateQuiz(subject, numQuestions);
        this.selectedAnswers = new Array(this.quiz.questions.length).fill(null).map(() => {
          if (this.quiz.mode === 'matching') {
            return new Array(this.quiz.questions.length).fill(null);
          }
          return null;
        });
      } catch (error) {
        console.error('Error fetching quiz:', error);
        this.$bvToast.toast('Error fetching quiz.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    submitQuiz() {
      let correctAnswers = 0;
      this.quiz.questions.forEach((question, index) => {
        if (question.mode === 'multiple_choice') {
          if (this.selectedAnswers[index] === question.answer) {
            correctAnswers += 1;
          }
        } else if (question.mode === 'true_false') {
          if (this.selectedAnswers[index] === question.answer) {
            correctAnswers += 1;
          }
        } else if (question.mode === 'matching') {
          let allMatchesCorrect = true;
          this.selectedAnswers[index].forEach((selectedMatch, matchIndex) => {
            if (selectedMatch !== question.matches[matchIndex].options.indexOf(question.matches[matchIndex].answer)) {
              allMatchesCorrect = false;
            }
          });
          if (allMatchesCorrect) {
            correctAnswers += 1;
          }
        }
      });
      this.score = correctAnswers;
      this.scorePercentage = (this.score / this.quiz.questions.length)  100;
      this.showResults = true;
      userService.updateStreak(this.$store.state.user.userId);
    },
    restartQuiz() {
      this.showResults = false;
      this.score = 0;
      this.scorePercentage = 0;
      this.selectedAnswers = new Array(this.quiz.questions.length).fill(null).map(() => {
        if (this.quiz.mode === 'matching') {
          return new Array(this.quiz.questions.length).fill(null);
        }
        return null;
      });
    },
  },
};
</script>

<style scoped>
.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.quiz-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.quiz-info {
  margin-bottom: 2rem;
}

.quiz-questions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.quiz-question {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 5px;
}

.question-text {
  font-weight: bold;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.matching-pair {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quiz-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.quiz-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  text-align: center;
}
</style>