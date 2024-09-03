<template>
  <Layout>
    <!-- Content specific to the respective page -->
    <h2>{{ pageTitle }} Page Content</h2>
  </Layout>
  <div><ProgressSpinner v-if="isLoading" /></div>

  <!-- Horizontal header with clickable options -->
  <div class="header">
      <a @click="changeView('division')" :class="{ active: currentView === 'division' }">DIVISION</a>
      <a @click="changeView('wildCard')" :class="{ active: currentView === 'wildCard' }">WILD CARD</a>
      <a @click="changeView('conference')" :class="{ active: currentView === 'conference' }">CONFERENCE</a>
      <a @click="changeView('overall')" :class="{ active: currentView === 'overall' }">OVERALL</a>
  </div>

    <div v-if="currentView === 'division'">
      <h3>EASTERN</h3>
      <DataTable :value="divisionStandings.atlantic" @row-click="goToTeam">
        <h3 class="sub-section">ATLANTIC</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <DataTable :value="divisionStandings.metropolitan" @row-click="goToTeam">
        <h3 class="sub-section">METROPOLITAN</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <h3>WESTERN</h3>
      <DataTable :value="divisionStandings.central" @row-click="goToTeam">
        <h3 class="sub-section">CENTRAL</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <DataTable :value="divisionStandings.pacific" @row-click="goToTeam">
        <h3 class="sub-section">PACIFIC</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
    </div>

    <div v-else-if="currentView === 'wildCard'">
      <h3>EASTERN</h3>
      <DataTable :value="wildCardStandings.atlantic" @row-click="goToTeam">
        <h3 class="sub-section">ATLANTIC</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <DataTable :value="wildCardStandings.metropolitan" @row-click="goToTeam">
        <h3 class="sub-section">METROPOLITAN</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <DataTable :value="wildCardStandings.eastWC" @row-click="goToTeam" :rowClass="getPlayoffBound">
        <h3 class="sub-section">WILD CARD</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <h3>WESTERN</h3>
      <DataTable :value="wildCardStandings.central" @row-click="goToTeam">
        <h3 class="sub-section">CENTRAL</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <DataTable :value="wildCardStandings.pacific" @row-click="goToTeam">
        <h3 class="sub-section">PACIFIC</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <DataTable :value="wildCardStandings.westWC" @row-click="goToTeam" :rowClass="getPlayoffBound">
        <h3 class="sub-section">WILD CARD</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
    </div>

    <div v-else-if="currentView === 'conference'">
      <DataTable :value="conferenceStandings.eastern" @row-click="goToTeam">
        <h3 class="sub-section">EASTERN</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
      <DataTable :value="conferenceStandings.western" @row-click="goToTeam">
        <h3 class="sub-section">WESTERN</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
    </div>

    <div v-else-if="currentView === 'overall'">
      <DataTable :value="overallStandings" @row-click="goToTeam">
        <h3 class="sub-section">TEAM</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 25%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 5%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 5%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 5%"></Column>
      </DataTable>
    </div>

    <!-- Display error if any -->
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
</template>
  
