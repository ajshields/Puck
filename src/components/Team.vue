<template>
    <div><ProgressSpinner v-if="isLoading" /></div>
    <!-- <div class="settings-options">
      <PanelMenu :model="settingsItems" class="settings" />
    </div> -->
    <div class="team-info-header-nav">
        <router-link :to="'/scores'" class="app-header">Puck</router-link>
        <Settings></Settings>
    </div>
    <div style="margin-top:10px">
        <Dropdown v-model="selectedTeam" :options="configureTeams" optionLabel="team" placeholder="Select Team" @change="teamChange" class="options-dropdown"/>
    </div>

    <div v-if="teamInfo.teamAbbrev" class="team-header-team">
        <div class="team-info-team">
            <strong>{{ getRecord(teamInfo.l10Wins, teamInfo.l10Losses, teamInfo.l10OtLosses) }}</strong>
            <strong>L10</strong>
        </div>
        <div class="team-info-team-middle">
            <img :src="teamInfo.teamLogo" alt="Team Logo" class="team-page-logo">
            <strong class="team-info-name">{{ teamInfo.teamName.default }}</strong>
            <strong>{{ getRecord(teamInfo.wins, teamInfo.losses, teamInfo.otLosses) }}, {{ getPlacement(teamInfo) }}</strong>
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
    
    <router-view name="team-content"></router-view>

    <!-- Display error if any -->
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import Settings from '@/components/Settings.vue';
import Dropdown from 'primevue/dropdown';

import { fetchApi } from '@/services/fetchApi';

export default {
    name: 'Team',
    components: {
        ProgressSpinner,
        Settings,
        Dropdown,
    },
    props: {
        id: String,
    },
    mounted() {
        this.fetchSchedule();
    },
    data() {
      return {
          isLoading: true,
          todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0],
          error: null,
          teamInfo: {},
          selectedTeam: null,
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
                console.log(data);
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
        teamChange() {
            const currentPath = this.$route.path;
            // Extract the current team abbreviation from the path
            const currentTeamAbbreviation = currentPath.match(/\/team\/([A-Z]+)\//)[1];
            // Construct the new team-specific path by replacing the current team abbreviation with the selected one
            const newTeamPath = currentPath.replace(`/${currentTeamAbbreviation}/`, `/${this.selectedTeam.value}/`);
            // Push the new path to the router
            this.$router.push(newTeamPath);
            setTimeout(() => {
                window.location.reload();
            }, 50);
        },
    },
    computed: {
        configureTeams() {
            return [
                {team: 'Anaheim Ducks', value: 'ANA'},
                {team: 'Arizona Coyotes', value: 'ARI'},
                {team: 'Boston Bruins', value: 'BOS'},
                {team: 'Buffalo Sabres', value: 'BUF'},
                {team: 'Calgary Flames', value: 'CGY'},
                {team: 'Carolina Hurricanes', value: 'CAR'},
                {team: 'Chicago Blackhawks', value: 'CHI'},
                {team: 'Colorado Avalanche', value: 'COL'},
                {team: 'Columbus Blue Jackets', value: 'CBJ'},
                {team: 'Dallas Stars', value: 'DAL'},
                {team: 'Detroit Red Wings', value: 'DET'},
                {team: 'Edmonton Oilers', value: 'EDM'},
                {team: 'Florida Panthers', value: 'FLA'},
                {team: 'Los Angeles Kings', value: 'LAK'},
                {team: 'Minnesota Wild', value: 'MIN'},
                {team: 'Montreal Canadiens', value: 'MTL'},
                {team: 'Nashville Predators', value: 'NSH'},
                {team: 'New Jersey Devils', value: 'NJD'},
                {team: 'New York Islanders', value: 'NYI'},
                {team: 'New York Rangers', value: 'NYR'},
                {team: 'Ottawa Senators', value: 'OTT'},
                {team: 'Philadelphia Flyers', value: 'PHI'},
                {team: 'Pittsburgh Penguins', value: 'PIT'},
                {team: 'San Jose Sharks', value: 'SJS'},
                {team: 'Seattle Kraken', value: 'SEA'},
                {team: 'St Louis Blues', value: 'STL'},
                {team: 'Tampa Bay Lightning', value: 'TBL'},
                {team: 'Toronto Maple Leafs', value: 'TOR'},
                {team: 'Vancouver Canucks', value: 'VAN'},
                {team: 'Vegas Golden Knights', value: 'VGK'},
                {team: 'Washington Capitals', value: 'WSH'},
                {team: 'Winnipeg Jets', value: 'WPG'},

            ];
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