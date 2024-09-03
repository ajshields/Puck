<template>
  <div><ProgressSpinner v-if="isLoading" /></div>
    <div>
        <div class="statistics-table-options">
            <div class="years-options">
                <Dropdown v-model="startYear" :options="years" optionLabel="label" placeholder="2023-24" @change="yearStartChange" class="options-dropdown"/>
                <Dropdown v-model="endYear" :options="years" optionLabel="label" placeholder="2023-24" @change="yearEndChange" class="options-dropdown" style="padding-left:10px"/>
            </div>
            <Dropdown v-model="selectedFranchise" :options="franchises" optionLabel="fullName" placeholder="Franchise" @change="optionChange" class="options-dropdown"/>
            <Dropdown v-model="selectedPosition" :options="positions" optionLabel="type" placeholder="Position" @change="optionChange" class="options-dropdown"/>
            <Dropdown v-model="selectedExperience" :options="experience" optionLabel="type" placeholder="Experience" @change="optionChange" class="options-dropdown"/>
        </div>
        <div>
          <DataTable :value="statistics" class="statistics-table" @sort="onSort" @row-click="goToPlayer">
            <Column field="id" class="statistics-cell" style="text-align:left;width:4%"></Column>
            <Column field="skaterFullName" header="Player" class="statistics-cell" style="text-align:left;height:40px;width:15%"></Column>
            <Column field="season" header="Season" class="statistics-cell" style="width:7%"></Column>
            <Column field="teamAbbrevs" header="Team" class="statistics-cell" style="width:4%"></Column>
            <Column field="positionCode" header="Pos" class="statistics-cell" style="width:4%"></Column>
            <Column field="gamesPlayed" header="GP" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="goals" header="G" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="assists" header="A" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="points" header="P" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="plusMinus" header="+/-" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="penaltyMinutes" header="PIM" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="pointsPerGame" header="P/GP" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="evGoals" header="EVG" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="evPoints" header="EVP" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="ppGoals" header="PPG" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="ppPoints" header="PPP" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="shGoals" header="SHG" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="shPoints" header="SHP" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="otGoals" header="OTG" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="gameWinningGoals" header="GWG" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="shots" header="S" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="shootingPct" header="S%" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="timeOnIcePerGame" header="TOI/GP" sortable class="statistics-cell" style="width:4%"></Column>
            <Column field="faceoffWinPct" header="FOW%" sortable class="statistics-cell" style="width:4%"></Column>
          </DataTable>
        </div>
        <div class="page-selection">
            <button @click="prevPage(true)">&lt;&lt;</button>
            <button @click="prevPage(false)">&lt;</button>
            <span style="font-size:large;color:#ccc">Page {{ Math.ceil(pageStart/50) }}</span>
            <button @click="nextPage(false)">&gt;</button>
            <button @click="nextPage(true)">&gt;&gt;</button>
        </div>
    </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';

