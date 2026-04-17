<template>
  <Layout>
    <!-- Main header -->
    <h2>{{ pageTitle }} Page Content</h2>
  </Layout>
  <div><ProgressSpinner v-if="isLoading" /></div>
  <!-- Date navigation bar -->
  <div class="date-navigation">
    <button v-if="!isMobile()" @mousedown="startScroll(-1, 10)" @mouseup="stopScroll" @mouseleave="stopScroll" class="scroll-button left">&lt;</button>
    <div class="dates" ref="datesContainer" @wheel="handleWheel">
      <div
        v-for="(date, index) in dateRange"
        :key="index"
        @click="selectDate(date)"
        :class="{ active: date === selectedDate }"
        ref="dateElement"
      >
        {{ formatDate(date) }}
      </div>
    </div>
    <button v-if="!isMobile()" @mousedown="startScroll(1, 10)" @mouseup="stopScroll" @mouseleave="stopScroll" class="scroll-button right">&gt;</button>
  </div>

    <!-- Display fetched data -->
    <h3 class="date-header">{{ dateDesc(selectedDate) }}</h3>
    <PullToRefresh scrollSelector=".all-games" @refresh="refreshGames">
      <div class="all-games" ref="gamesScroll" v-if="games.games && games.games.length > 0" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <ul>
          <li v-for="game in games.games" :key="game.id" @click="openGame(game)" class="game-box">
            <div v-if="game.gameType==1" class="game-type"> <!--preseason tag-->
              <img src="@/assets/greenDash.svg" alt="dash" style="width:6px;padding-top:1px"/>
              <strong >preseason</strong>
            </div>
            <div v-else-if="game.gameType==3" class="game-type"> <!--playoffs tag-->
              <img src="@/assets/blueDash.svg" alt="dash" style="width:6px;padding-top:1px"/>
              <strong >playoffs</strong>
            </div>
            <div v-else-if="game.specialEvent" class="game-type"> <!--special event tag-->
              <img src="@/assets/yellowDash.svg" alt="dash" style="width:6px;padding-top:1px"/>
              <strong >{{ game.specialEvent.default }}</strong>
            </div>
            <div class="game-section">
              <div class="team-container">
                <div class="game-team">
                  <div style="display:flex;width:250px;color:white">
                    <img :src="game.awayTeam.logo" alt="Away Team Logo" class="team-logo">
                    <strong>{{ game.awayTeam.abbrev }} {{ game.awayTeam.name.default }}</strong>
                  </div>
                  <strong v-if="game.gameState=='PRE' || game.gameState=='FUT'" style="font-size:small">{{ getOdds(game.awayTeam.odds) }}</strong>
                </div>
                <div class="game-score-container">
                  <div v-if="game.gameState=='OFF' || game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='FINAL'">
                    <strong v-if="game.situation && game.situation.awayTeam.situationDescriptions" class="powerplay-tag">{{ getPPLabel(game, 'away') }}</strong>
                    <strong :class="((game.awayTeam.score>game.homeTeam.score) && (game.gameState=='OFF' || game.gameState=='FINAL')) ? 'game-score-win' : 'game-score'">{{ game.awayTeam.score }}</strong>
                  </div>
                </div>
              </div>
              <div class="period-clock">
                <strong v-if="game.gameState=='PRE' || game.gameState=='FUT'">{{ setTime(game.startTimeUTC) }}</strong>
                <strong v-if="game.gameState=='OFF' || game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='FINAL'">{{ currentGameTime(game.gameState, game.periodDescriptor, game.clock) }}</strong>
              </div>
            </div>
            <div class="game-section">
              <div class="team-container">
                <div class="game-team">
                  <div style="display:flex;width:250px;color:white">
                    <img :src="game.homeTeam.logo" alt="Home Team Logo" class="team-logo">
                    <strong>{{ game.homeTeam.abbrev }} {{ game.homeTeam.name.default }}</strong>
                  </div>
                  <strong v-if="game.gameState=='PRE' || game.gameState=='FUT'" style="font-size:small">{{ getOdds(game.homeTeam.odds) }}</strong>
                </div>
                <div class="game-score-container">
                  <div v-if="game.gameState=='OFF' || game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='FINAL'">
                    <strong v-if="game.situation && game.situation.homeTeam.situationDescriptions" class="powerplay-tag">{{ getPPLabel(game, 'home') }}</strong>
                    <strong :class="((game.homeTeam.score>game.awayTeam.score) && (game.gameState=='OFF' || game.gameState=='FINAL')) ? 'game-score-win' : 'game-score'">{{ game.homeTeam.score }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="all-games" ref="gamesScroll" v-else @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <h5 style="color:white">No games today</h5>
      </div>
    </PullToRefresh>

    <!-- Display error if any -->
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
</template>
  
<script>
import ProgressSpinner from './ProgressSpinner.vue';
import PullToRefresh from '@/components/PullToRefresh.vue';
import Layout from '@/components/Layout.vue';

import { fetchApi } from '@/services/fetchApi';

export default {
  name: 'Scores',
  components: {
    ProgressSpinner,
    PullToRefresh,
    Layout,
  },
  data() {
    return {
      isLoading: true,
      pageTitle: 'Scores',
      selectedDate: null,//new Date(new Date().toLocaleDateString()).toISOString().split('T')[0], // Default to today's date
      games: [],
      schedule: [],
      dateRange: [], // Array to store the date range for navigation
      daysToShow: 7, // Number of days to show in the navigation bar
      centerIndex: 0, // Added centerIndex to keep track of the center position
      scrollInterval: null,
      touchStartX: 0,
      touchStartY: 0,
      isSwiping: false,
      error: null,
    };
  },
  mounted() {
    this.selectedDate = this.$route.params.date || this.getFormattedToday();
    this.setupDateRange();
    this.fetchGames();
    this.fetchSchedule();
    this.$refs.datesContainer.addEventListener('wheel', this.handleWheel);
  },
  beforeDestroy() {
    this.$refs.datesContainer.removeEventListener('wheel', this.handleWheel);
  },
  created() {
  // If the route does not have the 'date' parameter, navigate to today's date
    if (!this.$route.params.date) {
      this.$router.replace({ name: 'scores', params: { date: this.getFormattedToday() } });
    }
    const routeDate = this.$route.params.date;
    this.selectedDate = routeDate || new Date().toISOString().split('T')[0];
  },
  updated() {
    // Use this.$nextTick to ensure the DOM has been fully rendered
    this.$nextTick(() => {
      this.scrollToSelectedDate(); // Call the method to scroll to the selected date
    });
  },
  watch: {
    '$route.params.date': 'updateSelectedDate',
    selectedDate: 'fetchGames',
    'schedule.preSeasonStartDate': 'setupDateRange',
    'schedule.regularSeasonEndDate': 'setupDateRange',
  },
  methods: {
    isMobile() {
      return window.innerWidth <= 640;
    },
    async refreshGames() {
      try {
        this.isLoading = true;
        await this.fetchGames();
        await this.fetchSchedule();
      } finally {
        this.isLoading = false;
      }
    },
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.isSwiping = true;
    },
    handleTouchMove(e) {
      if (!this.isSwiping) return;
      const deltaX = e.touches[0].clientX - this.touchStartX;
      const deltaY = e.touches[0].clientY - this.touchStartY;
      // If user is scrolling vertically, cancel swipe detection
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        this.isSwiping = false;
      }
    },

    handleTouchEnd(e) {
      if (!this.isSwiping) return;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - this.touchStartX;
      const swipeThreshold = 50; // adjust sensitivity
      if (deltaX > swipeThreshold) {
        // swipe RIGHT → previous day
        this.goToAdjacentDate(-1);
      } else if (deltaX < -swipeThreshold) {
        // swipe LEFT → next day
        this.goToAdjacentDate(1);
      }
      this.isSwiping = false;
    },
    goToAdjacentDate(direction) {
      const currentIndex = this.dateRange.indexOf(this.selectedDate);
      if (currentIndex === -1) return;
      const newIndex = currentIndex + direction;

      if (newIndex < 0 || newIndex >= this.dateRange.length) return;
      const newDate = this.dateRange[newIndex];
      
      this.selectDate(newDate);
    },
    async fetchGames() {
      try {
        this.isLoading = true;    
        const response = await fetchApi(`/api/v1/score/${this.selectedDate}`);
        const data = await response.json();
        this.games = data;
        console.log('DATA:', data);
        console.log('GAMES BEFORE SORT:', this.games);
        this.sortGames(this.games);
        this.isLoading = false;
      } catch (error) {
        console.error('Error fetching scores:', error);
        alert('Error fetching scores. See console for details.');
      }
    },
    async fetchSchedule() {
      try {
        this.isLoading = true;
        const response = await fetchApi(`/api/v1/schedule/${this.selectedDate}`);
        const data = await response.json();
        this.schedule = data;
        // Handle the fetched data as needed
        this.isLoading = false;
      } catch (error) {
        console.error('Error fetching scores:', error);
        alert('Error fetching scores. See console for details.');
      }
    },
    sortGames(games) {
      const finishedGames = games.games.filter(game => game.gameState === 'FINAL' || game.gameState === 'OFF');
      const ongoingGames = games.games.filter(game => game.gameState !== 'FINAL' && game.gameState !== 'OFF');
      this.games.games = ongoingGames.concat(finishedGames);
    },
    setupDateRange() {
      const today = new Date();
      const month = today.getMonth() + 1;
      const startDate = new Date(this.schedule.preSeasonStartDate);
      let endDate;
      if (month < 4) //if before april end season as regular season
          endDate = new Date(this.schedule.regularSeasonEndDate);
      else //if after april end season as playoffs
          endDate = new Date(this.schedule.playoffEndDate);

      // Calculate the number of days between start and end dates
      const daysDifference = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Clear the existing dateRange
      this.dateRange = [];

      // Populate dateRange with dates from the start to the end
      for (let i = 0; i <= daysDifference; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          this.dateRange.push(currentDate.toISOString().split('T')[0]);
      }

      // Find the index of today's date and set it as the center index
      this.centerIndex = this.dateRange.findIndex((date) => date === today.toISOString().split('T')[0]);
    },
    formatDate(date) {
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1); // Add one day for formatting
      const formattedDate = new Date(adjustedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const uppercaseMonth = formattedDate.split(' ')[0].toUpperCase();
      const finalFormattedDate = `${uppercaseMonth} ${formattedDate.split(' ')[1]}`;
      return date === (new Date(new Date().toLocaleDateString()).toISOString().split('T')[0]) ? 'TODAY' : finalFormattedDate;
    },
    dateDesc(dateString) {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day + 1)); // Subtract 1 from month to adjust for zero-based month index
      return date.toLocaleDateString('en-US', options);
    },
    selectDate(date) {
      this.selectedDate = date;
      // Update the center index when a new date is selected
      this.centerIndex = this.dateRange.findIndex((d) => d === date);
      this.$router.push({ name: 'scores', params: { date: date } });
    },
    getFormattedToday() {
      return new Date(new Date().toLocaleDateString()).toISOString().split('T')[0];
    },
    updateSelectedDate(newDate) {
      if (newDate) {
        this.selectedDate = newDate;
        this.scrollToSelectedDate();
      }
    },
    setTime(utcTime) {
      const localTime = new Date(utcTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return localTime;
    },
    currentGameTime(gameState, periodDescriptor, clock) {
      if(gameState == "LIVE" || gameState == "CRIT") {
        switch (periodDescriptor.number) {
          case 1:
            if(clock.inIntermission)
              return "End 1st";
            return (clock.timeRemaining+" 1st");
          case 2:
            if(clock.inIntermission)
              return "End 2nd";
            return (clock.timeRemaining+" 2nd");
          case 3:
            if(clock.inIntermission)
              return "End 3rd";
            return (clock.timeRemaining+" 3rd");
          case 4:
            if(clock.inIntermission)
              return "End OT";
            return (clock.timeRemaining+" OT");
          case 5:
            return "SO";
          default:
            return "Final";
        }
      } else if(gameState == "OFF" || gameState == "FINAL") {
        switch (periodDescriptor.number) {
          case 3:
            return "Final";
          case 5:
            return "Final (SO)";
          default:
            return "Final (OT)";
        }
      }
    },
    scrollToSelectedDate() {
      // Use refs to access the DOM elements
      const datesContainer = this.$refs.datesContainer;
      const dateElementRefs = this.$refs.dateElement;

      // Check if dateElementRefs is defined and not empty
      if (dateElementRefs && dateElementRefs.length > 0) {
        const dateElement = dateElementRefs[this.dateRange.indexOf(this.selectedDate)];
      
        // Scroll to make the selected date centered
        if (dateElement) {
          const containerWidth = datesContainer.offsetWidth;
          const elementWidth = dateElement.offsetWidth;
        
          if(!this.isMobile())
            datesContainer.scrollLeft = (dateElement.offsetLeft - 250) - (containerWidth - elementWidth) / 2;
          else
            datesContainer.scrollLeft = dateElement.offsetLeft - (containerWidth / 2) + (elementWidth / 2);
        }
      }
    },
    handleWheel(event) {
      event.preventDefault();
      if (event.deltaY < 0) {
        this.startScroll(1, 1);
      } else {
        this.startScroll(-1, 1);
      }
      // Stop scrolling after a short delay to mimic button behavior
      setTimeout(this.stopScroll, 150);
    },
    scrollDates(direction) {
      const container = this.$refs.datesContainer;
      const scrollAmount = direction * 10; // Adjust the scroll amount as needed
      container.scrollLeft += scrollAmount;
      // If the button is still pressed, continue scrolling
      if (direction === 'left') {
        this.$refs.datesContainer.scrollLeft -= 10; // Adjust scroll distance as needed
      } else if (direction === 'right') {
        this.$refs.datesContainer.scrollLeft += 10; // Adjust scroll distance as needed
      }
    },
    startScroll(direction, speed) {
        if (!this.isScrolling) {
            this.isScrolling = true;
            // Start scrolling immediately
            this.scrollDates(direction);
            // Start scrolling continuously
            this.scrollInterval = setInterval(() => {
                this.scrollDates(direction);
            }, speed); // Adjust the interval as needed
        }
    },
    // Stop scrolling
    stopScroll() {
        clearInterval(this.scrollInterval);
        this.isScrolling = false;
    },
    getOdds(allOdds) {
      if(allOdds) {
        for (const odds of allOdds) {
          if(odds.providerId==7)
            return odds.value>0 ? `(+${(parseFloat(odds.value)).toFixed(0)})` : `(${(parseFloat(odds.value)).toFixed(0)})`;
        }
      }
      return '';
    },
    getPPLabel(game, team) {
      if(game.situation && team == 'away' && game.situation.awayTeam.situationDescriptions)
        return 'PP'; //try this '<strong style="background-color:yellow">PP </strong>'
      else if(game.situation && team == 'home' && game.situation.homeTeam.situationDescriptions)
        return 'PP';
    },
    openGame(game) {
      // Programmatically navigate to the Game component with the current date
      this.$router.push({ name: 'game', params: { id: game.id }, query: { date: this.selectedDate } });
    },
  },
};
</script>
  
