<template>
    <Layout>
        <!-- Content specific to the respective page -->
        <h2>{{ pageTitle }} Page Content</h2>
    </Layout>
    <div><ProgressSpinner v-if="isLoading" /></div>

    <div class="game-highlight-modal" v-if="showHighlight" @click="showHighlight=false">
        <div class="game-highlight-modal-content" @click.stop>
            <span class="game-highlight-close" @click="showHighlight=false">&times;</span>
            <video
              v-if="highlightUrl"
              :src="highlightUrl"
              controls
              autoplay
              playsinline
              style="width:100%"
            />
        </div>
    </div>

    <div class="news-options">
      <v-button class="news-selector" :class="{ 'news-selector-selected': type === 'news' }" @click="type='news'">Top News</v-button>
      <v-button class="news-selector" :class="{ 'news-selector-selected': type === 'recaps' }" @click="type='recaps'">Game Recaps</v-button>
    </div>

    <div v-if="type == 'news'">

    </div>
    <div v-if="type == 'recaps'" v-for="gameDay in gameWeek" class="game-recap-day">
        <div v-if="gameDay.numberOfGames > 0">
            <strong class="game-recap-date">{{ getRecapDate(gameDay.dayAbbrev, gameDay.date) }}</strong>
            <ul class="recap-day-games">
                <li v-for="game in gameDay.games" :key="game.id" @click="fetchGameHighlight(game.condensedGame)" class="game-recap-box">
                    <div class="game-recap-team">
                        <img :src="game.awayTeam.darkLogo" alt="Away Team Logo" class="recap-team-logo">
                        <div v-if="isMobile()" class="recap-team-name"><strong>{{ game.awayTeam.placeName.default }}</strong><strong>{{ game.awayTeam.commonName.default }}</strong></div>
                        <strong v-else class="recap-team-name">{{ game.awayTeam.placeName.default }} {{ game.awayTeam.commonName.default }}</strong>
                    </div>
                    <span class="recap-play-button">&#9205;</span>
                    <div class="game-recap-team">
                        <img :src="game.homeTeam.darkLogo" alt="Away Team Logo" class="recap-team-logo">
                        <div v-if="isMobile()" class="recap-team-name"><strong>{{ game.homeTeam.placeName.default }}</strong><strong>{{ game.homeTeam.commonName.default }}</strong></div>
                        <strong v-else class="recap-team-name">{{ game.homeTeam.placeName.default }} {{ game.homeTeam.commonName.default }}</strong>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <!-- Display error if any -->
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import Layout from '@/components/Layout.vue';
import Settings from '@/components/Settings.vue';

import { fetchApi } from '@/services/fetchApi';

export default {
    name: 'News',
    components: {
        ProgressSpinner,
        Layout,
        Settings,
    },
    data() {
        return {
            isLoading: true,
            todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0],
            showHighlight: false,
            highlightUrl: null,
            type: 'news',
            gameWeek: [],
            error: null,
        };
    },
    mounted() {
        this.fetchGames();
    },
    methods: {
        isMobile() {
            return window.innerWidth <= 640;
        },
        async fetchGames() {
            const d = new Date();
            d.setDate(d.getDate() - 7);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const preWeekDate = `${yyyy}-${mm}-${dd}`;

            try {
              this.isLoading = true;    
              const response = await fetchApi(`/api/v1/schedule/${preWeekDate}`);
              const data = await response.json();
              for(let i = data.gameWeek.length-1; i >= 0; i--) {
                this.gameWeek.push(data.gameWeek[i]);
              }
              console.log(this.gameWeek);
              this.isLoading = false;
            } catch (error) {
              console.error('Error fetching scores:', error);
              alert('Error fetching scores. See console for details.');
            }
        },
        async fetchGameHighlight(highlightClip) {
            const highlightId = Number(highlightClip.match(/\d+$/)?.[0]);
            const response = await fetch(
              `https://edge.api.brightcove.com/playback/v1/accounts/6415718365001/videos/${highlightId}`,
              {
                headers: {
                  Accept: 'application/json;pk=BCpkADawqM3l37Vq8trLJ95vVwxubXYZXYglAopEZXQTHTWX3YdalyF9xmkuknxjBgiMYwt8VZ_OZ1jAjYxz_yzuNh_cjC3uOaMspVTD-hZfNUHtNnBnhVD0Gmsih8TBF8QlQFXiCQM3W_u4ydJ1qK2Rx8ZutCUg3PHb7Q'
                }
              }
            );
          
            const data = await response.json();
            const mp4Source = data.sources.find(
              source => source.container === 'MP4'
            );

            this.highlightUrl = mp4Source.src;
            this.showHighlight = true;
        },
        getRecapDate(dayAbbrev, date) {
            const fullDayNames = {MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday'};
            const d = new Date(`${date}T00:00:00`);
            const day = d.getDate();
            const month = d.toLocaleString('en-US', { month: 'long' });
        
            const ordinal = (n) => {
                if (n > 3 && n < 21) return `${n}th`;
                switch (n % 10) {
                    case 1: return `${n}st`;
                    case 2: return `${n}nd`;
                    case 3: return `${n}rd`;
                    default: return `${n}th`;
                }
            };
        
            return `${fullDayNames[dayAbbrev]}, ${month} ${ordinal(day)}`;
        }
    }
};
</script>

<style>
.news-options {
    display: flex;
    justify-content: center;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 8px;
}

.news-selector {
    display: flex;
    width: 125px !important;
    justify-content: center;
    background-color: #ffffff00;
    color: white;
    border: none;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 2px 2px;
    transition-duration: 0.3s;
    cursor: pointer;
    border-radius: 8px;
}

.news-selector:hover {
    background-color: var(--main-color);
    color: black;
}

.news-selector-selected {
    background-color: var(--main-color);
    color: black;
}

.game-highlight-modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: -275px;
  width: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.game-highlight-modal-content {
  margin: 15% auto;
  padding: 20px;
}

.game-highlight-close {
    color: white;
    font-size: x-large;
    cursor: pointer;
}

.recap-day-games {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    list-style: none;
    column-gap: 15px;
}

.recap-team-logo {
    width: 100px;
    height: 100px;
}

.game-recap-box {
    display: flex;
    width: 32%;
    height: 200px;
    border: 1px solid #ffffff0a;
    border-radius: 8px;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
    position: relative;
}

.game-recap-box:hover {
    background-color: #00F2FF94;
}

.game-recap-box:hover .recap-play-button {
  color: var(--color-background);
}

.game-recap-day {
    margin-top: 1rem;
}

.game-recap-date {
    font-size: xx-large;
}

.recap-play-button {
    font-size: 70px;
    color: #00F2FF94;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.game-recap-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
    .game-recap-box {
        width: 47%;
    }
    .game-recap-box:hover {
    background-color: var(--color-background);
    }
    .game-recap-box:hover .recap-play-button {
      color: #00F2FF94;
    }
    .game-recap-date {
        font-size: x-large;
    }
    .game-recap-team {
        height: 100%;
        justify-content: space-evenly;
    }
    .game-highlight-modal {
        top: -250px;
    }
    .game-highlight-modal-content {
        margin: calc(100dvh - 295px) auto;
        padding: 0px 20px 0px 20px;
    }
    .recap-day-games {
        justify-content: space-between;
    }
    .recap-play-button {
        font-size: 50px;
        top: 34%;
    }
    .recap-team-logo {
        width: 90px;
        height: 90px;
    }
    .recap-team-name {
        display: flex;
        font-size: small;
        flex-direction: column;
        align-items: center;
        width: 50%;
    }
}
</style>