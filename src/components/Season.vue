<template>
    <div><ProgressSpinner v-if="isLoading" /></div>

    <div v-if="playerInfo" style="margin-top:2rem">
        <strong style="padding-left:75px;font-size:large">{{ formatYears(playerInfo.seasonTotals[currentSeasonIndex].season) }}</strong>

        <div v-if="playerInfo.position!='G'" class="player-season-stats">
            <div class="player-season-stat"><strong>GP</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].gamesPlayed }}</strong></div>
            <div class="player-season-stat"><strong>G</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].goals }}</strong></div>
            <div class="player-season-stat"><strong>A</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].assists }}</strong></div>
            <div class="player-season-stat"><strong>P</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].points }}</strong></div>
            <div class="player-season-stat"><strong>+/-</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].plusMinus }}</strong></div>
            <div class="player-season-stat"><strong>PIM</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].pim }}</strong></div>
            <div class="player-season-stat"><strong>TOI</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].avgToi }}</strong></div>
            <div class="player-season-stat"><strong>PPG</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].powerPlayGoals }}</strong></div>
            <div class="player-season-stat"><strong>PPP</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].powerPlayPoints }}</strong></div>
            <div class="player-season-stat"><strong>SHG</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].shorthandedGoals }}</strong></div>
            <div class="player-season-stat"><strong>SHP</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].shorthandedPoints }}</strong></div>
            <div class="player-season-stat"><strong>OTG</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].otGoals }}</strong></div>
            <div class="player-season-stat"><strong>GWG</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].gameWinningGoals }}</strong></div>
            <div class="player-season-stat"><strong>SH</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].shots }}</strong></div>
            <div class="player-season-stat"><strong>SH%</strong><strong class="player-stat-value">{{ (playerInfo.seasonTotals[currentSeasonIndex].shootingPctg*100).toFixed(1) }}</strong></div>
            <div class="player-season-stat"><strong>FO%</strong><strong class="player-stat-value">{{ (playerInfo.seasonTotals[currentSeasonIndex].faceoffWinningPctg*100).toFixed(1) }}</strong></div>
        </div>
        <div v-if="playerInfo.position=='G'" class="player-season-stats">
            <div class="player-season-stat"><strong>GP</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].gamesPlayed }}</strong></div>
            <div class="player-season-stat"><strong>GS</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].gamesStarted }}</strong></div>
            <div class="player-season-stat"><strong>SA</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].shotsAgainst }}</strong></div>
            <div class="player-season-stat"><strong>GA</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].goalsAgainst }}</strong></div>
            <div class="player-season-stat"><strong>W</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].wins }}</strong></div>
            <div class="player-season-stat"><strong>L</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].losses }}</strong></div>
            <div class="player-season-stat"><strong>OTL</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].otLosses }}</strong></div>
            <div class="player-season-stat"><strong>SO</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].shutouts }}</strong></div>
            <div class="player-season-stat"><strong>SV%</strong><strong class="player-stat-value">{{ (playerInfo.seasonTotals[currentSeasonIndex].savePctg.toFixed(3)).slice(1) }}</strong></div>
            <div class="player-season-stat"><strong>GAA</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].goalsAgainstAvg.toFixed(2) }}</strong></div>
            <div class="player-season-stat"><strong>MIN</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].timeOnIce }}</strong></div>
            <div class="player-season-stat"><strong>PIM</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].pim }}</strong></div>
            <div class="player-season-stat"><strong>G</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].goals }}</strong></div>
            <div class="player-season-stat"><strong>A</strong><strong class="player-stat-value">{{ playerInfo.seasonTotals[currentSeasonIndex].assists }}</strong></div>
        </div>

        <div v-if="playerInfo.position!='G'" class="game-log">
            <h3>Game Log</h3>
            <DataTable :value="gameLog" tableStyle="width: 100%">
                <Column field="games" header="Games" style="width:15%;text-align:left;color:white;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="goals" header="G" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="assists" header="A" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="points" header="P" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="plusMinus" header="+/-" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="pim" header="PIM" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="shots" header="SOG" style="width:4%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="toi" header="TOI" style="width:5%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="powerPlayGoals" header="PPG" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="shorthandedGoals" header="SHG" style="width:5%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
            </DataTable>
        </div>
        <div v-else class="game-log">
            <h3>Game Log</h3>
            <DataTable :value="gameLog" tableStyle="width: 100%">
                <Column field="games" header="Games" style="width:15%;text-align:left;color:white;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="decision" header="W/L" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="goalsAgainst" header="GA" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="shotsAgainst" header="SA" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="savePctg" header="SV%" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="goalsAgainstAverage" header="GAA" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                <Column field="toi" header="TOI" style="width:5%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
            </DataTable>
        </div>
    </div>

    <!-- Display error if any -->
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
    name: 'Season',
    components: {
        ProgressSpinner,
        DataTable,
        Column,
    },
    props: {
        id: String,
        playerInfo: Object,
    },
    mounted() {
        this.fetchGameLog();
    },
    data() {
      return {
          isLoading: true,
          currentSeasonIndex: this.getSeasonIndex(this.playerInfo.seasonTotals),
          gameLog: [],
          error: null,
      };
    },
    methods: {
        async fetchGameLog() {
            try {
                this.isLoading = true;
                const response = await fetch(`/api/v1/player/${this.id}/game-log/${this.playerInfo.featuredStats.season}/2`, {
                  method: 'GET',
                  headers: {
                    'Cache-Control': 'no-cache',
                  },
                });
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                this.configureGameLog(data);
                this.isLoading = false;
            }
            catch (error) {
                console.error('Error fetching teams:', error);
                alert('Error fetching teams. See console for details.');
            }
        },
        getSeasonIndex(seasons) {
            for(let i = (seasons.length-1); i >= 0; i--) {
                if(seasons[i].leagueAbbrev=='NHL') {
                    if(seasons[i].gameTypeId==3)
                        return (i-1);
                    else
                        return i;
                }
            }
        },
        formatYears(years) {
            const yearsString = years.toString();
            const startYear = yearsString.slice(0, 4);
            const endYear = yearsString.slice(4);
            return `${startYear}-${endYear}`;
        },
        configureGameLog(data) {
            data.gameLog.forEach((game) => {
                if(this.playerInfo.position!='G') {
                    this.gameLog.push({
                        'games': `${this.getDate(game.gameDate)} ${this.getHomeAway(game.homeRoadFlag)} ${game.opponentAbbrev}`,
                        'goals': game.goals,
                        'assists': game.assists,
                        'points': game.points,
                        'plusMinus': game.plusMinus,
                        'pim': game.pim,
                        'shots': game.shots,
                        'toi': game.toi,
                        'powerPlayGoals': game.powerPlayGoals,
                        'shorthandedGoals': game.shorthandedGoals,
                    });
                } else {
                    const [minutes, seconds] = game.toi.split(':').map(Number);
                    const totalMinutes = minutes + seconds / 60;
                    const goalsAgainstAverage = ((game.goalsAgainst / totalMinutes)*60).toFixed(2);
                    this.gameLog.push({
                        'games': `${this.getDate(game.gameDate)} ${this.getHomeAway(game.homeRoadFlag)} ${game.opponentAbbrev}`,
                        'decision': game.decision=='O' ? 'OTL' : game.decision,
                        'goalsAgainst': game.goalsAgainst,
                        'shotsAgainst': game.shotsAgainst,
                        'savePctg': (game.savePctg.toFixed(3)).slice(1),
                        'goalsAgainstAverage': goalsAgainstAverage,
                        'toi': game.toi,
                    });
                }
            });
        },
        getDate(dateString) {
            const dateObj = new Date(`${dateString}T00:00:00`);
            const options = {
                month: 'short',
                day: 'numeric',
                timeZone: 'America/New_York' // Set timezone to EST
            };
            return dateObj.toLocaleString('en-US', options);
        },
        getHomeAway(type) {
            if(type=='H')
                return 'vs';
            else
                return '@';
        },
    },
};
</script>

<style>
.player-season-stats {
    display: flex;
    flex-wrap: wrap;
}

.player-season-stat {
    display: flex;
    flex-direction: column;
    width: 25%;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
}

.player-stat-value {
    color: white;
    font-size: large;
}

.game-log {
    padding: 10px;
    width: 80%;
    margin-left: 10%;
}
</style>