<style>
.date-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.dates {
  display: flex;
  gap: 5rem;
  overflow-x: auto;
  width: 80%; /* Adjust the width as needed */
  margin: 0 auto; /* Center the dates within the parent */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: transparent transparent; /* Firefox */
  /* Hide scrollbar for other browsers */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.dates::-webkit-scrollbar {
  width: 0; /* Hide scrollbar for Chrome, Safari, and Opera */
}

.dates div {
  cursor: pointer;
  white-space: nowrap; /* Prevent line breaks */
  padding: 0.5rem; /* Add padding for better spacing */
  width: 4rem; /* Adjust the width as needed */
  display: flex;
  text-align: center;
  justify-content: center;
}

.dates div.active {
  font-weight: bold;
  background-color: var(--hover-dark-color); /* Highlight the active date */
  color: white;
  border-radius: 10px;
}

.date-header {
  color:white;
  margin-bottom:1rem;
}

.scroll-button {
    background-color: transparent;
    color: #EBEBEBA3;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    padding: 0.5rem;
}

.left {
    float: left;
}

.right {
    float: right;
}

.game-box {
  cursor: pointer;
  border: 1px solid #ffffff0a; /* Add border for each game box */
  padding: 1rem;
  background-color: #00000000; /* Background color for each game box */
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s; /* Add transition for smooth color change */
}

.game-box:hover {
  background-color: var(--hover-dark-color);
}

.game-type {
  display: flex;
  position: absolute;
  margin-top: -18px;
  margin-left: -11px;
  font-size: 9px;
  font-style: italic;
  color: white;
  align-items: center;
}

.game-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px;
}

