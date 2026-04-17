<template>
    <!-- <div><ProgressSpinner v-if="isLoading" /></div> -->
    <div class="player-info-header-nav">
        <router-link :to="'/scores'" class="app-header">Puck</router-link>
        <Settings></Settings>
    </div>
    <!-- <AutoComplete v-model="searchPlayer" :suggestions="allSearchPlayers" field="label" placeholder="Search Players" :minLength="3" @complete="searchPlayerGo" /> -->
    <div v-if="allSearchPlayers.length>0">
        <Dropdown v-model="searchPlayer" :options="allSearchPlayers" filter optionLabel="label" placeholder="Search Players" @change="searchPlayerGo" class="options-dropdown"></Dropdown>
    </div>

    <div v-if="playerInfo.playerId" class="player-info-header">
        <img :src="playerInfo.headshot" alt="Team Logo" class="player-info-logo">
        <strong class="player-info-name">{{ playerInfo.firstName.default }} {{ playerInfo.lastName.default }}</strong>
        <strong style="display:flex;align-items: center"><strong @click="goToTeam(playerInfo.currentTeamAbbrev)" style="cursor:pointer;display:flex;align-items: center"><img :src="playerInfo.teamLogo" alt="Player Logo" style="width:30px">{{ playerInfo.fullTeamName.default }}</strong> &nbsp;&nbsp;&#10242; {{ playerInfo.position }} &nbsp;&#10242; #{{ playerInfo.sweaterNumber }}</strong>
    </div>
    
    <nav class="player-nav">
        <router-link :to="'/player/' + id + '/season'">SEASON</router-link>
        <router-link :to="'/player/' + id + '/career'">CAREER</router-link>
        <router-link :to="'/player/' + id + '/info'">INFO</router-link>
    </nav>
    
    <router-view v-if="playerInfo.playerId" name="player-content" :playerInfo="playerInfo" :key="id"></router-view>

    <!-- Display error if any -->
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import Settings from '@/components/Settings.vue';
import AutoComplete from 'primevue/autocomplete';
import Dropdown from 'primevue/dropdown';

import { fetchApi } from '@/services/fetchApi';

export default {
    name: 'Player',
    components: {
        ProgressSpinner,
        Settings,
        AutoComplete,
        Dropdown,
    },
    props: {
        id: String,
    },
    mounted() {
        this.fetchPlayerInfo();
        this.fetchAllPlayers();
    },
    watch: {
      id(newId, oldId) {
        if (newId !== oldId) {
          this.playerInfo = {};
          this.isLoading = true;
          this.fetchPlayerInfo();
        }
      }
    },
    data() {
        return {
            isLoading: true,
            todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0],
            playerInfo: {},
            searchPlayer: null,
            allSearchPlayers: [],
            error: null,
        };
    },
    methods: {
        async fetchPlayerInfo() {
            try {
                const response = await fetchApi(`/api/v1/player/${this.id}/landing`);
                const data = await response.json();
                this.playerInfo = data;
                this.isLoading = false;
            }
            catch (error) {
                console.error('Error fetching teams:', error);
                alert('Error fetching teams. See console for details.');
            }
        },
        async fetchAllPlayers() {
          try {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            let currentYear = currentDate.getFullYear();
            let nextYear;
            if (currentMonth >= 8) { // September to December
                nextYear = currentYear + 1;
            } else { // January to August
                nextYear = currentYear;
                currentYear = currentYear - 1;
            }
            const seasonYear = `${currentYear}${nextYear}`;

            const url = `/restApi/stats/rest/en/skater/summary`;
            const queryParams = new URLSearchParams({
                isAggregate: false,
                isGame: false,
                start: 0,
                limit: -1,
                factCayenneExp: 'gamesPlayed>=1',
                cayenneExp: `
                    gameTypeId=2 and seasonId<=${seasonYear} and 
                    seasonId>=${seasonYear}`
            });
            const response = await fetchApi(`${url}?${queryParams}`);
            const data = await response.json();
            this.configureAllSearchPlayers(data);
            this.isLoading = false;
          } catch (error) {
            console.error('Error fetching all players:', error);
            alert('Error fetching all players. See console for details.');
          }
        },
        goToTeam(abbrev) {
            this.$router.push({ name: 'team.schedule', params: { id: abbrev }});
        },
        configureAllSearchPlayers(data) {
            data.data.forEach((player) => {
                if(player.playerId)
                    this.allSearchPlayers.push({label: player.skaterFullName, value: player.playerId});
            });
        },
        searchPlayerGo(event) {
            const playerId = event.value.value;

            this.$router.push({
              name: this.$route.name, // stay on same sub-route (season/career/info)
              params: { id: playerId },
              query: this.$route.query // preserve any query params if needed
            });
        },
    },
};
</script>

<style>
.player-info-header-nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.player-nav {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: space-around;
  border-bottom: solid;
  color: var(--link-color);
}

.player-info-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.player-info-logo {
    width: 115px;
    border-radius: 50px;
}

.player-info-name {
    font-size: xx-large;
    color:whitesmoke;
}

.p-dropdown-items {
    display: block;
    border: 1px solid #ccc;
    border-radius: 0 0 4px 4px;
    box-shadow: none;
    background-color: #181818;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    margin-left: -20px;
}

.p-dropdown-filter-container {
    display: block;
    border: 1px solid #ccc;
    border-radius: 0 0 4px 4px;
    box-shadow: none;
    background-color: #181818;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    margin-left: -20px;
}

.p-inputtext {
    font-size: 16px !important;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
    .options-dropdown{
        margin-left: 7%;
    }
    .player-info-name {
        font-size: x-large;
    }
}
</style>