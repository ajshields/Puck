<template>
    <!-- <div><ProgressSpinner v-if="isLoading" /></div> -->

    <div v-if="playerInfo" style="margin-top:2rem">
        <div v-if="playerInfo.position!='G'">
            <DataTable :value="careerStats" class="career-stats-table" :rowClass="getSeasonClass">
                <ColumnGroup type="header">
                    <Row>
                        <Column header="" :colspan="3" headerClass="nhl-total"/>
                        <Column header="Regular Season" :colspan="6" headerClass="nhl-total"/>
                        <Column header="Playoffs" :colspan="5" headerClass="nhl-total"/>
                    </Row>
                    <Row>
                        <Column header="Season" field="season" headerClass="nhl-total"/>
                        <Column header="Team" field="team" headerClass="nhl-total"/>
                        <Column header="League" field="league" headerClass="nhl-total"/>
                        <Column header="GP" field="gamesPlayed" headerClass="nhl-total"/>
                        <Column header="G" field="goals" headerClass="nhl-total"/>
                        <Column header="A" field="assists" headerClass="nhl-total"/>
                        <Column header="P" field="points" headerClass="nhl-total"/>
                        <Column header="PIM" field="penaltyMinutes" headerClass="nhl-total"/>
                        <Column header="+/-" field="plusMinus" headerClass="nhl-total"/>
                        <Column header="GP" field="gamesPlayedP" headerClass="nhl-total"/>
                        <Column header="G" field="goalsP" headerClass="nhl-total"/>
                        <Column header="A" field="assistsP" headerClass="nhl-total"/>
                        <Column header="P" field="pointsP" headerClass="nhl-total"/>
                        <Column header="PIM" field="penaltyMinutesP" headerClass="nhl-total"/>
                    </Row>
                </ColumnGroup>
                <Column field="season" class="stat-cell" style="width:8%"></Column>
                <Column field="team" class="stat-cell" style="text-align:left;width:18%"></Column>
                <Column field="league" class="stat-cell" style="text-align:left;width:8%;border-right:solid;border-color:#17203b"></Column>
                <Column field="gamesPlayed" class="stat-cell" style="width:5%"></Column>
                <Column field="goals" class="stat-cell" style="width:5%"></Column>
                <Column field="assists" class="stat-cell" style="width:5%"></Column>
                <Column field="points" class="stat-cell" style="width:5%;font-weight:bold"></Column>
                <Column field="penaltyMinutes" class="stat-cell" style="width:5%"></Column>
                <Column field="plusMinus" class="stat-cell" style="width:5%;border-right:solid;border-color:#17203b"></Column>
                <Column field="gamesPlayedP" class="stat-cell" style="width:5%"></Column>
                <Column field="goalsP" class="stat-cell" style="width:5%"></Column>
                <Column field="assistsP" class="stat-cell" style="width:5%"></Column>
                <Column field="pointsP" class="stat-cell" style="width:5%"></Column>
                <Column field="penaltyMinutesP" class="stat-cell" style="width:5%"></Column>
            </DataTable>
        </div>
        <div v-else> <!--SET UP GOALIE STATS-->
            <DataTable :value="careerStats" class="career-stats-table" :rowClass="getSeasonClass">
                <ColumnGroup type="header">
                    <Row>
                        <Column header="" :colspan="3" headerClass="nhl-total"/>
                        <Column header="Regular Season" :colspan="6" headerClass="nhl-total"/>
                        <Column header="Playoffs" :colspan="5" headerClass="nhl-total"/>
                    </Row>
                    <Row>
                        <Column header="Season" field="season" headerClass="nhl-total"/>
                        <Column header="Team" field="team" headerClass="nhl-total"/>
                        <Column header="League" field="league" headerClass="nhl-total"/>
                        <Column header="GP" field="gamesPlayed" headerClass="nhl-total"/>
                        <Column header="GAA" field="goalsAgainstAvg" headerClass="nhl-total"/>
                        <Column header="SV%" field="savePctg" headerClass="nhl-total"/>
                        <Column header="SO" field="shutouts" headerClass="nhl-total"/>
                        <Column header="W-L-OTL" field="record" headerClass="nhl-total"/>
                        <Column header="GP" field="gamesPlayedP" headerClass="nhl-total"/>
                        <Column header="GAA" field="goalsAgainstAvgP" headerClass="nhl-total"/>
                        <Column header="SV%" field="savePctgP" headerClass="nhl-total"/>
                        <Column header="SO" field="shutoutsP" headerClass="nhl-total"/>
                        <Column header="W-L-OTL" field="recordP" headerClass="nhl-total"/>
                    </Row>
                </ColumnGroup>
                <Column field="season" style="width:8%"></Column>
                <Column field="team" style="text-align:left;width:15%"></Column>
                <Column field="league" style="text-align:left;width:8%"></Column>
                <Column field="gamesPlayed" style="width:5%"></Column>
                <Column field="goalsAgainstAvg" style="width:5%"></Column>
                <Column field="savePctg" style="width:5%;font-weight:bold"></Column>
                <Column field="shutouts" style="width:5%"></Column>
                <Column field="record" style="width:5%"></Column>
                <Column field="gamesPlayedP" style="width:5%"></Column>
                <Column field="goalsAgainstAvgP" style="width:5%"></Column>
                <Column field="savePctgP" style="width:5%"></Column>
                <Column field="shutoutsP" style="width:5%"></Column>
                <Column field="recordP" style="width:5%"></Column>
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
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';