.team-container {
  display: flex;
  align-items: center;
  width: 85%; /* Adjust width as needed */
}

.game-team {
  display: flex;
  align-items: center;
}

.game-score-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%; /* Adjust width as needed */
}

.period-clock {
  margin-left: auto;
  color: white;
}

.game-score {
  margin-left: 10px; /* Adjust margin as needed */
  color: white;
}

.game-score-win {
  margin-left: 10px;
  color: white;
  font-weight: bold;
}

.powerplay-tag {
  text-transform: uppercase;
  border: solid;
  border-width: thin;
  border-radius: 4px;
  border-color: var(--main-color);
  color: var(--main-color);
}

.game-link {
  text-decoration: none; /* Remove default link underline */
  color: inherit; /* Inherit text color from the parent */
}

.game-link:hover {
  text-decoration: none; /* Remove underline on hover */
  color: inherit; /* Inherit text color on hover */
  background: #00000000;
}

.team-logo {
  width: 40px; /* Adjust the width of the logo as needed */
  height: 24px; /* Adjust the height of the logo as needed */
  margin-right: 8px; /* Add margin between logo and team abbreviation */
}

h3 {
  margin-top: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
  .all-games {
    height: calc(100dvh - 240px);
    padding-top: 1rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .dates {
    width: 100%;
    gap: 0.8rem;
  }
  .date-header {
    margin-top:0rem;
    margin-bottom:0rem;
  }
  .date-navigation {
    margin-top: 0.5rem;
    margin-bottom: 0rem;
  }
  .game-box {
    padding: 0.2rem;
  }
  .game-box:hover {
    background-color: #ffffff00;
  }
  .game-section {
    padding: 4px;
  }
  .game-team {
    width: 140%;
  }
  .powerplay-tag {
    margin-left: -53%;
  }
  .team-container {
    width: 50%;
  }
  .team-logo {
    height: 25px;
    margin-left: -7px;
  }
}
</style>