<script>
import ProgressSpinner from './ProgressSpinner.vue';
import Layout from '@/components/Layout.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
  name: 'Standings',
  components: {
    ProgressSpinner,
    Layout,
    DataTable,
    Column,
  },
  data() {
    return {
      isLoading: true,
      pageTitle: 'Standings',
      currentView: 'division', // Default view
      todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0], // Default to today's date
      divisionStandings: {atlantic:[], metropolitan:[], central:[], pacific:[]},
      wildCardStandings: {atlantic:[], metropolitan:[], eastWC:[], central:[], pacific:[], westWC:[]},
      conferenceStandings: {eastern:[], western:[]},
      overallStandings: [],
      error: null,
    };
  },
  mounted() {
    this.fetchTeams();
  },
  methods: {
    async fetchTeams() {
      // Implement your fetchGames logic here
      // Use this.todaysDate to get today's date
      try {
        const response = await fetch(`/api/v1/standings/${this.todaysDate}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
          // You can add more options here if needed
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        this.configureStandings(data);
        // Handle the fetched data as needed
        this.isLoading = false;
      } catch (error) {
        console.error('Error fetching teams:', error);
        alert('Error fetching teams. See console for details.');
      }
    },
    changeView(view) {
      this.currentView = view;
    },
    configureStandings(teams) {
      let eastWCCounter = 0;
      let westWCCounter = 0;
      for(let i = 0; i < teams.standings.length; i++) {
        //push onto division table
        switch(teams.standings[i].divisionAbbrev) {
          case 'A':
            this.divisionStandings.atlantic.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          case 'M':
            this.divisionStandings.metropolitan.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          case 'C':
            this.divisionStandings.central.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          case 'P':
            this.divisionStandings.pacific.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          default:
            break;
        }
        //push onto wildcard table
        if(teams.standings[i].divisionSequence <=3) {
          switch(teams.standings[i].divisionAbbrev) {
            case 'A':
              this.wildCardStandings.atlantic.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            case 'M':
              this.wildCardStandings.metropolitan.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            case 'C':
              this.wildCardStandings.central.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            case 'P':
              this.wildCardStandings.pacific.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            default:
              break;
          }
        } else {
          switch(teams.standings[i].conferenceAbbrev) {
            case 'E':
              eastWCCounter++;
              this.wildCardStandings.eastWC.push({"place": eastWCCounter, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            case 'W':
              westWCCounter++
              this.wildCardStandings.westWC.push({"place": westWCCounter, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            default:
              break;
          }
        }
        //push onto conference table
        switch(teams.standings[i].conferenceAbbrev) {
          case 'E':
            this.conferenceStandings.eastern.push({"place": teams.standings[i].conferenceSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          case 'W':
            this.conferenceStandings.western.push({"place": teams.standings[i].conferenceSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          default:
            break;
        }
        //push onto overall table
        this.overallStandings.push({"place": teams.standings[i].leagueSequence, "teamLogo": teams.standings[i].teamLogo, "team": (teams.standings[i].teamAbbrev.default + " " + teams.standings[i].teamCommonName.default), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
      }
    },
    getPlayoffBound(rowData) {
      if(rowData.place==2)
        return 'playoff-bound';
    },
    goToTeam(row) {
      this.$router.push({ name: 'team.schedule', params: { id: row.data.team.split(' ')[0] }});
    }
  },
};
</script>
  
<style>
.header {
  display: flex;
  justify-content: space-evenly;
  gap: 10px;
  margin-bottom: 20px;
}

.header a:hover {
  cursor: pointer;
}

.nav-link {
  margin-right: 10px; /* Adjust as needed */
  color: rgb(4, 246, 0); /* Set your desired color */
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline; /* Add an underline on hover if desired */
}

.sub-section {
  background-color: #56565600;
  font-size: 15px;
}

.team-logo-standings{
  width: 30px; /* Adjust the width of the logo as needed */
  height: 24px; /* Adjust the height of the logo as needed */
}

.team-header {
  text-align: left;
}

th {
  text-align: center; /* or right or center, depending on your preference */
}

tr {
  text-align: center;
}

.p-datatable-table {
  width: 100%;
  border-collapse: collapse;
}

.p-datatable-thead {
  background-color: #56565636;
}

.p-sortable-column:not(.p-highlight) .p-sortable-column-icon {
  display: none !important;
}

.p-sortable-column.p-highlight .p-sortable-column-icon {
  display: inline-block !important;
  color: var(--link-color);
}

.playoff-bound {
  border-bottom:solid;
  border-width:thin;
  border-color:#8f8f8f;
}

/*.p-row-even {
  border-bottom-style: solid;
  border-color: #0066ff;
}

.p-row-odd{
  border-bottom-style: solid;
  border-color: #ff1500;
}*/
</style>