export default {
    name: 'Career',
    components: {
        ProgressSpinner,
        DataTable,
        Column,
        ColumnGroup,
        Row,
    },
    props: {
        id: String,
        playerInfo: Object,
    },
    mounted() {
        this.configureCareerStats();
    },
    data() {
      return {
          isLoading: true,
          careerStats: [],
          error: null,
      };
    },
    methods: {
        configureCareerStats() {
            const season = this.playerInfo.seasonTotals;
            for(let i = 0; i < season.length; i++) {
                let playoffsIndex = null;
                for(let j = i+1; j < season.length; j++) {
                    if(season[i].season==season[j].season && season[i].leagueAbbrev==season[j].leagueAbbrev)
                        playoffsIndex = j;
                }
                if(this.playerInfo.position!='G') {
                    if(season[i].gameTypeId == 2) {
                        this.careerStats.push({
                            'season': (i!=0 && season[i].season==season[i-1].season) ? '' : this.formatYear(season[i].season),
                            'team': season[i].teamName.default,
                            'league': season[i].leagueAbbrev,
                            'gamesPlayed': season[i].gamesPlayed,
                            'goals': season[i].goals,
                            'assists': season[i].assists,
                            'points': season[i].points,
                            'penaltyMinutes': season[i].pim,
                            'plusMinus': season[i].plusMinus,
                            'gamesPlayedP': playoffsIndex ? season[playoffsIndex].gamesPlayed : '',
                            'goalsP': playoffsIndex ? season[playoffsIndex].goals : '',
                            'assistsP': playoffsIndex ? season[playoffsIndex].assists : '',
                            'pointsP': playoffsIndex ? season[playoffsIndex].points : '',
                            'penaltyMinutesP': playoffsIndex ? season[playoffsIndex].pim : '',
                        });
                    } else { //this is for if the player only played in the playoffs for this year
                        for(let j = i-1; j >= 0; j--) {
                            if(season[i].season==season[j].season && season[i].leagueAbbrev==season[j].leagueAbbrev)
                               break;
                            if(j==0) {
                                this.careerStats.push({
                                    'season': (i!=0 && season[i].season==season[i-1].season) ? '' : this.formatYear(season[i].season),
                                    'team': season[i].teamName.default,
                                    'league': season[i].leagueAbbrev,
                                    'gamesPlayed': '',
                                    'goals': '',
                                    'assists': '',
                                    'points': '',
                                    'penaltyMinutes': '',
                                    'plusMinus': '',
                                    'gamesPlayedP': season[i].gamesPlayed,
                                    'goalsP': season[i].goals,
                                    'assistsP': season[i].assists,
                                    'pointsP': season[i].points,
                                    'penaltyMinutesP': season[i].pim,
                                });
                            }
                        }
                    }
                    if(!season[i+1]) { //NHL career totals
                        this.careerStats.push({
                            'season': '',
                            'team': 'NHL Totals',
                            'league': '',
                            'gamesPlayed': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.gamesPlayed : '',
                            'goals': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.goals : '',
                            'assists': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.assists : '',
                            'points': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.points : '',
                            'penaltyMinutes': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.pim : '',
                            'plusMinus': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.plusMinus : '',
                            'gamesPlayedP': (this.playerInfo.careerTotals.playoffs) ? this.playerInfo.careerTotals.playoffs.gamesPlayed : '',
                            'goalsP': (this.playerInfo.careerTotals.playoffs) ? this.playerInfo.careerTotals.playoffs.goals : '',
                            'assistsP': (this.playerInfo.careerTotals.playoffs) ? this.playerInfo.careerTotals.playoffs.assists : '',
                            'pointsP': (this.playerInfo.careerTotals.playoffs) ? this.playerInfo.careerTotals.playoffs.points : '',
                            'penaltyMinutesP': (this.playerInfo.careerTotals.playoffs) ? this.playerInfo.careerTotals.playoffs.pim : '',
                        });
                    }
                } else if(this.playerInfo.position=='G') { //goalie stats
                    if(season[i].gameTypeId == 2) {
                        let record = '';
                        let recordP = '';
                        if(season[i].wins && !season[i].otLosses)
                            record = `${season[i].wins}-${season[i].losses}`;
                        if(season[i].wins && season[i].otLosses)
                            record = `${season[i].wins}-${season[i].losses}-${season[i].otLosses}`;
                        if(season[playoffsIndex] && season[playoffsIndex].wins && !season[playoffsIndex].otLosses)
                            recordP = `${season[playoffsIndex].wins}-${season[playoffsIndex].losses}`;
                        if(season[playoffsIndex] && season[playoffsIndex].wins && season[playoffsIndex].otLosses)
                            recordP = `${season[playoffsIndex].wins}-${season[playoffsIndex].losses}-${season[playoffsIndex].otLosses}`;
                        this.careerStats.push({
                            'season': (i!=0 && season[i].season==season[i-1].season) ? '' : this.formatYear(season[i].season),
                            'team': season[i].teamName.default,
                            'league': season[i].leagueAbbrev,
                            'gamesPlayed': season[i].gamesPlayed,
                            'goalsAgainstAvg': season[i].goalsAgainstAvg ? season[i].goalsAgainstAvg.toFixed(2) : '',
                            'savePctg': season[i].savePctg ? (season[i].savePctg.toFixed(3)).slice(1) : '',
                            'shutouts': season[i].shutouts,
                            'record': record,
                            'gamesPlayedP': playoffsIndex ? season[playoffsIndex].gamesPlayed : '',
                            'goalsAgainstAvgP': (playoffsIndex && season[playoffsIndex].goalsAgainstAvg) ? season[playoffsIndex].goalsAgainstAvg.toFixed(2) : '',
                            'savePctgP': (playoffsIndex && season[playoffsIndex].savePctg) ? (season[playoffsIndex].savePctg.toFixed(3)).slice(1) : '',
                            'shutoutsP': playoffsIndex ? season[playoffsIndex].shutouts : '',
                            'recordP': (playoffsIndex && season[playoffsIndex].wins) ? recordP : '',
                        });
                    } else { //this is for if the player only played in the playoffs for this year
                        for(let j = i-1; j >= 0; j--) {
                            if(season[i].season==season[j].season && season[i].leagueAbbrev==season[j].leagueAbbrev)
                               break;
                            if(j==0) {
                                let record = '';
                                if(season[i].wins && !season[i].otLosses)
                                    record = `${season[i].wins}-${season[i].losses}`;
                                if(season[i].wins && season[i].otLosses)
                                    record = `${season[i].wins}-${season[i].losses}-${season[i].otLosses}`;
                                this.careerStats.push({
                                    'season': (i!=0 && season[i].season==season[i-1].season) ? '' : this.formatYear(season[i].season),
                                    'team': season[i].teamName.default,
                                    'league': season[i].leagueAbbrev,
                                    'gamesPlayed': '',
                                    'goalsAgainstAvg': '',
                                    'savePctg': '',
                                    'shutouts': '',
                                    'record': '',
                                    'gamesPlayedP': season[i].gamesPlayed,
                                    'goalsAgainstAvgP': season[i].goalsAgainstAvg ? season[i].goalsAgainstAvg.toFixed(2) : '',
                                    'savePctgP': season[i].savePctg ? (season[i].savePctg.toFixed(3)).slice(1) : '',
                                    'shutoutsP': season[i].shutouts,
                                    'recordP': record,
                                });
                            }
                        }
                    }
                    if(!season[i+1]) { //NHL career totals
                        let record = '';
                        let recordP = '';
                        if(this.playerInfo.careerTotals.regularSeason && this.playerInfo.careerTotals.regularSeason.wins && !this.playerInfo.careerTotals.regularSeason.otLosses)
                            record = `${this.playerInfo.careerTotals.regularSeason.wins}-${this.playerInfo.careerTotals.regularSeason.losses}`;
                        if(this.playerInfo.careerTotals.regularSeason && this.playerInfo.careerTotals.regularSeason.wins && this.playerInfo.careerTotals.regularSeason.otLosses)
                            record = `${this.playerInfo.careerTotals.regularSeason.wins}-${this.playerInfo.careerTotals.regularSeason.losses}-${this.playerInfo.careerTotals.regularSeason.otLosses}`;
                        if(this.playerInfo.careerTotals.playoffs && this.playerInfo.careerTotals.playoffs.wins && !this.playerInfo.careerTotals.playoffs.otLosses)
                            recordP = `${this.playerInfo.careerTotals.playoffs.wins}-${this.playerInfo.careerTotals.playoffs.losses}`;
                        if(this.playerInfo.careerTotals.playoffs && this.playerInfo.careerTotals.playoffs.wins && this.playerInfo.careerTotals.playoffs.otLosses)
                            recordP = `${this.playerInfo.careerTotals.playoffs.wins}-${this.playerInfo.careerTotals.playoffs.losses}-${this.playerInfo.careerTotals.playoffs.otLosses}`;
                            this.careerStats.push({
                            'season': '',
                            'team': 'NHL Totals',
                            'league': '',
                            'gamesPlayed': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.gamesPlayed : '',
                            'goalsAgainstAvg': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.goalsAgainstAvg.toFixed(2) : '',
                            'savePctg': (this.playerInfo.careerTotals.regularSeason) ? (this.playerInfo.careerTotals.regularSeason.savePctg.toFixed(3)).slice(1) : '',
                            'shutouts': (this.playerInfo.careerTotals.regularSeason) ? this.playerInfo.careerTotals.regularSeason.shutouts : '',
                            'record': (this.playerInfo.careerTotals.regularSeason) ? record : '',
                            'gamesPlayedP': (this.playerInfo.careerTotals.playoffs) ? this.playerInfo.careerTotals.playoffs.gamesPlayed : '',
                            'goalsAgainstAvgP': (this.playerInfo.careerTotals.playoffs) ? this.playerInfo.careerTotals.playoffs.goalsAgainstAvg.toFixed(2) : '',
                            'savePctgP': (this.playerInfo.careerTotals.playoffs) ? (this.playerInfo.careerTotals.playoffs.savePctg.toFixed(3)).slice(1) : '',
                            'shutoutsP': (this.playerInfo.careerTotals.playoffs) ? this.playerInfo.careerTotals.playoffs.shutouts : '',
                            'recordP': (this.playerInfo.careerTotals.playoffs) ? recordP : '',
                        });
                    }
                }
            }
        },
        formatYear(year) {
            const yearsString = year.toString();
            const startYear = yearsString.slice(0, 4);
            const endYear = yearsString.slice(4);
            return `${startYear}-${endYear}`;
        },
        getSeasonClass(rowData) {
            switch(rowData.league) {
                case 'NHL':
                    return 'nhl-season';
                case '':
                    return 'nhl-total';
                default:
                    return 'default-season';
            }
        },
    },
};
</script>

<style>
.stat-cell {
    border: solid;
    border-width: thin;
    border-color: #17203b;
}
.nhl-season {
    background-color: #53bbddf2;
    color: black;
}
.nhl-total {
    background-color: #17203b;
    color: white;
}
.default-season {
    background-color: #4CAF50;
    color: black;
}
</style>