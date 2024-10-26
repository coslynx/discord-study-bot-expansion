<template>
  <div class="flashcard-container">
    <h1 class="flashcard-title">Flashcards</h1>
    <div class="flashcard-tabs">
      <b-button
        v-for="(tab, index) in tabs"
        :key="index"
        :variant="activeTab === index ? 'primary' : 'outline-primary'"
        @click="activeTab = index"
      >
        {{ tab.name }}
      </b-button>
    </div>
    <div v-if="activeTab === 0" class="flashcard-decks">
      <div v-for="(deck, index) in decks" :key="index" class="flashcard-deck">
        <h2 class="deck-title">{{ deck.name }}</h2>
        <p class="deck-subject">Subject: {{ deck.subject }}</p>
        <div class="deck-actions">
          <b-button
            variant="outline-primary"
            @click="showDeckFlashcards(deck.name)"
          >
            Show Flashcards
          </b-button>
          <b-button variant="danger" @click="deleteDeck(deck.name)">
            Delete Deck
          </b-button>
          <b-button variant="warning" @click="shuffleDeck(deck.name)">
            Shuffle Deck
          </b-button>
        </div>
      </div>
      <div v-if="decks.length === 0" class="no-decks-message">
        You do not have any flashcard decks yet.
      </div>
      <div v-if="showCreateDeckForm" class="create-deck-form">
        <b-form @submit.prevent="createDeck">
          <b-form-group id="deck-name" label="Deck Name:" label-for="deck-name-input">
            <b-form-input id="deck-name-input" v-model="deckName" required />
          </b-form-group>
          <b-form-group id="deck-subject" label="Subject:" label-for="deck-subject-input">
            <b-form-input id="deck-subject-input" v-model="deckSubject" required />
          </b-form-group>
          <b-button type="submit" variant="primary">Create Deck</b-button>
          <b-button variant="secondary" @click="showCreateDeckForm = false">
            Cancel
          </b-button>
        </b-form>
      </div>
      <b-button variant="success" @click="showCreateDeckForm = true">
        Create New Deck
      </b-button>
    </div>
    <div v-if="activeTab === 1" class="flashcard-add">
      <div v-if="!showAddFlashcardForm" class="add-flashcard-info">
        <p>Select a deck to add flashcards to:</p>
        <b-form-select v-model="selectedDeck" :options="deckOptions" />
        <b-button variant="primary" @click="showAddFlashcardForm = true">
          Add Flashcards
        </b-button>
      </div>
      <div v-if="showAddFlashcardForm" class="add-flashcard-form">
        <b-form @submit.prevent="addFlashcard">
          <b-form-group id="flashcard-front" label="Front:" label-for="flashcard-front-input">
            <b-form-input id="flashcard-front-input" v-model="flashcardFront" required />
          </b-form-group>
          <b-form-group id="flashcard-back" label="Back:" label-for="flashcard-back-input">
            <b-form-input id="flashcard-back-input" v-model="flashcardBack" required />
          </b-form-group>
          <b-button type="submit" variant="primary">Add Flashcard</b-button>
          <b-button variant="secondary" @click="showAddFlashcardForm = false">
            Cancel
          </b-button>
        </b-form>
      </div>
    </div>
    <div v-if="activeTab === 2" class="flashcard-view">
      <div v-if="!showFlashcard" class="view-flashcard-info">
        <p>Select a deck to view flashcards:</p>
        <b-form-select v-model="selectedDeck" :options="deckOptions" />
        <b-button variant="primary" @click="showFlashcard = true">
          View Flashcards
        </b-button>
      </div>
      <div v-if="showFlashcard" class="flashcard-content">
        <div v-if="flashcards.length > 0" class="flashcards">
          <div v-for="(flashcard, index) in flashcards" :key="index" class="flashcard">
            <div class="flashcard-front">{{ flashcard.front }}</div>
            <div class="flashcard-back">{{ flashcard.back }}</div>
          </div>
        </div>
        <div v-else class="no-flashcards-message">
          No flashcards found in this deck.
        </div>
        <b-button variant="secondary" @click="showFlashcard = false">
          Back
        </b-button>
      </div>
    </div>
    <div v-if="activeTab === 3" class="flashcard-quiz">
      <div v-if="!showQuizForm" class="quiz-info">
        <p>Select a deck to take a quiz:</p>
        <b-form-select v-model="selectedDeck" :options="deckOptions" />
        <b-button variant="primary" @click="showQuizForm = true">
          Take Quiz
        </b-button>
      </div>
      <div v-if="showQuizForm" class="quiz-form">
        <b-form @submit.prevent="startQuiz">
          <b-form-group id="quiz-mode" label="Quiz Mode:" label-for="quiz-mode-select">
            <b-form-select id="quiz-mode-select" v-model="quizMode" :options="quizModeOptions" required />
          </b-form-group>
          <b-button type="submit" variant="primary">Start Quiz</b-button>
          <b-button variant="secondary" @click="showQuizForm = false">
            Cancel
          </b-button>
        </b-form>
      </div>
      <div v-if="showQuiz" class="quiz-content">
        <div v-if="!showQuizResults" class="quiz-questions">
          <div v-for="(question, index) in quiz.questions" :key="index" class="quiz-question">
            <p class="question-text">{{ question.question }}</p>
            <div v-if="quizMode === 'multiple_choice'" class="options">
              <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="option">
                <input type="radio" :id="'option-' + optionIndex" :value="option" v-model="selectedAnswers[index]">
                <label :for="'option-' + optionIndex">{{ option }}</label>
              </div>
            </div>
            <div v-if="quizMode === 'true_false'" class="options">
              <div class="option">
                <input type="radio" :id="'option-true-' + index" value="true" v-model="selectedAnswers[index]">
                <label :for="'option-true-' + index">True</label>
              </div>
              <div class="option">
                <input type="radio" :id="'option-false-' + index" value="false" v-model="selectedAnswers[index]">
                <label :for="'option-false-' + index">False</label>
              </div>
            </div>
            <div v-if="quizMode === 'matching'" class="options">
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
          <b-button variant="primary" @click="submitQuiz">Submit Quiz</b-button>
        </div>
        <div v-if="showQuizResults" class="quiz-results">
          <p>Your score: {{ score }} / {{ quiz.questions.length }}</p>
          <p>Percentage: {{ scorePercentage.toFixed(2) }}%</p>
          <b-button variant="secondary" @click="showQuiz = false">
            Back
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flashcardService from '../services/flashcardService';

