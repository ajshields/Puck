<template>
    <div><ProgressSpinner v-if="isLoading" /></div>
    <!-- <div class="settings-options">
      <PanelMenu :model="settingsItems" class="settings" />
    </div> -->
    <div class="team-info-header-nav">
        <router-link :to="'/scores'" class="app-header">Puck</router-link>
        <div class="settings-section">
            <Settings></Settings>
            <Account></Account>
            <Options></Options>
        </div>
    </div>
    <div>
        <Dropdown v-model="selectedTeam" :options="teams" optionLabel="team" placeholder="Select Team" @change="teamChange" class="options-dropdown"/>
    </div>

    <div v-if="teamInfo.teamAbbrev" class="team-header-team">
        <div class="team-info-team">
            <strong>{{ getRecord(teamInfo.l10Wins, teamInfo.l10Losses, teamInfo.l10OtLosses) }}</strong>
            <strong>LAST10</strong>
        </div>
        <div class="team-info-team-middle">
            <img :src="teamInfo.teamLogo" alt="Team Logo" class="team-page-logo">
            <strong class="team-info-name" :class="{'team-favorite-team': isFavoriteTeam(teamInfo.teamAbbrev.default)}">{{ teamInfo.teamName.default }}</strong>
            <strong style="width:150%;display:flex;justify-content:center">{{ getRecord(teamInfo.wins, teamInfo.losses, teamInfo.otLosses) }}, {{ getPlacement(teamInfo) }}</strong>
        </div>
        <div class="team-info-team">
            <strong>{{ teamInfo.streakCode }}{{ teamInfo.streakCount }}</strong>
            <strong>STRK</strong>
        </div>
    </div>
    
    <nav class="team-nav">
        <router-link :to="'/team/' + id + '/schedule'">SCHEDULE</router-link>
        <router-link :to="'/team/' + id + '/roster'">ROSTER</router-link>
        <router-link :to="'/team/' + id + '/lineup'">LINEUP</router-link>
        <!-- <router-link :to="'/team/' + id + '/salarycap'">SALARY CAP</router-link> -->
    </nav>
    
    <router-view name="team-content" :key="$route.fullPath"></router-view>

    <!-- Display error if any -->
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import Options from '@/components/Options.vue';
import Account from '@/components/Account.vue';
import Settings from '@/components/Settings.vue';
import Dropdown from 'primevue/dropdown';
import { fetchApi } from '@/services/fetchApi';
import teams from '@/constants/teams';
import { usePreferencesStore } from '@/stores/preferences';

export default {
    name: 'Team',
    components: {
        ProgressSpinner,
        Options,
        Account,
        Settings,
        Dropdown,
    },
    props: {
        id: String,
    },
    mounted() {
        this.fetchSchedule();
    },
    watch: {
      id: {
        immediate: true,
        handler() {
          this.fetchSchedule();
          this.selectedTeam = null;
        }
      }
    },
    data() {
        return {
            isLoading: true,
            todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0],
            error: null,
            teamInfo: {},
            teams,
            selectedTeam: null,
            favoriteTeams: (usePreferencesStore()).favorite_teams
        };
    },
    methods: {
        async fetchSchedule() {
          try {
            this.isLoading = true;
            const response = await fetchApi(`/api/v1/schedule/${this.todaysDate}`);
            const data = await response.json();
            this.schedule = data;
            this.isLoading = false;

            if(this.todaysDate > data.regularSeasonEndDate) //if the regular season is over send last date of regular season
              this.fetchTeamInfo(data.regularSeasonEndDate);
            else //send current date
              this.fetchTeamInfo(this.todaysDate);
          } catch (error) {
            console.error('Error fetching scores:', error);
            alert('Error fetching scores. See console for details.');
          }
        },
        async fetchTeamInfo(date) {
            try {
                const response = await fetchApi(`/api/v1/standings/${date}`);
                const data = await response.json();
                this.configureTeamInfo(data);
                this.isLoading = false;
            }
            catch (error) {
                console.error('Error fetching teams:', error);
                alert('Error fetching teams. See console for details.');
            }
        },
        configureTeamInfo(data) {
            for (const team of data.standings) {
                if(team.teamAbbrev.default == this.id) {
                    this.teamInfo = team;
                    break;
                }
            }
        },
        getRecord(wins, losses, otLosses) {
            return `${wins}-${losses}-${otLosses}`;
        },
        getPlacement(teamInfo) {
            let ending = '';
            switch(teamInfo.divisionSequence) {
                case 1:
                case 21:
                case 31:
                    ending = 'st';
                    break;
                case 2:
                case 22:
                case 32:
                    ending = 'nd';
                    break;
                case 3:
                case 23:
                    ending = 'rd';
                    break;
                default:
                    ending = 'th';
                    break;
            }
            return `${teamInfo.divisionSequence}${ending} ${teamInfo.divisionName}`;
        },
        isFavoriteTeam(team) {
            return this.favoriteTeams.includes(team);
        },
        teamChange() {
          const currentPath = this.$route.path;

          const newPath = currentPath.replace(
            /\/team\/[^/]+/,
            `/team/${this.selectedTeam.value}`
          );

          this.$router.push(newPath);
        },
    },
};
</script>

<style>
.team-info-header-nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.team-nav {
  width: 100%;
  display: flex;
  justify-content: space-around;
  border-bottom: solid;
  color: var(--link-color);
}

.team-header-team {
    width: 100%;
    display: flex;
    justify-content: center;
}

.team-info-team {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.team-info-name {
    font-size: xx-large;
    color: whitesmoke;
}

.team-info-team-middle {
    display: flex;
    flex-direction: column;
    width: 30%;
    align-items: center;
}

.team-page-logo {
    width: 200px
}

.team-favorite-team {
  color: var(--favorites-color);
}

/* Mobile Device Styling */
@media (max-width: 640px) {
    .team-header-team {
        padding-top: 1rem;
    }
    .team-info-team-middle {
        width: 44%;
    }
    .team-info-name {
        font-size: medium;
    }
    .team-page-logo {
        width: 100px
    }
    
}
</style>