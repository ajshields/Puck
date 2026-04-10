<template>
    <div><ProgressSpinner v-if="isLoading" /></div>

    <div class="leaders-options">
      <v-button class="leaders-selector" :class="{ 'leaders-selector-selected': type === 'season' }" @click="switchStatType('season'), type='season'">Season</v-button>
      <v-button class="leaders-selector" :class="{ 'leaders-selector-selected': type === 'playoffs' }" @click="type=switchStatType('playoffs'), type='playoffs'">Playoffs</v-button>
  </div>

    <div v-if="this.points.length > 0" class="grid-container" style="margin-top: 20px">
      <!-- POINTS Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Points</h3>
          <img :src="selectedPointsInfo.picture" @click="goToPlayer(selectedPointsInfo, 'points')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedPointsInfo, 'points')" class="stat-leader-name">
            <strong>{{ selectedPointsInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedPointsInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedPointsInfo.points }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="point in points" :key="point.place" @click="handlePointsClick(point)" :class="{ 'selected-row': isSelectedPoints(point) }">
                <td>{{ point.place }}</td>
                <td class="leader-name-header">{{ point.name }}</td>
                <td>{{ point.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- GOALS Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Goals</h3>
          <img :src="selectedGoalsInfo.picture" @click="goToPlayer(selectedGoalsInfo, 'goals')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedGoalsInfo, 'goals')" class="stat-leader-name">
            <strong>{{ selectedGoalsInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedGoalsInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedGoalsInfo.goals }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="goal in goals" :key="goal.place" @click="handleGoalsClick(goal)" :class="{ 'selected-row': isSelectedGoals(goal) }">
                <td>{{ goal.place }}</td>
                <td class="leader-name-header">{{ goal.name }}</td>
                <td>{{ goal.goals }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- ASSISTS Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Assists</h3>
          <img :src="selectedAssistsInfo.picture" @click="goToPlayer(selectedAssistsInfo, 'assists')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedAssistsInfo, 'assists')" class="stat-leader-name">
            <strong>{{ selectedAssistsInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedAssistsInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedAssistsInfo.assists }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="assist in assists" :key="assist.place" @click="handleAssistsClick(assist)" :class="{ 'selected-row': isSelectedAssists(assist) }">
                <td>{{ assist.place }}</td>
                <td class="leader-name-header">{{ assist.name }}</td>
                <td>{{ assist.assists }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- PLUSMINUS Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Plus/Minus</h3>
          <img :src="selectedPlusMinusInfo.picture" @click="goToPlayer(selectedPlusMinusInfo, 'plusMinus')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedPlusMinusInfo, 'plusMinus')" class="stat-leader-name">
            <strong>{{ selectedPlusMinusInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedPlusMinusInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedPlusMinusInfo.plusMinus }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="plusminus in plusMinus" :key="plusminus.place" @click="handlePlusMinusClick(plusminus)" :class="{ 'selected-row': isSelectedPlusMinus(plusminus) }">
                <td>{{ plusminus.place }}</td>
                <td class="leader-name-header">{{ plusminus.name }}</td>
                <td>{{ plusminus.plusMinus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- PIM Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Penalty Minutes</h3>
          <img :src="selectedPenaltyMinsInfo.picture" @click="goToPlayer(selectedPenaltyMinsInfo, 'penaltyMins')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedPenaltyMinsInfo, 'penaltyMins')" class="stat-leader-name">
            <strong>{{ selectedPenaltyMinsInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedPenaltyMinsInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedPenaltyMinsInfo.penaltyMins }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="penaltyMin in penaltyMins" :key="penaltyMin.place" @click="handlePenaltyMinsClick(penaltyMin)" :class="{ 'selected-row': isSelectedPenaltyMins(penaltyMin) }">
                <td>{{ penaltyMin.place }}</td>
                <td class="leader-name-header">{{ penaltyMin.name }}</td>
                <td>{{ penaltyMin.penaltyMins }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- FACEOFF% Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Faceoff Percentage</h3>
          <img :src="selectedFaceoffsInfo.picture" @click="goToPlayer(selectedFaceoffsInfo, 'faceoffs')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedFaceoffsInfo, 'faceoffs')" class="stat-leader-name">
            <strong>{{ selectedFaceoffsInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedFaceoffsInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedFaceoffsInfo.faceoffs }}%</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="faceoff in faceoffs" :key="faceoff.place" @click="handleFaceoffsClick(faceoff)" :class="{ 'selected-row': isSelectedFaceoffs(faceoff) }">
                <td>{{ faceoff.place }}</td>
                <td class="leader-name-header">{{ faceoff.name }}</td>
                <td>{{ faceoff.faceoffs }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- WINS Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Wins</h3>
          <img :src="selectedWinsInfo.picture" @click="goToPlayer(selectedWinsInfo, 'wins')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedWinsInfo, 'wins')" class="stat-leader-name">
            <strong>{{ selectedWinsInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedWinsInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedWinsInfo.wins }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="win in wins" :key="win.place" @click="handleWinsClick(win)" :class="{ 'selected-row': isSelectedWins(win) }">
                <td>{{ win.place }}</td>
                <td class="leader-name-header">{{ win.name }}</td>
                <td>{{ win.wins }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- SHUTOUT Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Shutouts</h3>
          <img :src="selectedShutoutsInfo.picture" @click="goToPlayer(selectedShutoutsInfo, 'shutouts')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedShutoutsInfo, 'shutouts')" class="stat-leader-name">
            <strong>{{ selectedShutoutsInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedShutoutsInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedShutoutsInfo.shutouts }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="shutout in shutouts" :key="shutout.place" @click="handleShutoutsClick(shutout)" :class="{ 'selected-row': isSelectedShutouts(shutout) }">
                <td>{{ shutout.place }}</td>
                <td class="leader-name-header">{{ shutout.name }}</td>
                <td>{{ shutout.shutouts }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- SV% Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Save Percentage</h3>
          <img :src="selectedSavePctgsInfo.picture" @click="goToPlayer(selectedSavePctgsInfo, 'savePctgs')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedSavePctgsInfo, 'savePctgs')" class="stat-leader-name">
            <strong>{{ selectedSavePctgsInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedSavePctgsInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedSavePctgsInfo.savePctgs }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="savePctg in savePctgs" :key="savePctg.place" @click="handleSavePctgsClick(savePctg)" :class="{ 'selected-row': isSelectedSavePctgs(savePctg) }">
                <td>{{ savePctg.place }}</td>
                <td class="leader-name-header">{{ savePctg.name }}</td>
                <td>{{ savePctg.savePctgs }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- GAA Leaders -->
      <div class="grid-item">
        <div class="left-section">
          <h3 class="stat-header">Goals Against Average</h3>
          <img :src="selectedGoalsAgainstAveragesInfo.picture" @click="goToPlayer(selectedGoalsAgainstAveragesInfo, 'goalsAgainstAverages')" alt="Player" class="player-picture"/>
          <div @click="goToPlayer(selectedGoalsAgainstAveragesInfo, 'goalsAgainstAverages')" class="stat-leader-name">
            <strong>{{ selectedGoalsAgainstAveragesInfo.name }}</strong>
          </div>
          <div class="datatable-container">
            <DataTable :value="selectedGoalsAgainstAveragesInfo.info" class="custom-datatable">
              <Column style="width: 25%">
                <template #body="slotProps">
                  <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-leaders"/>
                </template>
              </Column>
              <Column field="team" style="width: 25%"></Column>
              <Column field="number" style="width: 25%"></Column>
              <Column field="position" style="width: 10%"></Column>
            </DataTable>
          </div>
          <!-- Space -->
          <div v-if="(!isMobile())" style="margin-bottom: 20px;"></div>
          <div class="stat-leader-value">
            <strong>{{ selectedGoalsAgainstAveragesInfo.goalsAgainstAverages }}</strong>
          </div>
        </div>
        <div class="right-section">
          <table>
            <tbody>
              <tr v-for="goalsAgainstAverage in goalsAgainstAverages" :key="goalsAgainstAverage.place" @click="handleGoalsAgainstAveragesClick(goalsAgainstAverage)" :class="{ 'selected-row': isSelectedGoalsAgainstAverages(goalsAgainstAverage) }">
                <td>{{ goalsAgainstAverage.place }}</td>
                <td class="leader-name-header">{{ goalsAgainstAverage.name }}</td>
                <td>{{ goalsAgainstAverage.goalsAgainstAverages }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <strong>No Data Available</strong>
    </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { fetchApi } from '@/services/fetchApi';

export default {
  name: 'Leaders',
  components: {
    ProgressSpinner,
    DataTable,
    Column,
  },
  data() {
    return {
      isLoading: true,
      pageTitle: 'Leaders',
      currentView: 'leaders', // Default view
      todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0], // Default to today's date
      seasonYear: '',
      type: 'season',
      points: [], //used to display top ten players on screen
      pointsData: [], //holds all data for top points players
      selectedPoints: null, //for row select
      selectedPointsInfo: {picture: null, name: null, info: [], points: null}, //holds info for selected player info
      goals: [],
      goalsData: [],
      selectedGoals: null,
      selectedGoalsInfo: {picture: null, name: null, info: [], goals: null},
      assists: [],
      assistsData: [],
      selectedAssists: null,
      selectedAssistsInfo: {picture: null, name: null, info: [], assists: null},
      plusMinus: [],
      plusMinusData: [],
      selectedPlusMinus: null,
      selectedPlusMinusInfo: {picture: null, name: null, info: [], plusMinus: null},
      penaltyMins: [],
      penaltyMinsData: [],
      selectedPenaltyMins: null,
      selectedPenaltyMinsInfo: {picture: null, name: null, info: [], penaltyMins: null},
      faceoffs: [],
      faceoffsData: [],
      selectedFaceoffs: null,
      selectedFaceoffsInfo: {picture: null, name: null, info: [], faceoffs: null},
      wins: [],
      winsData: [],
      selectedWins: null,
      selectedWinsInfo: {picture: null, name: null, info: [], wins: null},
      shutouts: [],
      shutoutsData: [],
      selectedShutouts: null,
      selectedShutoutsInfo: {picture: null, name: null, info: [], shutouts: null},
      savePctgs: [],
      savePctgsData: [],
      selectedSavePctgs: null,
      selectedSavePctgsInfo: {picture: null, name: null, info: [], savePctgs: null},
      goalsAgainstAverages: [],
      goalsAgainstAveragesData: [],
      selectedGoalsAgainstAverages: null,
      selectedGoalsAgainstAveragesInfo: {picture: null, name: null, info: [], goalsAgainstAverages: null},
      error: null,
    };
  },
  mounted() {
    this.getYears();
    this.fetchPoints();
    this.fetchGoals();
    this.fetchAssists();
    this.fetchPlusMinus();
    this.fetchPenaltyMins();
    this.fetchFaceoffs();
    this.fetchWins();
    this.fetchShutouts();
    this.fetchSavePctgs();
    this.fetchGoalsAgainstAverages();
  },
  methods: {
    isMobile() {
      return window.innerWidth <= 640;
    },
    //LEADERS METHODS
    async fetchPoints() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/skater-stats-leaders/${this.seasonYears}/${statsType}?categories=points&limit=10`);
        const data = await response.json();
        this.pointsData = data;
        this.configurePoints(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchGoals() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/skater-stats-leaders/${this.seasonYears}/${statsType}?categories=goals&limit=10`);
        const data = await response.json();
        this.goalsData = data;
        this.configureGoals(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchAssists() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/skater-stats-leaders/${this.seasonYears}/${statsType}?categories=assists&limit=10`);
        const data = await response.json();
        this.assistsData = data;
        this.configureAssists(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchPlusMinus() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/skater-stats-leaders/${this.seasonYears}/${statsType}?categories=plusMinus&limit=10`);
        const data = await response.json();
        this.plusMinusData = data;
        this.configurePlusMinus(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchPenaltyMins() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/skater-stats-leaders/${this.seasonYears}/${statsType}?categories=penaltyMins&limit=10`);
        const data = await response.json();
        this.penaltyMinsData = data;
        this.configurePenaltyMins(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchFaceoffs() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/skater-stats-leaders/${this.seasonYears}/${statsType}?categories=faceoffLeaders&limit=10`);
        const data = await response.json();
        this.faceoffsData = data;
        this.configureFaceoffs(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchWins() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/goalie-stats-leaders/${this.seasonYears}/${statsType}?categories=wins&limit=10`);
        const data = await response.json();
        this.winsData = data;
        this.configureWins(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchShutouts() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/goalie-stats-leaders/${this.seasonYears}/${statsType}?categories=shutouts&limit=10`);
        const data = await response.json();
        this.shutoutsData = data;
        this.configureShutouts(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchSavePctgs() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/goalie-stats-leaders/${this.seasonYears}/${statsType}?categories=savePctg&limit=10`);
        const data = await response.json();
        this.savePctgsData = data;
        this.configureSavePctgs(data);
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    async fetchGoalsAgainstAverages() {
      let statsType = 2;
      if(this.type=='playoffs')
        statsType = 3;
      try {
        const response = await fetchApi(`/api/v1/goalie-stats-leaders/${this.seasonYears}/${statsType}?categories=goalsAgainstAverage&limit=10`);
        const data = await response.json();
        this.goalsAgainstAveragesData = data;
        this.configureGoalsAgainstAverages(data);
        this.isLoading = false;
      } catch (error) {
        //console.error('Error fetching teams:', error);
        //alert('Error fetching teams. See console for details.');
      }
    },
    changeView(view) {
      this.currentView = view;
    },
    switchStatType(statType) {
      this.type = statType;
      this.fetchPoints();
      this.fetchGoals();
      this.fetchAssists();
      this.fetchPlusMinus();
      this.fetchPenaltyMins();
      this.fetchFaceoffs();
      this.fetchWins();
      this.fetchShutouts();
      this.fetchSavePctgs();
      this.fetchGoalsAgainstAverages();
    },
    getYears() {
      //season years
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
      this.seasonYears = `${currentYear}${nextYear}`;
    },
    configurePoints(pointsList) {
      this.points = [];
      this.selectedPoints = null;
      this.selectedPointsInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < pointsList.points.length;  i++) {
        this.points.push({"place": (i+1), "name": (pointsList.points[i].firstName.default+" "+pointsList.points[i].lastName.default), "points": pointsList.points[i].value});
      }
      this.selectedPoints = this.points.length > 0 ? this.points[0] : null,
      this.selectedPointsInfo.picture = this.pointsData.points[0].headshot;
      this.selectedPointsInfo.info.push({"teamLogo": this.pointsData.points[0].teamLogo, "team": this.pointsData.points[0].teamAbbrev, "number": ("#"+(this.pointsData.points[0].sweaterNumber)), "position": this.pointsData.points[0].position});
      this.selectedPointsInfo.name = this.pointsData.points[0].firstName.default+" "+this.pointsData.points[0].lastName.default;
      this.selectedPointsInfo.points = this.pointsData.points[0].value;
    },
    configureGoals(goalsList) {
      this.goals = [];
      this.selectedGoals = null;
      this.selectedGoalsInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < goalsList.goals.length;  i++) {
        this.goals.push({"place": (i+1), "name": (goalsList.goals[i].firstName.default+" "+goalsList.goals[i].lastName.default), "goals": goalsList.goals[i].value});
      }
      this.selectedGoals = this.goals.length > 0 ? this.goals[0] : null,
      this.selectedGoalsInfo.picture = this.goalsData.goals[0].headshot;
      this.selectedGoalsInfo.info.push({"teamLogo": this.goalsData.goals[0].teamLogo, "team": this.goalsData.goals[0].teamAbbrev, "number": ("#"+(this.goalsData.goals[0].sweaterNumber)), "position": this.goalsData.goals[0].position});
      this.selectedGoalsInfo.name = this.goalsData.goals[0].firstName.default+" "+this.goalsData.goals[0].lastName.default;
      this.selectedGoalsInfo.goals = this.goalsData.goals[0].value;
    },
    configureAssists(assistsList) {
      this.assists = [];
      this.selectedAssists = null;
      this.selectedAssistsInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < assistsList.assists.length;  i++) {
        this.assists.push({"place": (i+1), "name": (assistsList.assists[i].firstName.default+" "+assistsList.assists[i].lastName.default), "assists": assistsList.assists[i].value});
      }
      this.selectedAssists = this.assists.length > 0 ? this.assists[0] : null,
      this.selectedAssistsInfo.picture = this.assistsData.assists[0].headshot;
      this.selectedAssistsInfo.info.push({"teamLogo": this.assistsData.assists[0].teamLogo, "team": this.assistsData.assists[0].teamAbbrev, "number": ("#"+(this.assistsData.assists[0].sweaterNumber)), "position": this.assistsData.assists[0].position});
      this.selectedAssistsInfo.name = this.assistsData.assists[0].firstName.default+" "+this.assistsData.assists[0].lastName.default;
      this.selectedAssistsInfo.assists = this.assistsData.assists[0].value;
    },
    configurePlusMinus(plusMinusList) {
      this.plusMinus = [];
      this.selectedPlusMinus = null;
      this.selectedPlusMinusInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < plusMinusList.plusMinus.length;  i++) {
        this.plusMinus.push({"place": (i+1), "name": (plusMinusList.plusMinus[i].firstName.default+" "+plusMinusList.plusMinus[i].lastName.default), "plusMinus": plusMinusList.plusMinus[i].value});
      }
      this.selectedPlusMinus = this.plusMinus.length > 0 ? this.plusMinus[0] : null,
      this.selectedPlusMinusInfo.picture = this.plusMinusData.plusMinus[0].headshot;
      this.selectedPlusMinusInfo.info.push({"teamLogo": this.plusMinusData.plusMinus[0].teamLogo, "team": this.plusMinusData.plusMinus[0].teamAbbrev, "number": ("#"+(this.plusMinusData.plusMinus[0].sweaterNumber)), "position": this.plusMinusData.plusMinus[0].position});
      this.selectedPlusMinusInfo.name = this.plusMinusData.plusMinus[0].firstName.default+" "+this.plusMinusData.plusMinus[0].lastName.default;
      this.selectedPlusMinusInfo.plusMinus = this.plusMinusData.plusMinus[0].value;
    },
    configurePenaltyMins(penaltyMinsList) {
      this.penaltyMins = [];
      this.selectedPenaltyMins = null;
      this.selectedPenaltyMinsInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < penaltyMinsList.penaltyMins.length;  i++) {
        this.penaltyMins.push({"place": (i+1), "name": (penaltyMinsList.penaltyMins[i].firstName.default+" "+penaltyMinsList.penaltyMins[i].lastName.default), "penaltyMins": penaltyMinsList.penaltyMins[i].value});
      }
      this.selectedPenaltyMins = this.penaltyMins.length > 0 ? this.penaltyMins[0] : null,
      this.selectedPenaltyMinsInfo.picture = this.penaltyMinsData.penaltyMins[0].headshot;
      this.selectedPenaltyMinsInfo.info.push({"teamLogo": this.penaltyMinsData.penaltyMins[0].teamLogo, "team": this.penaltyMinsData.penaltyMins[0].teamAbbrev, "number": ("#"+(this.penaltyMinsData.penaltyMins[0].sweaterNumber)), "position": this.penaltyMinsData.penaltyMins[0].position});
      this.selectedPenaltyMinsInfo.name = this.penaltyMinsData.penaltyMins[0].firstName.default+" "+this.penaltyMinsData.penaltyMins[0].lastName.default;
      this.selectedPenaltyMinsInfo.penaltyMins = this.penaltyMinsData.penaltyMins[0].value;
    },
    configureFaceoffs(faceoffsList) {
      this.faceoffs = [];
      this.selectedFaceoffs = null;
      this.selectedFaceoffsInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < faceoffsList.faceoffLeaders.length;  i++) {
        this.faceoffs.push({"place": (i+1), "name": (faceoffsList.faceoffLeaders[i].firstName.default+" "+faceoffsList.faceoffLeaders[i].lastName.default), "faceoffs": (faceoffsList.faceoffLeaders[i].value*100).toFixed(1)});
      }
      this.selectedFaceoffs = this.faceoffs.length > 0 ? this.faceoffs[0] : null,
      this.selectedFaceoffsInfo.picture = this.faceoffsData.faceoffLeaders[0].headshot;
      this.selectedFaceoffsInfo.info.push({"teamLogo": this.faceoffsData.faceoffLeaders[0].teamLogo, "team": this.faceoffsData.faceoffLeaders[0].teamAbbrev, "number": ("#"+(this.faceoffsData.faceoffLeaders[0].sweaterNumber)), "position": this.faceoffsData.faceoffLeaders[0].position});
      this.selectedFaceoffsInfo.name = this.faceoffsData.faceoffLeaders[0].firstName.default+" "+this.faceoffsData.faceoffLeaders[0].lastName.default;
      this.selectedFaceoffsInfo.faceoffs = (this.faceoffsData.faceoffLeaders[0].value*100).toFixed(1);
    },
    configureWins(winsList) {
      this.wins = [];
      this.selectedWins = null;
      this.selectedWinsInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < winsList.wins.length;  i++) {
        this.wins.push({"place": (i+1), "name": (winsList.wins[i].firstName.default+" "+winsList.wins[i].lastName.default), "wins": winsList.wins[i].value});
      }
      this.selectedWins = this.wins.length > 0 ? this.wins[0] : null,
      this.selectedWinsInfo.picture = this.winsData.wins[0].headshot;
      this.selectedWinsInfo.info.push({"teamLogo": this.winsData.wins[0].teamLogo, "team": this.winsData.wins[0].teamAbbrev, "number": ("#"+(this.winsData.wins[0].sweaterNumber)), "position": this.winsData.wins[0].position});
      this.selectedWinsInfo.name = this.winsData.wins[0].firstName.default+" "+this.winsData.wins[0].lastName.default;
      this.selectedWinsInfo.wins = this.winsData.wins[0].value;
    },
    configureShutouts(shutoutsList) {
      this.shutouts = [];
      this.selectedShutouts = null;
      this.selectedShutoutsInfo = {picture: null, name: null, info: [], points: null};
      if(shutoutsList.shutouts) {
        for(let i = 0; i < shutoutsList.shutouts.length;  i++) {
          this.shutouts.push({"place": (i+1), "name": (shutoutsList.shutouts[i].firstName.default+" "+shutoutsList.shutouts[i].lastName.default), "shutouts": shutoutsList.shutouts[i].value});
        }
        this.selectedShutouts = this.shutouts.length > 0 ? this.shutouts[0] : null,
        this.selectedShutoutsInfo.picture = this.shutoutsData.shutouts[0].headshot;
        this.selectedShutoutsInfo.info.push({"teamLogo": this.shutoutsData.shutouts[0].teamLogo, "team": this.shutoutsData.shutouts[0].teamAbbrev, "number": ("#"+(this.shutoutsData.shutouts[0].sweaterNumber)), "position": this.shutoutsData.shutouts[0].position});
        this.selectedShutoutsInfo.name = this.shutoutsData.shutouts[0].firstName.default+" "+this.shutoutsData.shutouts[0].lastName.default;
        this.selectedShutoutsInfo.shutouts = this.shutoutsData.shutouts[0].value;
      }
    },
    configureSavePctgs(savePctgsList) {
      this.savePctgs = [];
      this.selectedSavePctgs = null;
      this.selectedSavePctgsInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < savePctgsList.savePctg.length;  i++) {
        this.savePctgs.push({"place": (i+1), "name": (savePctgsList.savePctg[i].firstName.default+" "+savePctgsList.savePctg[i].lastName.default), "savePctgs": String((savePctgsList.savePctg[i].value).toFixed(3)).slice(1)});
      }
      this.selectedSavePctgs = this.savePctgs.length > 0 ? this.savePctgs[0] : null,
      this.selectedSavePctgsInfo.picture = this.savePctgsData.savePctg[0].headshot;
      this.selectedSavePctgsInfo.info.push({"teamLogo": this.savePctgsData.savePctg[0].teamLogo, "team": this.savePctgsData.savePctg[0].teamAbbrev, "number": ("#"+(this.savePctgsData.savePctg[0].sweaterNumber)), "position": this.savePctgsData.savePctg[0].position});
      this.selectedSavePctgsInfo.name = this.savePctgsData.savePctg[0].firstName.default+" "+this.savePctgsData.savePctg[0].lastName.default;
      this.selectedSavePctgsInfo.savePctgs = String((this.savePctgsData.savePctg[0].value).toFixed(3)).slice(1);
    },
    configureGoalsAgainstAverages(goalsAgainstAveragesList) {
      this.goalsAgainstAverages = [];
      this.selectedGoalsAgainstAverages = null;
      this.selectedGoalsAgainstAveragesInfo = {picture: null, name: null, info: [], points: null};
      for(let i = 0; i < goalsAgainstAveragesList.goalsAgainstAverage.length;  i++) {
        this.goalsAgainstAverages.push({"place": (i+1), "name": (goalsAgainstAveragesList.goalsAgainstAverage[i].firstName.default+" "+goalsAgainstAveragesList.goalsAgainstAverage[i].lastName.default), "goalsAgainstAverages": (goalsAgainstAveragesList.goalsAgainstAverage[i].value).toFixed(2)});
      }
      this.selectedGoalsAgainstAverages = this.goalsAgainstAverages.length > 0 ? this.goalsAgainstAverages[0] : null,
      this.selectedGoalsAgainstAveragesInfo.picture = this.goalsAgainstAveragesData.goalsAgainstAverage[0].headshot;
      this.selectedGoalsAgainstAveragesInfo.info.push({"teamLogo": this.goalsAgainstAveragesData.goalsAgainstAverage[0].teamLogo, "team": this.goalsAgainstAveragesData.goalsAgainstAverage[0].teamAbbrev, "number": ("#"+(this.goalsAgainstAveragesData.goalsAgainstAverage[0].sweaterNumber)), "position": this.goalsAgainstAveragesData.goalsAgainstAverage[0].position});
      this.selectedGoalsAgainstAveragesInfo.name = this.goalsAgainstAveragesData.goalsAgainstAverage[0].firstName.default+" "+this.goalsAgainstAveragesData.goalsAgainstAverage[0].lastName.default;
      this.selectedGoalsAgainstAveragesInfo.goalsAgainstAverages = (this.goalsAgainstAveragesData.goalsAgainstAverage[0].value).toFixed(2);
    },
    handlePointsClick(point) {
      this.selectedPoints = point;
      this.selectedPointsInfo.info = [];
      this.selectedPointsInfo.picture = this.pointsData.points[(point.place-1)].headshot;
      this.selectedPointsInfo.info.push({"teamLogo": this.pointsData.points[(point.place-1)].teamLogo, "team": this.pointsData.points[(point.place-1)].teamAbbrev, "number": ("#"+(this.pointsData.points[(point.place-1)].sweaterNumber)), "position": this.pointsData.points[(point.place-1)].position});
      this.selectedPointsInfo.name = this.pointsData.points[(point.place-1)].firstName.default+" "+this.pointsData.points[(point.place-1)].lastName.default;
      this.selectedPointsInfo.points = this.pointsData.points[(point.place-1)].value;
    },
    handleGoalsClick(goal) {
      this.selectedGoals = goal;
      this.selectedGoalsInfo.info = [];
      this.selectedGoalsInfo.picture = this.goalsData.goals[(goal.place-1)].headshot;
      this.selectedGoalsInfo.info.push({"teamLogo": this.goalsData.goals[(goal.place-1)].teamLogo, "team": this.goalsData.goals[(goal.place-1)].teamAbbrev, "number": ("#"+(this.goalsData.goals[(goal.place-1)].sweaterNumber)), "position": this.goalsData.goals[(goal.place-1)].position});
      this.selectedGoalsInfo.name = this.goalsData.goals[(goal.place-1)].firstName.default+" "+this.goalsData.goals[(goal.place-1)].lastName.default;
      this.selectedGoalsInfo.goals = this.goalsData.goals[(goal.place-1)].value;
    },
    handleAssistsClick(assist) {
      this.selectedAssists = assist;
      this.selectedAssistsInfo.info = [];
      this.selectedAssistsInfo.picture = this.assistsData.assists[(assist.place-1)].headshot;
      this.selectedAssistsInfo.info.push({"teamLogo": this.assistsData.assists[(assist.place-1)].teamLogo, "team": this.assistsData.assists[(assist.place-1)].teamAbbrev, "number": ("#"+(this.assistsData.assists[(assist.place-1)].sweaterNumber)), "position": this.assistsData.assists[(assist.place-1)].position});
      this.selectedAssistsInfo.name = this.assistsData.assists[(assist.place-1)].firstName.default+" "+this.assistsData.assists[(assist.place-1)].lastName.default;
      this.selectedAssistsInfo.assists = this.assistsData.assists[(assist.place-1)].value;
    },
    handlePlusMinusClick(plusminus) {
      this.selectedPlusMinus = plusminus;
      this.selectedPlusMinusInfo.info = [];
      this.selectedPlusMinusInfo.picture = this.plusMinusData.plusMinus[(plusminus.place-1)].headshot;
      this.selectedPlusMinusInfo.info.push({"teamLogo": this.plusMinusData.plusMinus[(plusminus.place-1)].teamLogo, "team": this.plusMinusData.plusMinus[(plusminus.place-1)].teamAbbrev, "number": ("#"+(this.plusMinusData.plusMinus[(plusminus.place-1)].sweaterNumber)), "position": this.plusMinusData.plusMinus[(plusminus.place-1)].position});
      this.selectedPlusMinusInfo.name = this.plusMinusData.plusMinus[(plusminus.place-1)].firstName.default+" "+this.plusMinusData.plusMinus[(plusminus.place-1)].lastName.default;
      this.selectedPlusMinusInfo.plusMinus = this.plusMinusData.plusMinus[(plusminus.place-1)].value;
    },
    handlePenaltyMinsClick(penaltyMin) {
      this.selectedPenaltyMins = penaltyMin;
      this.selectedPenaltyMinsInfo.info = [];
      this.selectedPenaltyMinsInfo.picture = this.penaltyMinsData.penaltyMins[(penaltyMin.place-1)].headshot;
      this.selectedPenaltyMinsInfo.info.push({"teamLogo": this.penaltyMinsData.penaltyMins[(penaltyMin.place-1)].teamLogo, "team": this.penaltyMinsData.penaltyMins[(penaltyMin.place-1)].teamAbbrev, "number": ("#"+(this.penaltyMinsData.penaltyMins[(penaltyMin.place-1)].sweaterNumber)), "position": this.penaltyMinsData.penaltyMins[(penaltyMin.place-1)].position});
      this.selectedPenaltyMinsInfo.name = this.penaltyMinsData.penaltyMins[(penaltyMin.place-1)].firstName.default+" "+this.penaltyMinsData.penaltyMins[(penaltyMin.place-1)].lastName.default;
      this.selectedPenaltyMinsInfo.penaltyMins = this.penaltyMinsData.penaltyMins[(penaltyMin.place-1)].value;
    },
    handleFaceoffsClick(faceoff) {
      this.selectedFaceoffs = faceoff;
      this.selectedFaceoffsInfo.info = [];
      this.selectedFaceoffsInfo.picture = this.faceoffsData.faceoffLeaders[(faceoff.place-1)].headshot;
      this.selectedFaceoffsInfo.info.push({"teamLogo": this.faceoffsData.faceoffLeaders[(faceoff.place-1)].teamLogo, "team": this.faceoffsData.faceoffLeaders[(faceoff.place-1)].teamAbbrev, "number": ("#"+(this.faceoffsData.faceoffLeaders[(faceoff.place-1)].sweaterNumber)), "position": this.faceoffsData.faceoffLeaders[(faceoff.place-1)].position});
      this.selectedFaceoffsInfo.name = this.faceoffsData.faceoffLeaders[(faceoff.place-1)].firstName.default+" "+this.faceoffsData.faceoffLeaders[(faceoff.place-1)].lastName.default;
      this.selectedFaceoffsInfo.faceoffs = (this.faceoffsData.faceoffLeaders[(faceoff.place-1)].value*100).toFixed(1);
    },
    handleWinsClick(win) {
      this.selectedWins = win;
      this.selectedWinsInfo.info = [];
      this.selectedWinsInfo.picture = this.winsData.wins[(win.place-1)].headshot;
      this.selectedWinsInfo.info.push({"teamLogo": this.winsData.wins[(win.place-1)].teamLogo, "team": this.winsData.wins[(win.place-1)].teamAbbrev, "number": ("#"+(this.winsData.wins[(win.place-1)].sweaterNumber)), "position": this.winsData.wins[(win.place-1)].position});
      this.selectedWinsInfo.name = this.winsData.wins[(win.place-1)].firstName.default+" "+this.winsData.wins[(win.place-1)].lastName.default;
      this.selectedWinsInfo.wins = this.winsData.wins[(win.place-1)].value;
    },
    handleShutoutsClick(shutout) {
      this.selectedShutouts = shutout;
      this.selectedShutoutsInfo.info = [];
      this.selectedShutoutsInfo.picture = this.shutoutsData.shutouts[(shutout.place-1)].headshot;
      this.selectedShutoutsInfo.info.push({"teamLogo": this.shutoutsData.shutouts[(shutout.place-1)].teamLogo, "team": this.shutoutsData.shutouts[(shutout.place-1)].teamAbbrev, "number": ("#"+(this.shutoutsData.shutouts[(shutout.place-1)].sweaterNumber)), "position": this.shutoutsData.shutouts[(shutout.place-1)].position});
      this.selectedShutoutsInfo.name = this.shutoutsData.shutouts[(shutout.place-1)].firstName.default+" "+this.shutoutsData.shutouts[(shutout.place-1)].lastName.default;
      this.selectedShutoutsInfo.shutouts = this.shutoutsData.shutouts[(shutout.place-1)].value;
    },
    handleSavePctgsClick(savePctg) {
      this.selectedSavePctgs = savePctg;
      this.selectedSavePctgsInfo.info = [];
      this.selectedSavePctgsInfo.picture = this.savePctgsData.savePctg[(savePctg.place-1)].headshot;
      this.selectedSavePctgsInfo.info.push({"teamLogo": this.savePctgsData.savePctg[(savePctg.place-1)].teamLogo, "team": this.savePctgsData.savePctg[(savePctg.place-1)].teamAbbrev, "number": ("#"+(this.savePctgsData.savePctg[(savePctg.place-1)].sweaterNumber)), "position": this.savePctgsData.savePctg[(savePctg.place-1)].position});
      this.selectedSavePctgsInfo.name = this.savePctgsData.savePctg[(savePctg.place-1)].firstName.default+" "+this.savePctgsData.savePctg[(savePctg.place-1)].lastName.default;
      this.selectedSavePctgsInfo.savePctgs = String((this.savePctgsData.savePctg[(savePctg.place-1)].value).toFixed(3)).slice(1);
    },
    handleGoalsAgainstAveragesClick(goalsAgainstAverage) {
      this.selectedGoalsAgainstAverages = goalsAgainstAverage;
      this.selectedGoalsAgainstAveragesInfo.info = [];
      this.selectedGoalsAgainstAveragesInfo.picture = this.goalsAgainstAveragesData.goalsAgainstAverage[(goalsAgainstAverage.place-1)].headshot;
      this.selectedGoalsAgainstAveragesInfo.info.push({"teamLogo": this.goalsAgainstAveragesData.goalsAgainstAverage[(goalsAgainstAverage.place-1)].teamLogo, "team": this.goalsAgainstAveragesData.goalsAgainstAverage[(goalsAgainstAverage.place-1)].teamAbbrev, "number": ("#"+(this.goalsAgainstAveragesData.goalsAgainstAverage[(goalsAgainstAverage.place-1)].sweaterNumber)), "position": this.goalsAgainstAveragesData.goalsAgainstAverage[(goalsAgainstAverage.place-1)].position});
      this.selectedGoalsAgainstAveragesInfo.name = this.goalsAgainstAveragesData.goalsAgainstAverage[(goalsAgainstAverage.place-1)].firstName.default+" "+this.goalsAgainstAveragesData.goalsAgainstAverage[(goalsAgainstAverage.place-1)].lastName.default;
      this.selectedGoalsAgainstAveragesInfo.goalsAgainstAverages = (this.goalsAgainstAveragesData.goalsAgainstAverage[(goalsAgainstAverage.place-1)].value).toFixed(2);
    },
    isSelectedPoints(point) {
      return this.selectedPoints && this.selectedPoints.place === point.place; //return true/false if these two equal point.place
    },
    isSelectedGoals(goal) {
      return this.selectedGoals && this.selectedGoals.place === goal.place; //return true/false if these two equal point.place
    },
    isSelectedAssists(assist) {
      return this.selectedAssists && this.selectedAssists.place === assist.place; //return true/false if these two equal point.place
    },
    isSelectedPlusMinus(plusminus) {
      return this.selectedPlusMinus && this.selectedPlusMinus.place === plusminus.place; //return true/false if these two equal point.place
    },
    isSelectedPenaltyMins(penaltyMin) {
      return this.selectedPenaltyMins && this.selectedPenaltyMins.place === penaltyMin.place; //return true/false if these two equal point.place
    },
    isSelectedFaceoffs(faceoff) {
      return this.selectedFaceoffs && this.selectedFaceoffs.place === faceoff.place; //return true/false if these two equal point.place
    },
    isSelectedWins(win) {
      return this.selectedWins && this.selectedWins.place === win.place; //return true/false if these two equal point.place
    },
    isSelectedShutouts(shutout) {
      return this.selectedShutouts && this.selectedShutouts.place === shutout.place; //return true/false if these two equal point.place
    },
    isSelectedSavePctgs(savePctg) {
      return this.selectedSavePctgs && this.selectedSavePctgs.place === savePctg.place; //return true/false if these two equal point.place
    },
    isSelectedGoalsAgainstAverages(goalsAgainstAverage) {
      return this.selectedGoalsAgainstAverages && this.selectedGoalsAgainstAverages.place === goalsAgainstAverage.place; //return true/false if these two equal point.place
    },
    goToPlayer(selectedPlayer, statType) {
        switch(statType) {
            case 'points':
                this.pointsData.points.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'goals':
                this.goalsData.goals.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'assists':
                this.assistsData.assists.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'plusMinus':
                this.plusMinusData.plusMinus.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'penaltyMins':
                this.penaltyMinsData.penaltyMins.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'faceoffs':
                this.faceoffsData.faceoffLeaders.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'wins':
                this.winsData.wins.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'shutouts':
                this.shutoutsData.shutouts.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'savePctgs':
                this.savePctgsData.savePctg.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            case 'goalsAgainstAverages':
                this.goalsAgainstAveragesData.goalsAgainstAverage.forEach((player) => {
                    if(selectedPlayer.name == `${player.firstName.default} ${player.lastName.default}`)
                        this.$router.push({ name: 'player.season', params: { id: player.id }});
                });
            default:
                break;
        }
    },
  },
};
</script>

<style>
.leaders-options {
    display: flex;
    justify-content: center;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 8px;
    margin-top: 1rem;
}

.leaders-selector {
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

.leaders-selector:hover {
    background-color: var(--main-color);
    color: black;
}

.leaders-selector-selected {
    background-color: var(--main-color);
    color: black;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns with equal width */
  gap: 20px; /* Adjust as needed for spacing between items */
}

.grid-item {
  /* Style for each grid item */
  display: flex;
  border: 1px solid #ddd; /* Example border */
  border-radius: 20px;
  padding: 20px; /* Example padding */
  margin-top: 40px;
}

.stat-header {
  margin-top: -50px;
  color: var(--link-color);
  font-size: x-large;
}

.stat-leader-name {
  font-size: x-large;
  color: white;
  cursor: pointer;
}

.stat-leader-value {
  font-size: xxx-large;
  color: white;
}

.left-section {
  /* Style for the right section */
  width: 50%;
  flex: 1; /* Takes up remaining vertical space */
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center horizontally */
}

/* Add this style for the left section */
.datatable-container {
  max-width: 100%; /* Adjust based on your design */
  width: 100%;
  overflow: auto;
}

/* Add this style for the DataTable */
.custom-datatable {
  width: 100%;
}

.right-section {
  /* Style for the right section */
  width: 50%;
  flex: 1; /* Takes up remaining vertical space */
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center horizontally */
}

.leader-name-header {
  text-align: left;
}

.player-picture {
  max-width: 50%;
  height: auto;
  cursor: pointer;
}

.team-logo-leaders{
  width: 38px; /* Adjust the width of the logo as needed */
  height: 24px; /* Adjust the height of the logo as needed */
}

/* Add the following styles to center the DataTable within the right section */
.right-section .p-datatable {
  max-width: 100%;
  width: 100%;
}

.right-section .p-datatable .p-datatable-scrollable-wrapper {
  width: 100%;
  overflow: auto;
}

.right-section table {
  border-collapse: collapse;
  width: 80%;
  margin: 1px;
}

/* Style for each row in the table */
.right-section table tbody tr {
  cursor: pointer; /* Show pointer cursor on hover */
}

/* Add this style for selected row */
.selected-row {
  background-color: var(--hover-color);
  color: white;
  /*border: solid;
  border-width: thin;
  border-radius: 5px;
  border-color: #01c58a94;*/
}

/* Add this style for row hover effect */
tr:hover {
  cursor: pointer;
  background-color: var(--hover-color);
  color: white;
  /*border: solid;
  border-width: thin;
  border-radius: 5px;
  border-color: #01c58a94;*/
}

/* Mobile Device Styling */
@media (max-width: 640px) {
  .custom-datatable .p-datatable-table {
    width: 100%;
    font-size: small;
  }
  .grid-container {
    grid-template-columns: auto;
  }
  .grid-item {
    flex-direction: column;
  }
  .left-section {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .player-picture {
    max-width: 20%;
  }
  .right-section {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
  }
  .stat-header {
    font-size: larger;
  }
  .stat-leader-name {
    font-size: medium;
  }
  .stat-leader-value {
    font-size: larger;
  }
}
</style>