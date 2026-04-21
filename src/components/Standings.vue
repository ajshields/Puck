<template>
  <Layout>
    <!-- Content specific to the respective page -->
    <h2>{{ pageTitle }} Page Content</h2>
  </Layout>
  <div><ProgressSpinner v-if="isLoading" /></div>

  <div class="standings-options">
      <v-button class="standings-selector" :class="{ 'standings-selector-selected': type === 'season' }" @click="type='season'">Season</v-button>
      <v-button class="standings-selector" :class="{ 'standings-selector-selected': type === 'playoffs' }" @click="type='playoffs'">Playoffs</v-button>
  </div>

  <!-- Horizontal header with clickable options -->
  <div v-if="type == 'season'">
    <div class="header">
        <a @click="changeView('division')" :class="{ active: currentView === 'division' }">DIVISION</a>
        <a @click="changeView('wildCard')" :class="{ active: currentView === 'wildCard' }">WILD CARD</a>
        <a @click="changeView('conference')" :class="{ active: currentView === 'conference' }">CONFERENCE</a>
        <a @click="changeView('overall')" :class="{ active: currentView === 'overall' }">OVERALL</a>
    </div>

    <div class="standings-content" v-if="currentView === 'division'">
      <h3>EASTERN</h3>
      <DataTable :value="divisionStandings.atlantic" @row-click="goToTeam">
        <h3 class="sub-section">ATLANTIC</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
      <DataTable :value="divisionStandings.metropolitan" @row-click="goToTeam">
        <h3 class="sub-section">METROPOLITAN</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
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
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
      <DataTable :value="divisionStandings.pacific" @row-click="goToTeam">
        <h3 class="sub-section">PACIFIC</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
    </div>

    <div class="standings-content" v-else-if="currentView === 'wildCard'">
      <h3>EASTERN</h3>
      <DataTable :value="wildCardStandings.atlantic" @row-click="goToTeam">
        <h3 class="sub-section">ATLANTIC</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
      <DataTable :value="wildCardStandings.metropolitan" @row-click="goToTeam">
        <h3 class="sub-section">METROPOLITAN</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
      <DataTable :value="wildCardStandings.eastWC" @row-click="goToTeam" :rowClass="getPlayoffBound">
        <h3 class="sub-section">WILD CARD</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
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
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
      <DataTable :value="wildCardStandings.pacific" @row-click="goToTeam">
        <h3 class="sub-section">PACIFIC</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
      <DataTable :value="wildCardStandings.westWC" @row-click="goToTeam" :rowClass="getPlayoffBound">
        <h3 class="sub-section">WILD CARD</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
    </div>

    <div class="standings-content" v-else-if="currentView === 'conference'">
      <DataTable :value="conferenceStandings.eastern" @row-click="goToTeam">
        <h3 class="sub-section">EASTERN</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
      <DataTable :value="conferenceStandings.western" @row-click="goToTeam">
        <h3 class="sub-section">WESTERN</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
    </div>

    <div class="standings-content" v-else-if="currentView === 'overall'" scrollable scrollDirection="both">
      <DataTable :value="overallStandings" @row-click="goToTeam">
        <h3 class="sub-section">TEAM</h3>
        <Column field="place" header="" sortable style="width: 5%"></Column>
        <Column frozen style="display:flex;justify-content:center;height:30px;align-items:center">
          <template #body="slotProps">
            <img :src="slotProps.data.teamLogo" :alt="slotProps.data.team" class="team-logo-standings" />
          </template>
        </Column>
        <Column field="team" header="" frozen class="team-header" style="width: 23%"></Column>
        <Column field="gamesPlayed" header="GP" sortable style="width: 5%"></Column>
        <Column field="record" header="W-L-OTL" style="width: 10%"></Column>
        <Column field="points" header="P" sortable style="width: 5%"></Column>
        <Column field="regPlusOT" header="ROW" sortable style="width: 5%"></Column>
        <Column field="goalF" header="GF" sortable style="width: 6%"></Column>
        <Column field="goalA" header="GA" sortable style="width: 6%"></Column>
        <Column field="differential" header="DIFF" sortable style="width: 5%"></Column>
        <Column field="shootoutWL" header="SO W-L" style="width: 10%"></Column>
        <Column field="last10" header="LAST 10" style="width: 10%"></Column>
        <Column field="streak" header="STRK" style="width: 10%"></Column>
      </DataTable>
    </div>
  </div>

  <div v-if="type == 'playoffs'">
    <div class="bracket-logo-section"><img :src="bracket.bracketLogo" alt="PLAYOFFS" class="bracket-logo"></div>
    <div class="bracket-grid">
      <!-- Right cascade -->
      <strong class="series-header mobile-er1">R1</strong>
      <div v-if="bracket.series[0].topSeedTeam" class="series series1">
        <div class="series-team" :class="{'series-team-loss': bracket.series[0].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[0].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[0].bottomSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[0].topSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[0].topSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[0].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[0].topSeedWins==4}">
          <img :src="bracket.series[0].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[0].topSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[0].bottomSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[0].bottomSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[0].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-if="bracket.series[1].topSeedTeam" class="series series2">
        <div class="series-team" :class="{'series-team-loss': bracket.series[1].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[1].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[1].bottomSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[1].topSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[1].topSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[1].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[1].topSeedWins==4}">
          <img :src="bracket.series[1].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[1].topSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[1].bottomSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[1].bottomSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[1].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-if="bracket.series[2].topSeedTeam" class="series series3">
        <div class="series-team" :class="{'series-team-loss': bracket.series[2].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[2].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[2].bottomSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[2].topSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[2].topSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[2].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[2].topSeedWins==4}">
          <img :src="bracket.series[2].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[2].topSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[2].bottomSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[2].bottomSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[2].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-if="bracket.series[3].topSeedTeam" class="series series4">
        <div class="series-team" :class="{'series-team-loss': bracket.series[3].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[3].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[3].bottomSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[3].topSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[3].topSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[3].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[3].topSeedWins==4}">
          <img :src="bracket.series[3].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[3].topSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[3].bottomSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[3].bottomSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[3].bottomSeedWins }}</strong>
        </div>
      </div>
      <strong v-if="!isMobile()" class="series-header" style="grid-column: 41 / span 6; grid-row: 24">R1</strong>
      <strong class="series-header mobile-er2">R2</strong>
      <div v-if="bracket.series[8].topSeedTeam" class="series series9">
        <div class="series-team" :class="{'series-team-loss': bracket.series[8].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[8].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[8].bottomSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[8].topSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[8].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[8].topSeedWins==4}">
          <img :src="bracket.series[8].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[8].topSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[8].bottomSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[8].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-if="bracket.series[9].topSeedTeam" class="series series10">
        <div class="series-team" :class="{'series-team-loss': bracket.series[9].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[9].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[9].bottomSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[9].topSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[9].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[9].topSeedWins==4}">
          <img :src="bracket.series[9].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[9].topSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[9].bottomSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[9].bottomSeedWins }}</strong>
        </div>
      </div>
      <strong v-if="!isMobile()" class="series-header" style="grid-column: 33 / span 6; grid-row: 21">R2</strong>
      <strong class="series-header mobile-ecf">ECF</strong>
      <div v-if="bracket.series[12].topSeedTeam" class="series series13">
        <div class="series-team" :class="{'series-team-loss': bracket.series[12].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[12].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[12].bottomSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[12].topSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[12].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[12].topSeedWins==4}">
          <img :src="bracket.series[12].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[12].topSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[12].bottomSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[12].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-else class="series series13">
        <img :src="bracket.series[12].seriesLogo" :alt="Logo" style="width:80%"/>
      </div>
      

      <!-- Center -->
      <strong v-if="bracket.series[14].topSeedTeam" class="series-header mobile-scf">SCF</strong>
      <div v-if="bracket.series[14].topSeedTeam" class="series stanley-cup-series">
        <div class="series-team" :class="{'series-team-loss': bracket.series[14].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[14].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[14].bottomSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[14].topSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[14].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[14].topSeedWins==4}">
          <img :src="bracket.series[14].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[14].topSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[14].bottomSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[14].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-else class="series stanley-cup">
        <img :src="bracket.series[14].seriesLogo" :alt="Logo" style="width:80%"/>
      </div>

      <!-- Left cascade -->
      <strong class="series-header mobile-wr1">R1</strong>
      <div v-if="bracket.series[4].topSeedTeam" class="series series5">
        <div class="series-team" :class="{'series-team-loss': bracket.series[4].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[4].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[4].bottomSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[4].topSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[4].topSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[4].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[4].topSeedWins==4}">
          <img :src="bracket.series[4].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[4].topSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[4].bottomSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[4].bottomSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[4].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-if="bracket.series[5].topSeedTeam" class="series series6">
        <div class="series-team" :class="{'series-team-loss': bracket.series[5].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[5].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[5].bottomSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[5].topSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[5].topSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[5].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[5].topSeedWins==4}">
          <img :src="bracket.series[5].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[5].topSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[5].bottomSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[5].bottomSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[5].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-if="bracket.series[6].topSeedTeam" class="series series7">
        <div class="series-team" :class="{'series-team-loss': bracket.series[6].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[6].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[6].bottomSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[6].topSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[6].topSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[6].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[6].topSeedWins==4}">
          <img :src="bracket.series[6].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[6].topSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[6].bottomSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[6].bottomSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[6].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-if="bracket.series[7].topSeedTeam" class="series series8">
        <div class="series-team" :class="{'series-team-loss': bracket.series[7].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[7].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo"  :class="{'series-team-logo-loss': bracket.series[7].bottomSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[7].topSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[7].topSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[7].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[7].topSeedWins==4}">
          <img :src="bracket.series[7].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[7].topSeedWins==4}"/>
          <div class="series-team-info">
            <strong class="playoffs-team-name">{{ bracket.series[7].bottomSeedTeam.abbrev }}</strong>
            <strong class="playoffs-team-seed">({{ bracket.series[7].bottomSeedRankAbbrev }})</strong>
          </div>
          <strong class="series-team-wins">{{ bracket.series[7].bottomSeedWins }}</strong>
        </div>
      </div>
      <strong v-if="!isMobile()" class="series-header" style="grid-column: 1 / span 6; grid-row: 24">R1</strong>
      <strong class="series-header mobile-wr2">R2</strong>
      <div v-if="bracket.series[10].topSeedTeam" class="series series11">
        <div class="series-team" :class="{'series-team-loss': bracket.series[10].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[10].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[10].bottomSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[10].topSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[10].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[10].topSeedWins==4}">
          <img :src="bracket.series[10].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[10].topSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[10].bottomSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[10].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-if="bracket.series[11].topSeedTeam" class="series series12">
        <div class="series-team" :class="{'series-team-loss': bracket.series[11].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[11].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[11].bottomSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[11].topSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[11].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[11].topSeedWins==4}">
          <img :src="bracket.series[11].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[11].topSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[11].bottomSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[11].bottomSeedWins }}</strong>
        </div>
      </div>
      <strong v-if="!isMobile()" class="series-header" style="grid-column: 9 / span 6; grid-row: 21">R2</strong>
      <strong class="series-header mobile-wcf">WCF</strong>
      <div v-if="bracket.series[12].topSeedTeam" class="series series14">
        <div class="series-team" :class="{'series-team-loss': bracket.series[13].bottomSeedWins==4}" style="border-bottom: 2px solid #3E3E3E;">
          <img :src="bracket.series[13].topSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[13].bottomSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[13].topSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[13].topSeedWins }}</strong>
        </div>
        <div class="series-team" :class="{'series-team-loss': bracket.series[13].topSeedWins==4}">
          <img :src="bracket.series[13].bottomSeedTeam.darkLogo" :alt="Logo" class="series-team-logo" :class="{'series-team-logo-loss': bracket.series[13].topSeedWins==4}"/>
          <strong class="series-team-info-after">{{ bracket.series[13].bottomSeedTeam.abbrev }}</strong>
          <strong class="series-team-wins">{{ bracket.series[13].bottomSeedWins }}</strong>
        </div>
      </div>
      <div v-else class="series series14">
        <img :src="bracket.series[13].seriesLogo" :alt="Logo" style="width:80%"/>
      </div>
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { fetchApi } from '@/services/fetchApi';

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
      type: 'season',
      currentView: 'division', // Default view
      todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0], // Default to today's date
      divisionStandings: {atlantic:[], metropolitan:[], central:[], pacific:[]},
      wildCardStandings: {atlantic:[], metropolitan:[], eastWC:[], central:[], pacific:[], westWC:[]},
      conferenceStandings: {eastern:[], western:[]},
      overallStandings: [],
      schedule: [],
      bracket: {},
      error: null,
    };
  },
  mounted() {
    this.fetchSchedule();
    this.fetchBracket();
  },
  methods: {
    isMobile() {
      return window.innerWidth <= 640;
    },
    async fetchSchedule() {
      try {
        this.isLoading = true;
        const response = await fetchApi(`/api/v1/schedule/${this.todaysDate}`);
        const data = await response.json();
        this.schedule = data;
        this.isLoading = false;

        if(this.todaysDate > data.regularSeasonEndDate) { //if the regular season is over send last date of regular season
          this.fetchTeams(data.regularSeasonEndDate);
          this.type = 'playoffs';
        } else { //send current date
          this.fetchTeams(this.todaysDate);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
        alert('Error fetching scores. See console for details.');
      }
    },
    async fetchTeams(standingsDate) {
      try {
        const response = await fetchApi(`/api/v1/standings/${standingsDate}`);
        const data = await response.json();
        this.configureStandings(data);
        // Handle the fetched data as needed
        this.isLoading = false;
      } catch (error) {
        console.error('Error fetching teams:', error);
        alert('Error fetching teams. See console for details.');
      }
    },
    async fetchBracket() {
      try {
        this.isLoading = true;
        const response = await fetchApi(`/api/v1/playoff-bracket/${new Date().getFullYear()}`);
        const data = await response.json();
        this.bracket = data;
        this.isLoading = false;
      } catch (error) {
        console.error('Error fetching scores:', error);
        alert('Error fetching scores. See console for details.');
      }
    },
    changeView(view) {
      this.currentView = view;
    },
    configureTeamName(team) {
      if (team.clinchIndicator)
        return `${team.clinchIndicator}-${team.teamAbbrev.default} ${team.teamCommonName.default}`;
      return `${team.teamAbbrev.default} ${team.teamCommonName.default}`;
    },
    configureStandings(teams) {
      let eastWCCounter = 0;
      let westWCCounter = 0;
      for(let i = 0; i < teams.standings.length; i++) {
        //push onto division table
        switch(teams.standings[i].divisionAbbrev) {
          case 'A':
            this.divisionStandings.atlantic.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          case 'M':
            this.divisionStandings.metropolitan.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          case 'C':
            this.divisionStandings.central.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          case 'P':
            this.divisionStandings.pacific.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          default:
            break;
        }
        //push onto wildcard table
        if(teams.standings[i].divisionSequence <=3) {
          switch(teams.standings[i].divisionAbbrev) {
            case 'A':
              this.wildCardStandings.atlantic.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            case 'M':
              this.wildCardStandings.metropolitan.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            case 'C':
              this.wildCardStandings.central.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            case 'P':
              this.wildCardStandings.pacific.push({"place": teams.standings[i].divisionSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            default:
              break;
          }
        } else {
          switch(teams.standings[i].conferenceAbbrev) {
            case 'E':
              eastWCCounter++;
              this.wildCardStandings.eastWC.push({"place": eastWCCounter, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            case 'W':
              westWCCounter++
              this.wildCardStandings.westWC.push({"place": westWCCounter, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
              break;
            default:
              break;
          }
        }
        //push onto conference table
        switch(teams.standings[i].conferenceAbbrev) {
          case 'E':
            this.conferenceStandings.eastern.push({"place": teams.standings[i].conferenceSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          case 'W':
            this.conferenceStandings.western.push({"place": teams.standings[i].conferenceSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
            break;
          default:
            break;
        }
        //push onto overall table
        this.overallStandings.push({"place": teams.standings[i].leagueSequence, "teamLogo": teams.standings[i].teamLogo, "team": this.configureTeamName(teams.standings[i]), "gamesPlayed": teams.standings[i].gamesPlayed, "record": (teams.standings[i].wins+"-"+teams.standings[i].losses+"-"+teams.standings[i].otLosses), "points": teams.standings[i].points, "regPlusOT": teams.standings[i].regulationPlusOtWins, "goalF": teams.standings[i].goalFor, "goalA": teams.standings[i].goalAgainst, "differential": teams.standings[i].goalDifferential, "shootoutWL": (teams.standings[i].shootoutWins+"-"+teams.standings[i].shootoutLosses), "last10": (teams.standings[i].l10Wins+"-"+teams.standings[i].l10Losses+"-"+teams.standings[i].l10OtLosses), "streak": (teams.standings[i].streakCode+teams.standings[i].streakCount)});
      }
    },
    getPlayoffBound(rowData) {
      if(rowData.place==2)
        return 'playoff-bound';
    },
    goToTeam(row) {
      const teamAbbrev = row.data.team.split(' ')[0];
      const teamId = teamAbbrev.includes('-') ? teamAbbrev.split('-')[1] : teamAbbrev;
      this.$router.push({ name: 'team.schedule', params: { id: teamId }});
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

.header .active {
  background-color: var(--hover-dark-color);
  color: white;
  border-radius: 10px;
  font-weight: bold;
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

.standings-options {
    display: flex;
    justify-content: center;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 8px;
}

.standings-selector {
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

.standings-selector:hover {
    background-color: var(--main-color);
    color: black;
}

.standings-selector-selected {
    background-color: var(--main-color);
    color: black;
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

.bracket-logo-section {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.bracket-logo {
  width: 500px;
}

.bracket-grid {
  display: grid;
  grid-template-columns: repeat(46, 1fr); /* Seven equal columns */
  grid-template-rows: repeat(24, 25px);   /* Seven equal rows */
  gap: 10px;
  margin: auto;
}

.series {
  background: #2c2c2c;
  border-radius: 8px;
  border: 2px solid #3E3E3E;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-direction: column;
}

.series-header {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.series-team {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.series-team-loss {
  color: #ffffff7a;
}

.series-team-logo {
  width: 40%;
}

.series-team-logo-loss {
  opacity: 0.4;
}

.series-team-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 30%;
}

.series-team-info-after {
  font-size:large;
  font-weight:bold;
  width:40%;
  display: flex;
  justify-content: center;
}

.series-team-wins {
  font-size:xx-large;
  font-weight:bold;
  width: 30%;
  display: flex;
  justify-content: center;
}

.playoffs-team-name {
  font-size: large;
  font-weight: bold;
}

.playoffs-team-seed {
  font-size: small;
}

/* East (right) side cascade */
.series1 {grid-column: 41 / span 6; grid-row: 2 / span 4}
.series2 {grid-column: 41 / span 6; grid-row: 8 / span 4}
.series3 {grid-column: 41 / span 6; grid-row: 14 / span 4}
.series4 {grid-column: 41 / span 6; grid-row: 20 / span 4}
.series9 {grid-column: 33 / span 6; grid-row: 5 / span 4}
.series10 {grid-column: 33 / span 6; grid-row: 17 / span 4}
.series13 {grid-column: 28 / span 6; grid-row: 11 / span 4}

/* Center box */
.stanley-cup-series {grid-column: 21 / span 6; grid-row: 9 / span 4}
.stanley-cup {
  grid-column: 21 / span 6;
  grid-row: 8 / span 8;
  background: #181818;
}

/* West (left) side cascade (mirrored) */
.series5  {grid-column: 1 / span 6; grid-row: 2 / span 4}
.series6  {grid-column: 1 / span 6; grid-row: 8 / span 4}
.series7 {grid-column: 1 / span 6; grid-row: 14 / span 4}
.series8 {grid-column: 1 / span 6; grid-row: 20 / span 4}
.series11 {grid-column: 9 / span 6; grid-row: 5 / span 4}
.series12 {grid-column: 9 / span 6; grid-row: 17 / span 4}
.series14 {grid-column: 14 / span 6; grid-row: 11 / span 4}

.series-header.mobile-er1 {grid-column: 41 / span 6; grid-row: 1}
.series-header.mobile-er2 {grid-column: 33 / span 6; grid-row: 4}
.series-header.mobile-ecf {grid-column: 28 / span 6; grid-row: 10}
/* Stanley Cup Finals Header */
.series-header.mobile-scf {grid-column: 21 / span 6; grid-row: 8}
/* West Series Headers */
.series-header.mobile-wr1 {grid-column: 1 / span 6; grid-row: 1}
.series-header.mobile-wr2 {grid-column: 9 / span 6; grid-row: 4}
.series-header.mobile-wcf {grid-column: 14 / span 6; grid-row: 10}

/*.p-row-even {
  border-bottom-style: solid;
  border-color: #0066ff;
}

.p-row-odd{
  border-bottom-style: solid;
  border-color: #ff1500;
}*/

/* Mobile Device Styling */
@media (max-width: 640px) {
  .bracket-grid {
    height: 630px;
  }
  .bracket-logo {
    width: 100%;
  }
  .header {
    font-size: small;
    margin-bottom: 0px;
  }
  .p-datatable-table {
    width: 200%;
  }
  .playoffs-team-name {
    font-size: small;
  }
  .playoffs-team-seed {
    font-size: xx-small;
  }
  .series-team-info {
    width: 50%;
  }
  .series-team-logo {
    width: 35%;
  }
  .series-team-wins {
    font-size: x-large;
  }
  .standings-content {
    height: calc(100dvh - 215px);
    overflow-y: auto;
  }
  /* East (right) side cascade */
  .series1 {grid-column: 28 / span 10; grid-row: 2 / span 3}
  .series2 {grid-column: 28 / span 10; grid-row: 5 / span 3}
  .series3 {grid-column: 28 / span 10; grid-row: 13 / span 3}
  .series4 {grid-column: 28 / span 10; grid-row: 16 / span 3}
  .series9 {grid-column: 20 / span 8; grid-row: 3 / span 4}
  .series10 {grid-column: 20 / span 8; grid-row: 14 / span 4}
  .series13 {grid-column: 26 / span 11; grid-row: 9 / span 4}
  /* Center box */
  .stanley-cup-series {grid-column: 13 / span 13; grid-row: 7 / span 4}
  .stanley-cup {
    grid-column: 15 / span 9;
    grid-row: 8 / span 6;
    background: #181818;
  }
  /* West (left) side cascade (mirrored) */
  .series5  {grid-column: 1 / span 10; grid-row: 2 / span 3}
  .series6  {grid-column: 1 / span 10; grid-row: 5 / span 3}
  .series7 {grid-column: 1 / span 10; grid-row: 13 / span 3}
  .series8 {grid-column: 1 / span 10; grid-row: 16 / span 3}
  .series11 {grid-column: 11 / span 8; grid-row: 3 / span 4}
  .series12 {grid-column: 11 / span 8; grid-row: 14 / span 4}
  .series14 {grid-column: 2 / span 11; grid-row: 9 / span 4}
  /* East Series Headers */
  .series-header.mobile-er1 {grid-column: 30 / span 6; grid-row: 1}
  .series-header.mobile-er2 {grid-column: 21 / span 6; grid-row: 2}
  .series-header.mobile-ecf {grid-column: 29 / span 5; grid-row: 8}
  /* Stanley Cup Finals Header */
  .series-header.mobile-scf {grid-column: 17 / span 5; grid-row: 6}
  /* West Series Headers */
  .series-header.mobile-wr1 {grid-column: 3 / span 6; grid-row: 1}
  .series-header.mobile-wr2 {grid-column: 12 / span 6; grid-row: 2}
  .series-header.mobile-wcf {grid-column: 5 / span 5; grid-row: 8}
}
</style>