export default {
    name: 'Leaders',
    components: {
      ProgressSpinner,
      DataTable,
      Column,
      Dropdown,
    },
    data() {
      return {
        isLoading: true,
        sortField: null,
        todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0], // Default to today's date
        years: [],
        startYear: {label: '2023-24', seasonId: 20232024},
        endYear: {label: '2023-24', seasonId: 20232024},
        statistics: [],
        franchises: [],
        selectedFranchise: {fullName: 'All Franchises', id: 0},
        positions: [{type: 'All Skaters', code: 'A'}, {type: 'Forwards', code: 'F'}, {type: 'Center', code: 'C'}, {type: 'Left Wing', code: 'L'}, {type: 'Right Wing', code: 'R'}, {type: 'Defenseman', code: 'D'}],
        selectedPosition: {type: 'All Skaters', code: 'A'},
        experience: [{type: 'All Experience', code: ''}, {type: 'Rookie', code: '1'}, {type: 'Regular', code: '0'}],
        selectedExperience: {type: 'All Experience', code: ''},
        pageStart: 1,
        error: null,
      };
    },
    mounted() {
        this.fetchStatistics();
        this.fetchFranchises();
        this.fetchYears();
    },
    methods: {
        async fetchStatistics() {
          try {
            this.isLoading = true;
            this.statistics = [];
            const url = '/restApi/stats/rest/en/skater/summary';
            const queryParams = new URLSearchParams({
                isAggregate: false,
                isGame: false,
                /*sort: JSON.stringify([
                    { property: 'points', direction: 'DESC' },
                    { property: 'goals', direction: 'DESC' },
                    { property: 'assists', direction: 'DESC' },
                    { property: 'playerId', direction: 'ASC' }
                ]),*/
                
                sort: JSON.stringify([
                    { property: (this.sortField ? this.sortField.sortField : 'points'), direction: (this.sortField ? this.sortField.sortOrder==1 ? 'ASC' : 'DESC' : 'DESC') },
                    ...(this.sortField ? [] : [
                        { property: 'goals', direction: 'DESC' },
                        { property: 'assists', direction: 'DESC' },
                        { property: 'playerId', direction: 'ASC' }
                    ])
                ]),
                
                start: (this.pageStart-1),
                limit: 50,
                factCayenneExp: 'gamesPlayed>=1',
                cayenneExp: `
                    ${this.selectedFranchise.id !== 0 ? `franchiseId=${this.selectedFranchise.id} and ` : ''}
                    ${this.selectedPosition.code == 'A' ? '' : this.selectedPosition.code == 'F' ? '(positionCode="L" or positionCode="R" or positionCode="C") and' : `positionCode="${this.selectedPosition.code}" and `}
                    ${this.selectedExperience.code !== '' ? `isRookie="${this.selectedExperience.code}" and ` : ''}
                    gameTypeId=2 and seasonId<=${this.endYear.seasonId} and 
                    seasonId>=${this.startYear.seasonId}`
            });
            const response = await fetch(`${url}?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.configureStatistics(data.data);
            this.isLoading = false;
          } catch (error) {
            console.error('Error fetching statistics:', error);
            alert('Error fetching statistics. See console for details.');
          }
        },
        async fetchFranchises() {
            try {
                const response = await fetch(`/restApi/stats/rest/en/franchise`, {
                  method: 'GET',
                  headers: {
                    'Cache-Control': 'no-cache',
                  },
                });
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                this.franchises = data.data;
                this.sortFranchises();
            } catch (error) {
                console.error('Error fetching franchises:', error);
                alert('Error fetching teams. See console for details.');
            }
        },
        async fetchYears() {
            try {
                this.isLoading = true;
                const response = await fetch(`/restApi/stats/rest/en/season`, {
                  method: 'GET',
                  headers: {
                    'Cache-Control': 'no-cache',
                  },
                });
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                for(let i = data.data.length-1; i >= 0; i--)
                    this.years.push({label: data.data[i].formattedSeasonId, seasonId: data.data[i].id});
            } catch (error) {
                console.error('Error fetching years:', error);
                alert('Error fetching years. See console for details.');
            }
        },
        configureStatistics(data) {
          data.forEach((player, index) => {
            const minutes = Math.floor(player.timeOnIcePerGame / 60);
            const seconds = Math.round(player.timeOnIcePerGame % 60);
            const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            player.timeOnIcePerGame = `${minutes}:${paddedSeconds}`;
            player.seasonId = player.seasonId.toString();
            this.statistics.push({
                'id': (this.pageStart+index),
                'skaterFullName': player.skaterFullName,
                'season': `${player.seasonId.slice(0, 4)}-${player.seasonId.slice(4, 8)}`,
                'teamAbbrevs': player.teamAbbrevs,
                'positionCode': player.positionCode,
                'gamesPlayed': player.gamesPlayed,
                'goals': player.goals,
                'assists': player.assists,
                'points': player.points,
                'plusMinus': player.plusMinus,
                'penaltyMinutes': player.penaltyMinutes,
                'pointsPerGame': (player.pointsPerGame).toFixed(2),
                'evGoals': player.evGoals,
                'evPoints': player.evPoints,
                'ppGoals': player.ppGoals,
                'ppPoints': player.ppPoints,
                'shGoals': player.shGoals,
                'shPoints': player.shPoints,
                'otGoals': player.otGoals,
                'gameWinningGoals': player.gameWinningGoals,
                'shots': player.shots,
                'shootingPct': (player.shootingPct*100).toFixed(1),
                'timeOnIcePerGame': player.timeOnIcePerGame,
                'faceoffWinPct': isNaN(player.faceoffWinPct) ? '' : (player.faceoffWinPct*100).toFixed(1),
                'playerId': player.playerId,
              });
          });
        },
        sortFranchises() {
            const specialIds = new Set([8, 13, 4, 2, 7, 9, 3]);
            const customSort = (a, b) => {
                const isSpecialA = specialIds.has(a.id);
                const isSpecialB = specialIds.has(b.id);
                if (isSpecialA === isSpecialB) {
                    return a.teamPlaceName.localeCompare(b.teamPlaceName);
                }
                return isSpecialA ? 1 : -1;
            };
            this.franchises.sort(customSort);
            this.franchises.unshift({fullName: 'All Franchises', id: 0});
        },
        yearStartChange(e) {
            if(e.value.seasonId > this.endYear.seasonId) {
                this.startYear = e.value;
                this.endYear = e.value;
            } else {
                this.startYear = e.value;
            }
            this.pageStart = 1;
            this.fetchStatistics()
        },
        yearEndChange(e) {
            if(e.value.seasonId < this.startYear.seasonId) {
                this.startYear = e.value;
                this.endYear = e.value;
            } else {
                this.endYear = e.value;
            }
            this.pageStart = 1;
            this.fetchStatistics()
        },
        optionChange() {
            this.pageStart = 1;
            this.fetchStatistics()
        },
        prevPage(skip) {
            if(this.pageStart!=1) {
                if(skip)
                    this.pageStart = 1;
                else
                    this.pageStart-=50;
                this.fetchStatistics();
            }
        },
        nextPage(skip) {
            if(this.statistics.length==50) {
                this.pageStart+=50;
                this.fetchStatistics();
            }
        },
        onSort(event) {
            // event.field: the field to sort
            // event.order: the sort order (-1 for descending, 1 for ascending)
            this.sortField = event;
            this.pageStart = 1;
            this.fetchStatistics();
            // Perform sorting logic here
        },
        goToPlayer(row) {
            this.$router.push({ name: 'player.season', params: { id: row.data.playerId }});
        },
    },
}
</script>

<style>
.statistics-table-options {
    width: 100%;
    margin-top: 2rem;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
}

.years-options {
    display: flex;
    justify-content: space-between;
}

.statistics-table {
    width: 100%;
    margin-top: 2rem;
}

.statistics-cell {
    border-bottom: solid;
    border-width: thin;
    border-color: #6d6d6d29;
}

.page-selection {
    display: flex;
    justify-content: center;
    align-items: center;
}

.page-selection button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 2rem;
    color: #ccc;
    padding-left: 30px;
    padding-right: 30px;
}

.options-dropdown {
    width: 200px; /* Adjust width as needed */
}

.p-dropdown-trigger {
    border: 1px solid #ccc; /* Border color */
    border-radius: 4px; /* Border radius */
    margin-top: -25px;
    margin-left: -20px;
    width: inherit;
}

.p-dropdown-trigger:hover {
    border-color: #999; /* Border color on hover */
    cursor: pointer;
}

.p-dropdown-items {
    border: 1px solid #ccc; /* Border color */
    border-radius: 0 0 4px 4px; /* Border radius */
    box-shadow: none; /* Remove shadow */
    background-color: #181818;
    max-height: 200px; /* Limit dropdown height */
    overflow-y: auto; /* Enable vertical scrolling */
    width: 100%;
    margin-left: -20px;
}

.p-dropdown-item {
    padding: 8px 12px; /* Adjust padding */
    cursor: pointer;
    margin-bottom: 0rem;
}

.p-dropdown-item:hover {
    cursor: pointer;
    background-color: var(--hover-color);
    transition: 0.2s ease;
}

.p-dropdown-label {
    cursor: pointer;
}

.p-inputtext {
    cursor: pointer;
}
</style>