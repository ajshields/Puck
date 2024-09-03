<template>
    <div><ProgressSpinner v-if="isLoading" /></div>
    <h3>Roster Stats</h3>

    <div class="roster-stats">
        <DataTable :value="goalies" :sortField="'wins'" :sortOrder="-1" @row-click="goToPlayer" tableStyle="width: 100%">
            <Column field="name" header="Goalie" sortable class="name-header" style="width:10%"></Column>
            <Column field="gamesPlayed" header="GP" sortable class="skaters-row"></Column>
            <Column field="gamesStarted" header="GS" sortable class="skaters-row"></Column>
            <Column field="wins" header="W" sortable class="skaters-row"></Column>
            <Column field="losses" header="L" sortable class="skaters-row"></Column>
            <Column field="overtimeLosses" header="OTL" sortable class="skaters-row"></Column>
            <Column field="shotsAgainst" header="SA" sortable class="skaters-row"></Column>
            <Column field="saves" header="S" sortable class="skaters-row"></Column>
            <Column field="goalsAgainst" header="GA" sortable class="skaters-row"></Column>
            <Column field="savePercentage" header="SV%" sortable class="skaters-row"></Column>
            <Column field="goalsAgainstAverage" header="GAA" sortable class="skaters-row"></Column>
            <Column field="shutouts" header="SO" sortable class="skaters-row" style="width:4%"></Column>
            <Column field="timeOnIce" header="TOI" sortable class="skaters-row"></Column>
            <Column field="goals" header="G" sortable class="skaters-row" style="width:2%"></Column>
            <Column field="assists" header="A" sortable class="skaters-row" style="width:2%"></Column>
            <Column field="points" header="P" sortable class="skaters-row" style="width:2%"></Column>
            <Column field="penaltyMinutes" header="PIM" sortable class="skaters-row" style="width:2%"></Column>
        </DataTable>
    </div>
    <div class="roster-stats">
        <DataTable :value="skaters" :sortField="'points'" :sortOrder="-1" @row-click="goToPlayer" tableStyle="width: 100%">
            <!--<Column>
                <template #body="slotProps">
                  <img v-if="slotProps.data.headshot" :src="slotProps.data.headshot" :alt="headshot" style="width:50px"/>
                </template>
            </Column>-->
            <Column field="name" header="Player" sortable class="name-header" style="width:10px"></Column>
            <Column field="positionCode" header="POS" sortable class="skaters-row" style="width:8px"></Column>
            <Column field="gamesPlayed" header="GP" sortable class="skaters-row"></Column>
            <Column field="goals" header="G" sortable class="skaters-row"></Column>
            <Column field="assists" header="A" sortable class="skaters-row"></Column>
            <Column field="points" header="P" sortable class="skaters-row"></Column>
            <Column field="plusMinus" header="+/-" sortable class="skaters-row"></Column>
            <Column field="penaltyMinutes" header="PIM" sortable class="skaters-row"></Column>
            <Column field="pointsPerGame" header="P/GP" sortable class="skaters-row"></Column>
            <Column field="evenStrengthGoals" header="EVG" sortable class="skaters-row"></Column>
            <Column field="powerPlayGoals" header="PPG" sortable class="skaters-row"></Column>
            <Column field="shorthandedGoals" header="SHG" sortable class="skaters-row"></Column>
            <Column field="overtimeGoals" header="OTG" sortable class="skaters-row"></Column>
            <Column field="gameWinningGoals" header="GWG" sortable class="skaters-row"></Column>
            <Column field="shots" header="S" sortable class="skaters-row"></Column>
            <Column field="shootingPctg" header="S%" sortable class="skaters-row"></Column>
            <Column field="avgTimeOnIcePerGame" header="TOI/G" sortable class="skaters-row"></Column>
            <Column field="faceoffWinPctg" header="FO%" sortable class="skaters-row"></Column>
        </DataTable>
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
    name: 'Roster',
    components: {
        ProgressSpinner,
        DataTable,
        Column,
    },
    props: {
        id: String,
    },
    mounted() {
        this.fetchRoster();
    },
    data() {
        return {
            isLoading: true,
            date: new Date(),
            error: null,
            skaters: [],
            goalies: [],
            allPlayers: [],
        };
    },
    methods: {
        async fetchRoster() {
            const year = this.date.getFullYear();
            const month = this.date.getMonth() + 1;
            let seasonYears;
            if (year < 2024 || (year === 2024 && month < 9))
                seasonYears = (year - 1) + '' + year;
            else
                seasonYears = year + '' + (year + 1);

            try {
                const response = await fetch(`/api/v1/club-stats/${this.id}/${seasonYears}/2`, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
          
                const data = await response.json();
                this.allPlayers = data;
                console.log(data);
                this.configureSkaters(data.skaters);
                this.configureGoalies(data.goalies);
                this.isLoading = false;
            } catch (error) {
              console.error('Error fetching scores:', error);
              alert('Error fetching scores. See console for details.');
            }
        },
        configureSkaters(skaters) {
            skaters.forEach((player) => {
                const minutes = Math.floor(player.avgTimeOnIcePerGame / 60);
                const seconds = Math.round(player.avgTimeOnIcePerGame % 60);
                const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
                player.avgTimeOnIcePerGame = `${minutes}:${paddedSeconds}`;
                this.skaters.push({
                    //'headshot': player.headshot,
                    'name': player.firstName.default+' '+player.lastName.default,
                    'positionCode': player.positionCode,
                    'gamesPlayed': player.gamesPlayed,
                    'goals': player.goals,
                    'assists': player.assists,
                    'points': player.points,
                    'plusMinus': player.plusMinus,
                    'penaltyMinutes': player.penaltyMinutes,
                    'pointsPerGame': (player.points/player.gamesPlayed).toFixed(2),
                    'evenStrengthGoals': player.goals - player.powerPlayGoals - player.shorthandedGoals,
                    'powerPlayGoals': player.powerPlayGoals,
                    'shorthandedGoals': player.shorthandedGoals,
                    'overtimeGoals': player.overtimeGoals,
                    'gameWinningGoals': player.gameWinningGoals,
                    'shots': player.shots,
                    'shootingPctg': (player.shootingPctg*100).toFixed(1),
                    'avgTimeOnIcePerGame': player.avgTimeOnIcePerGame,
                    'faceoffWinPctg': isNaN(player.faceoffWinPctg) ? '' : (player.faceoffWinPctg*100).toFixed(1),
                });
            });
        },
        configureGoalies(goalies) {
            goalies.forEach((goalie) => {
                const minutes = Math.floor(goalie.timeOnIce / 60);
                const seconds = Math.round(goalie.timeOnIce % 60);
                const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
                goalie.timeOnIce = `${minutes}:${paddedSeconds}`;
                this.goalies.push({
                    'name': goalie.firstName.default+' '+goalie.lastName.default,
                    'gamesPlayed': goalie.gamesPlayed,
                    'gamesStarted': goalie.gamesStarted,
                    'wins': goalie.wins,
                    'losses': goalie.losses,
                    'overtimeLosses': goalie.overtimeLosses,
                    'shotsAgainst': goalie.shotsAgainst,
                    'saves': goalie.saves,
                    'goalsAgainst': goalie.goalsAgainst,
                    'savePercentage': String((goalie.savePercentage).toFixed(3)).slice(1),
                    'goalsAgainstAverage': (goalie.goalsAgainstAverage).toFixed(2),
                    'shutouts': goalie.shutouts,
                    'timeOnIce': goalie.timeOnIce,
                    'goals': goalie.goals,
                    'assists': goalie.assists,
                    'points': goalie.points,
                    'penaltyMinutes': goalie.penaltyMinutes,
                });
            });
        },
        goToPlayer(row) {
            if(row.data.positionCode) {
                this.allPlayers.skaters.forEach((player) => {
                    if(row.data.name == (`${player.firstName.default} ${player.lastName.default}`))
                        this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                });
            } else {
                this.allPlayers.goalies.forEach((player) => {
                    if(row.data.name == (`${player.firstName.default} ${player.lastName.default}`))
                        this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                });
            }
        },
    },
};
</script>

<style>
.roster-stats {
    margin-top:1rem;
    color: white;
}

.skaters-row {
    width: 5%;
    height: 40px;
    border-bottom: solid;
    border-width: thin;
    border-color: #ffffff0f;
}

.name-header {
    text-align: left;
    width: 5%;
    height: 40px;
    border-bottom: solid;
    border-width: thin;
    border-color: #ffffff0f;
}

.p-datatable-thead {
  background-color: #56565636;
  vertical-align: auto;
}

/*.p-sortable-column-icon{
  display: none !important;
}*/

/*.p-highlight {
     background-color: #01c58a94;
} */
</style>