export default {
  name: 'Flashcard',
  data() {
    return {
      tabs: [
        { name: 'Decks' },
        { name: 'Add Flashcards' },
        { name: 'View Flashcards' },
        { name: 'Take Quiz' },
      ],
      activeTab: 0,
      decks: [],
      deckName: '',
      deckSubject: '',
      showCreateDeckForm: false,
      flashcards: [],
      selectedDeck: null,
      showAddFlashcardForm: false,
      flashcardFront: '',
      flashcardBack: '',
      showFlashcard: false,
      quizMode: 'multiple_choice',
      quizModeOptions: [
        { value: 'multiple_choice', text: 'Multiple Choice' },
        { value: 'true_false', text: 'True/False' },
        { value: 'matching', text: 'Matching' },
      ],
      showQuizForm: false,
      quiz: null,
      selectedAnswers: [],
      showQuiz: false,
      showQuizResults: false,
      score: 0,
      scorePercentage: 0,
    };
  },
  computed: {
    deckOptions() {
      return this.decks.map(deck => ({
        value: deck.name,
        text: deck.name,
      }));
    },
  },
  mounted() {
    this.fetchDecks();
  },
  methods: {
    async fetchDecks() {
      try {
        this.decks = await flashcardService.getDecks(this.$store.state.user.userId);
      } catch (error) {
        console.error('Error fetching decks:', error);
        this.$bvToast.toast('Error fetching decks.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async createDeck() {
      try {
        await flashcardService.createDeck(this.$store.state.user.userId, this.deckName, this.deckSubject);
        this.$bvToast.toast(`Flashcard deck "${this.deckName}" created successfully!`, {
          variant: 'success',
          solid: true,
        });
        this.deckName = '';
        this.deckSubject = '';
        this.showCreateDeckForm = false;
        this.fetchDecks();
      } catch (error) {
        console.error('Error creating deck:', error);
        this.$bvToast.toast('Error creating deck.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async showDeckFlashcards(deckName) {
      try {
        this.flashcards = await flashcardService.getFlashcards(this.$store.state.user.userId, deckName);
        this.showFlashcard = true;
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        this.$bvToast.toast('Error fetching flashcards.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async deleteDeck(deckName) {
      try {
        await flashcardService.deleteDeck(this.$store.state.user.userId, deckName);
        this.$bvToast.toast(`Deck "${deckName}" deleted successfully!`, {
          variant: 'success',
          solid: true,
        });
        this.fetchDecks();
      } catch (error) {
        console.error('Error deleting deck:', error);
        this.$bvToast.toast('Error deleting deck.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async shuffleDeck(deckName) {
      try {
        await flashcardService.shuffleDeck(this.$store.state.user.userId, deckName);
        this.$bvToast.toast(`Flashcards in deck "${deckName}" shuffled successfully!`, {
          variant: 'success',
          solid: true,
        });
      } catch (error) {
        console.error('Error shuffling deck:', error);
        this.$bvToast.toast('Error shuffling deck.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async addFlashcard() {
      try {
        await flashcardService.addFlashcard(this.$store.state.user.userId, this.selectedDeck, this.flashcardFront, this.flashcardBack);
        this.$bvToast.toast(`Flashcard added to deck "${this.selectedDeck}" successfully!`, {
          variant: 'success',
          solid: true,
        });
        this.flashcardFront = '';
        this.flashcardBack = '';
        this.showAddFlashcardForm = false;
      } catch (error) {
        console.error('Error adding flashcard:', error);
        this.$bvToast.toast('Error adding flashcard.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async startQuiz() {
      try {
        this.quiz = await flashcardService.generateQuiz(this.$store.state.user.userId, this.selectedDeck, this.quizMode);
        if (!this.quiz) {
          this.$bvToast.toast(`No flashcards found in deck "${this.selectedDeck}".`, {
            variant: 'danger',
            solid: true,
          });
          return;
        }
        this.selectedAnswers = new Array(this.quiz.questions.length).fill(null).map(() => {
          if (this.quizMode === 'matching') {
            return new Array(this.quiz.questions.length).fill(null);
          }
          return null;
        });
        this.showQuiz = true;
        this.showQuizForm = false;
      } catch (error) {
        console.error('Error generating quiz:', error);
        this.$bvToast.toast('Error generating quiz.', {
          variant: 'danger',
          solid: true,
        });
      }
    },
    async submitQuiz() {
      let correctAnswers = 0;
      this.quiz.questions.forEach((question, index) => {
        if (this.quizMode === 'multiple_choice') {
          if (this.selectedAnswers[index] === question.answer) {
            correctAnswers += 1;
          }
        } else if (this.quizMode === 'true_false') {
          if (this.selectedAnswers[index] === question.answer) {
            correctAnswers += 1;
          }
        } else if (this.quizMode === 'matching') {
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
      this.showQuizResults = true;
    },
  },
};
</script>

<style scoped>
.flashcard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.flashcard-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.flashcard-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.flashcard-decks {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.flashcard-deck {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 5px;
}

.deck-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.deck-subject {
  margin-bottom: 1rem;
}

.deck-actions {
  display: flex;
  gap: 1rem;
}

.no-decks-message {
  text-align: center;
  font-style: italic;
}

.create-deck-form {
  margin-top: 2rem;
}

.flashcard-add {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.add-flashcard-info {
  text-align: center;
}

.add-flashcard-form {
  margin-top: 2rem;
}

.flashcard-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.view-flashcard-info {
  text-align: center;
}

.flashcard-content {
  margin-top: 2rem;
}

.flashcards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flashcard {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 5px;
}

.flashcard-front {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.flashcard-back {
  margin-bottom: 0.5rem;
}

.no-flashcards-message {
  text-align: center;
  font-style: italic;
}

.flashcard-quiz {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.quiz-info {
  text-align: center;
}

.quiz-form {
  margin-top: 2rem;
}

.quiz-content {
  margin-top: 2rem;
}

.quiz-questions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz-question {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 5px;
}

.question-text {
  font-weight: bold;
  margin-bottom: 0.5rem;
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

.match-item {
  font-weight: bold;
}

.quiz-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}
</style>