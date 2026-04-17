<template>
    <div><ProgressSpinner v-if="isLoading" /></div>

    <!-- Month and Year Display with navigation buttons -->
    <div v-if="(!isMobile()) || (isMobile && !gameClicked)" class="calendar-header">
        <button @click="prevMonth">&lt;</button>
        <span style="font-size:x-large;color:#ccc">{{ currentMonthAndYear() }}</span>
        <button @click="nextMonth">&gt;</button>
    </div>
    <div class="schedule-section">
        <div class="calendar">
            <!-- Days of the Week -->
            <div v-if="(!isMobile()) || (isMobile && !gameClicked)" class="weekdays">
                <div v-for="day in daysOfWeek()" :key="day">{{ day }}</div>
            </div>

            <!-- Calendar Days -->
            <div v-if="!isMobile()" class="calendar-days">
                <div v-for="week in weeks" :key="week" style="display:flex;justify-content:space-between">
                    <div v-for="(day, index) in week" :key="index" @click="openGamePopup(day, false)" :class="{ 'no-game-style': checkTeamWin(day)=='none', 'win-style': checkTeamWin(day)=='win', 'lose-style': checkTeamWin(day)=='loss' }" class="calendar-day">
                        <!--MAKE SURE YOU ADD A checkTeamWin VALUE FOR PRESEASON TOO-->
                        <template v-if="day !== ''">
                            <strong style="color:white;width:15%">{{ day }}</strong>
                            <div v-for="game in getGamesForDay(day)" :key="game.id" class="game-details">
                                <div class="game-details-row">
                                    <div class="game-details-team">
                                        <img :src="game.awayTeam.logo" alt="Away Team Logo" class="calendar-team-logo">
                                        <strong>{{ game.awayTeam.abbrev }}</strong>
                                    </div>
                                    <strong>{{ game.awayTeam.score }}</strong>
                                </div>
                                <div class="game-details-row">
                                    <div class="game-details-team">
                                        <img :src="game.homeTeam.logo" alt="Home Team Logo" class="calendar-team-logo">
                                        <strong>{{ game.homeTeam.abbrev }}</strong>
                                    </div>
                                    <strong>{{ game.homeTeam.score }}</strong>
                                </div>
                                <div v-if="game.gameState=='OFF' || game.gameState=='FINAL'" class="game-details-result">
                                    <strong v-if="checkTeamWin(day)=='win'">W</strong>
                                    <strong v-if="checkTeamWin(day)=='loss'">L</strong>
                                    <strong v-if="game.periodDescriptor.periodType!='REG'"> ({{ game.periodDescriptor.periodType }})</strong>
                                </div>
                                <div v-else class="game-details-result">
                                    <strong>{{ gameStartTime(game.startTimeUTC) }}</strong>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div v-if="isMobile() && !gameClicked">
                <div v-for="week in weeks" :key="week" style="display:flex;justify-content:space-between">
                    <div v-for="(day, index) in week" :key="index" @click="openGamePopup(day, false)" :class="{ 'no-game-style': checkTeamWin(day)=='none', 'win-style': checkTeamWin(day)=='win', 'lose-style': checkTeamWin(day)=='loss' }" class="calendar-day">
                        <template v-if="day !== ''">
                            <strong style="color:white;width:15%">{{ day }}</strong>
                            <div v-for="game in getGamesForDay(day)" :key="game.id" class="game-details">
                                <div v-if="!(this.id == game.awayTeam.abbrev)" class="game-details-row">
                                    <div class="game-details-team">
                                        <img :src="game.awayTeam.logo" alt="Away Team Logo" class="calendar-team-logo">
                                    </div>
                                </div>
                                <div v-if="!(this.id == game.homeTeam.abbrev)" class="game-details-row">
                                    <div class="game-details-team">
                                        <img :src="game.homeTeam.logo" alt="Home Team Logo" class="calendar-team-logo">
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scrolling Schedule -->
        <div v-if="!isMobile() && !gameClicked" class="scroll-calendar" ref="scrollPanel">
            <div v-for="game in schedule" :key="game.id" @click="openGamePopup(game, true)" class="scroll-game-details">
                <div class="scroll-game-date">
                    <strong style="color:white;font-size:small">{{ getDate(game, 'date') }}</strong>
                    <strong style="font-size:x-small">{{ getDate(game, 'day') }}</strong>
                </div>
                <div class="scroll-game-team">
                    <strong>{{ getScrollTeam(game, 'where') }}</strong>
                    <img :src="getScrollTeam(game, 'logo')" alt="Away Team Logo" class="scroll-team-logo">
                    <strong>{{ getScrollTeam(game, 'team') }}</strong>
                </div>
                <strong class="scroll-game-results">{{ getScrollResult(game) }}</strong>
            </div>
        </div>

        <!-- Popup Game -->
        <div v-if="gameClicked" class="game-popup">
            <div class="game-popup-header">
                <strong style="color:white">{{ dateDesc(gameClickedInfo.startTimeUTC) }}</strong>
                <strong @click="closePopupGame" class="game-popup-close">X</strong>
            </div>
            <div class="game-popup-teams">
                <div class="game-popup-team-section">
                    <div class="game-popup-team-info">
                        <img :src="gameClickedInfo.awayTeam.logo" alt="Away Team Logo" @click="goToTeam(gameClickedInfo.awayTeam.abbrev)" style="width:100px;cursor:pointer">
                        <strong style="color:white">{{ gameClickedInfo.awayTeam.commonName.default }}</strong>
                        <strong v-if="gameClickedInfo.gameState=='OFF' || gameClickedInfo.gameState=='FINAL'" style="font-size:x-small">SOG: {{ gameClickedInfo.awayTeam.sog }}</strong>
                        <strong v-if="gameClickedInfo.gameState=='PRE' || gameClickedInfo.gameState=='FUT'" style="font-size:x-small">{{ gameClickedInfo.awayTeam.record }}</strong>
                    </div>
                    <strong style="font-size:xx-large;color:white;height:75px">{{ gameClickedInfo.awayTeam.score }}</strong>
                </div>
                <div v-if="gameClickedInfo.gameState=='OFF' || gameClickedInfo.gameState=='FINAL'" class="game-popup-result">
                    <strong>FINAL</strong>
                    <strong v-if="gameClickedInfo.periodDescriptor.number > 3">({{ gameClickedInfo.periodDescriptor.periodType }})</strong>
                </div>    
                    <strong v-if="gameClickedInfo.gameState=='PRE' || gameClickedInfo.gameState=='FUT'" class="game-popup-time">{{ setTime(gameClickedInfo.startTimeUTC) }}</strong>
                <div class="game-popup-team-section">
                    <strong style="font-size:xx-large;color:white;height:75px">{{ gameClickedInfo.homeTeam.score }}</strong>
                    <div class="game-popup-team-info">
                        <img :src="gameClickedInfo.homeTeam.logo" alt="Home Team Logo" @click="goToTeam(gameClickedInfo.homeTeam.abbrev)" style="width:100px;cursor:pointer">
                        <strong style="color:white">{{ gameClickedInfo.homeTeam.commonName.default }}</strong>
                        <strong v-if="gameClickedInfo.gameState=='OFF' || gameClickedInfo.gameState=='FINAL'" style="font-size:x-small">SOG: {{ gameClickedInfo.homeTeam.sog }}</strong>
                        <strong v-if="gameClickedInfo.gameState=='PRE' || gameClickedInfo.gameState=='FUT'" style="font-size:x-small">{{ gameClickedInfo.homeTeam.record }}</strong>
                    </div>
                </div>
            </div>
            <div class="popup-open-game">
                <button @click="openGame(gameClickedInfo)">&#8680;</button>
            </div>
            <!-- Popup Game Linescore -->
            <div v-if="gameClickedInfo.gameState=='OFF' || gameClickedInfo.gameState=='FINAL'">
                <strong>Linescore</strong>
                <DataTable :value="popupLineScore">
                    <Column style="width: 3%">
                        <template #body="slotProps">
                          <img :src="slotProps.data.logo" :alt="slotProps.data.team"/>
                        </template>
                    </Column>
                    <Column field="team" header="" style="width: 5%"></Column>
                    <Column field="first" header="1st" sortable style="width: 5%"></Column>
                    <Column field="second" header="2nd" style="width: 5%"></Column>
                    <Column field="third" header="3rd" sortable style="width: 5%"></Column>
                    <!-- <Column v-if="gameClickedInfo.summary && gameClickedInfo.summary.shotsByPeriod.length>3" field="overtime" header="OT" sortable style="width: 5%"></Column> -->
                    <Column field="total" header="T" sortable style="width: 5%"></Column>
                </DataTable>
            </div>
            <!-- Popup Game Three Stars -->
            <div v-if="gameClickedInfo.gameState=='OFF' || gameClickedInfo.gameState=='FINAL'" style="margin-top:1rem">
                <strong>Three Stars</strong>
                <div class="popup-three-stars-box">
                    <div v-for="(player, index) in gameClickedInfo.summary.threeStars" :key="index" style="width:30%;font-size:small">
                        <div style="display:flex;flex-direction:column">
                            <div class="popup-star-layout">
                                <div style="display:flex;color:white">
                                    <strong>{{ getStarNum(index) }}</strong>
                                    <img src="@/assets/star.svg" alt="Star" style="padding-left:5px"/>
                                </div>
                                <img :src="getPlayerTeamLogo(player.teamAbbrev)" alt="Player Team Logo" class="popup-player-team-logo">
                            </div>
                            <div class="popup-three-stars-column">
                                <strong v-if="player.name.default" style="color:white">{{ player.name.default }}</strong>
                                <strong v-else style="color:white">{{ player.name }}</strong>
                                <strong>#{{ player.sweaterNo }} - {{ player.position }}</strong>
                                <strong></strong>
                            </div>
                        </div>
                        <div>
                            <div v-if="player.position=='G'" style="display:flex;justify-content:space-between">
                                <div class="popup-three-stars-column">
                                    <strong style="color:white">{{ configureThreeStars(player, 'saveShotsAgainst', 'SA') }}</strong>
                                    <strong style="font-size:x-small">SA</strong>
                                </div>
                                <div class="popup-three-stars-column">
                                    <strong style="color:white">{{ configureThreeStars(player, 'goalsAgainst') }}</strong>
                                    <strong style="font-size:x-small">GA</strong>
                                </div>
                                <div class="popup-three-stars-column">
                                    <strong style="color:white">{{ configureThreeStars(player, 'savePctg') }}</strong>
                                    <strong style="font-size:x-small">SV%</strong>
                                </div>
                            </div>
                            <div v-else style="display:flex;justify-content:space-between">
                                <div class="popup-three-stars-column">
                                    <strong style="color:white">{{ configureThreeStars(player, 'goals') }}</strong>
                                    <strong style="font-size:x-small">G</strong>
                                </div>
                                <div class="popup-three-stars-column">
                                    <strong style="color:white">{{ configureThreeStars(player, 'assists') }}</strong>
                                    <strong style="font-size:x-small">A</strong>
                                </div>
                                <div class="popup-three-stars-column">
                                    <strong style="color:white">{{ configureThreeStars(player, 'toi') }}</strong>
                                    <strong style="font-size:x-small">TOI</strong>
                                </div>
                            </div>
                        </div>
                        <div v-if="index==0 || index==1" class="popup-vertical-line-stars"><div class="popup-vertical-line" style="margin-right:-8px"></div></div>
                    </div>
                </div>
            </div>
            <!-- SEASON SERIES -->
            <div v-if="(gameClickedInfo.gameState=='PRE' || gameClickedInfo.gameState=='FUT') && gameClickedInfo.matchup.seasonSeries">
                <strong style="padding:5px">Season Series</strong>
                <div class="season-series-games">
                    <div v-for="(seriesGame, index) in gameClickedInfo.matchup.seasonSeries" :key="index" @click="openGame(seriesGame)" class="season-series-game">
                        <div class="season-series-content">
                            <!-- Away Team -->
                            <div class="team-info">
                                <div style="display:flex;align-items: center">
                                    <img :src="seriesGame.awayTeam.logo" alt="Away Team Logo" style="width:35px">
                                    <strong>{{ seriesGame.awayTeam.abbrev }}</strong>
                                </div>
                                <strong v-if="seriesGame.gameState=='OFF' || seriesGame.gameState=='FINAL'" class="team-score">{{ seriesGame.awayTeam.score }}</strong>
                            </div>
                        </div>
                        <div class="season-series-content">
                            <!-- Home Team -->
                            <div class="team-info">
                                <div style="display:flex;align-items: center">
                                    <img :src="seriesGame.homeTeam.logo" alt="Home Team Logo" style="width:35px">
                                    <strong>{{ seriesGame.homeTeam.abbrev }}</strong>
                                </div>
                                <strong v-if="seriesGame.gameState=='OFF' || seriesGame.gameState=='FINAL'" class="team-score">{{ seriesGame.homeTeam.score }}</strong>
                            </div>
                        </div>
                        <div v-if="seriesGame.gameState=='OFF' || seriesGame.gameState=='FINAL'" class="game-info">
                            <strong v-if="seriesGame.periodDescriptor.number==3" style="font-size:small">FINAL</strong>
                            <strong v-if="seriesGame.periodDescriptor.number!=3" style="font-size:small">FINAL({{ seriesGame.periodDescriptor.periodType }})</strong>
                            <strong style="font-size:small">{{ seriesGameDateDesc(seriesGame.startTimeUTC) }}</strong>
                        </div>
                        <strong v-else style="display:flex;justify-content:flex-end;font-size:small">{{ seriesGameDateDesc(seriesGame.startTimeUTC) }}</strong>
                    </div>
                </div>
            </div>
            <!-- TEAM STATS -->
            <div v-if="(gameClickedInfo.gameState=='PRE' || gameClickedInfo.gameState=='FUT') && gameClickedInfo.matchup.teamSeasonStats" class="team-stats">
                <div class="popup-game-stat" style="margin-bottom:5px">
                    <div class="away-game-stat"><img :src="gameClickedInfo.awayTeam.logo" alt="Team Stats Logo" style="width: 30px"><strong style="color:white">{{ gameClickedInfo.awayTeam.abbrev }}</strong></div>
                    <strong style="color:white">Team Stats</strong>
                    <div class="home-game-stat"><strong style="color:white">{{ gameClickedInfo.homeTeam.abbrev }}</strong><img :src="gameClickedInfo.homeTeam.logo" alt="Team Stats Logo" style="width: 30px"></div>
                </div>
                <!-- pp% category -->
                <div class="popup-game-stat">
                    <div class="away-game-stat"><strong>{{ calculatePercentage(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.ppPctg, 1) }}%</strong><strong style="font-size:x-small;margin-left:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.ppPctgRank) }})</strong></div>
                    <strong>Power Play %</strong>
                    <div class="home-game-stat"><strong style="font-size:x-small;margin-right:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.homeTeam.ppPctgRank) }})</strong><strong>{{ calculatePercentage(gameClickedInfo.matchup.teamSeasonStats?.homeTeam.ppPctg, 1) }}%</strong></div>
                </div>
                <div class="progress-bar">
                    <div class="progress" :style="{ width: calculateProgressPercentage(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.ppPctg, gameClickedInfo.matchup.teamSeasonStats?.homeTeam.ppPctg) + '%' }"></div>
                </div>
                <!-- pk% category -->
                <div class="popup-game-stat">
                    <div class="away-game-stat"><strong>{{ calculatePercentage(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.pkPctg, 1) }}%</strong><strong style="font-size:x-small;margin-left:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.pkPctgRank) }})</strong></div>
                    <strong>Penalty Kill %</strong>
                    <div class="home-game-stat"><strong style="font-size:x-small;margin-right:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.homeTeam.pkPctgRank) }})</strong><strong>{{ calculatePercentage(gameClickedInfo.matchup.teamSeasonStats?.homeTeam.pkPctg, 1) }}%</strong></div>
                </div>
                <div class="progress-bar">
                    <div class="progress" :style="{ width: calculateProgressPercentage(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.pkPctg, gameClickedInfo.matchup.teamSeasonStats?.homeTeam.pkPctg) + '%' }"></div>
                </div>
                <!-- fo% category -->
                <div class="popup-game-stat">
                    <div class="away-game-stat"><strong>{{ calculatePercentage(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.faceoffWinningPctg, 1) }}%</strong><strong style="font-size:x-small;margin-left:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.faceoffWinningPctgRank) }})</strong></div>
                    <strong>Faceoff %</strong>
                    <div class="home-game-stat"><strong style="font-size:x-small;margin-right:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.homeTeam.faceoffWinningPctgRank) }})</strong><strong>{{ calculatePercentage(gameClickedInfo.matchup.teamSeasonStats?.homeTeam.faceoffWinningPctg, 1) }}%</strong></div>
                </div>
                <div class="progress-bar">
                    <div class="progress" :style="{ width: calculateProgressPercentage(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.faceoffWinningPctg, gameClickedInfo.matchup.teamSeasonStats?.homeTeam.faceoffWinningPctg) + '%' }"></div>
                </div>
                <!-- gf/g% category -->
                <div class="popup-game-stat">
                    <div class="away-game-stat"><strong>{{ gameClickedInfo.matchup.teamSeasonStats?.awayTeam.goalsForPerGamePlayed }}</strong><strong style="font-size:x-small;margin-left:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.goalsForPerGamePlayedRank) }})</strong></div>
                    <strong>GF/GP</strong>
                    <div class="home-game-stat"><strong style="font-size:x-small;margin-right:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.homeTeam.goalsForPerGamePlayedRank) }})</strong><strong>{{ gameClickedInfo.matchup.teamSeasonStats?.homeTeam.goalsForPerGamePlayed }}</strong></div>
                </div>
                <div class="progress-bar">
                    <div class="progress" :style="{ width: calculateProgressPercentage(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.goalsForPerGamePlayed, gameClickedInfo.matchup.teamSeasonStats?.homeTeam.goalsForPerGamePlayed) + '%' }"></div>
                </div>
                <!-- ga/g% category -->
                <div class="popup-game-stat">
                    <div class="away-game-stat"><strong>{{ gameClickedInfo.matchup.teamSeasonStats?.awayTeam.goalsAgainstPerGamePlayed }}</strong><strong style="font-size:x-small;margin-left:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.goalsAgainstPerGamePlayedRank) }})</strong></div>
                    <strong>GA/GP</strong>
                    <div class="home-game-stat"><strong style="font-size:x-small;margin-right:4px">({{ getRanking(gameClickedInfo.matchup.teamSeasonStats?.homeTeam.goalsAgainstPerGamePlayedRank) }})</strong><strong>{{ gameClickedInfo.matchup.teamSeasonStats?.homeTeam.goalsAgainstPerGamePlayed }}</strong></div>
                </div>
                <div class="progress-bar">
                    <div class="progress" :style="{ width: calculateProgressPercentage(gameClickedInfo.matchup.teamSeasonStats?.awayTeam.goalsAgainstPerGamePlayed, gameClickedInfo.matchup.teamSeasonStats?.homeTeam.goalsAgainstPerGamePlayed) + '%' }"></div>
                </div>
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
import ScrollPanel from 'primevue/scrollpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { fetchApi } from '@/services/fetchApi';

export default {
    name: 'Schedule',
    components: {
        ProgressSpinner,
        ScrollPanel,
        DataTable,
        Column,
    },
    props: {
        id: String,
    },
    mounted() {
        this.fetchTeamSchedule().then(() => {
            this.calculateWeeks();
            this.scrollToNextGame(false);
        }).catch(error => {
            console.error('Error fetching schedule:', error);
            alert('Error fetching schedule. See console for details.');
        });
    },
    data() {
        return {
            isLoading: true,
            date: new Date(),
            currentDate: new Date(), // Initialize selectedDate
            error: null,
            schedule: [],
            weeks: [],
            gameClicked: false,
            gameClickedInfo: {},
            popupLineScore: [],
            boxScore: [],
        };
    },
    methods: {
        isMobile() {
            return window.innerWidth <= 640;
        },
        async fetchTeamSchedule() {
            try {
                const year = this.date.getFullYear();
                const month = this.date.getMonth() + 1;
                let seasonYears;
                if (month < 9) //if before september set season to 2024-2025
                    seasonYears = (year - 1) + '' + year;
                else //if after september set season to 2025-2026
                    seasonYears = year + '' + (year + 1);

                const response = await fetchApi(`/api/v1/club-schedule-season/${this.id}/${seasonYears}`);
                const data = await response.json();
                console.log(data);
                this.schedule = data.games;
                this.isLoading = false;
            } catch (error) {
              console.error('Error fetching scores:', error);
              alert('Error fetching calendar. See console for details.');
            }
        },
        async openGamePopup(item, sentGame) {
            let game = {};
            if(sentGame)
                game = item;
            else
                game = (this.getGamesForDay(item))[0];

            if(game) {
                this.date = new Date(game.startTimeUTC);
                this.isLoading = true;
                try {
                    const response = await fetchApi(`/api/v1/gamecenter/${game.id}/landing`);
                    const data = await response.json();
                    this.gameClicked = true;
                    this.gameClickedInfo = data;
                    this.configureLineScore();
                } catch (error) {
                  console.error('Error fetching scores:', error);
                  alert('Error fetching scores. See console for details.');
                }

                try {
                    const response = await fetchApi(`/api/v1/gamecenter/${game.id}/boxscore`);
                    const data = await response.json();
                    this.boxScore = data;
                    this.isLoading = false;
                } catch (error) {
                  console.error('Error fetching scores:', error);
                  alert('Error fetching scores. See console for details.');
                }
            } else {
                this.gameClicked = false;
                this.scrollToNextGame();
            }
        },
        currentMonthAndYear() {
            const options = { month: 'long', year: 'numeric' };
            return this.date.toLocaleDateString('en-US', options);
        },
        daysOfWeek() {
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        },
        calculateWeeks() {
            const year = this.date.getFullYear();
            const month = this.date.getMonth();
            const firstDayOfMonth = new Date(year, month, 1);
            const firstDayOfWeek = firstDayOfMonth.getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const weeks = [[]];
            for (let i = 0; i < firstDayOfWeek; i++) {
              weeks[0].push('');
            }
            let currentWeek = 0;
            for (let i = 1; i <= daysInMonth; i++) {
                if (weeks[currentWeek].length === 7) {
                    weeks.push([]);
                    currentWeek++;
                }
                weeks[currentWeek].push(i);
            }
            const lastDayOfWeek = new Date(year, month, daysInMonth).getDay();
            for (let i = lastDayOfWeek + 1; i < 7; i++) {
                weeks[currentWeek].push('');
            }
            this.weeks = weeks;
        },
        prevMonth() {
            this.date.setMonth(this.date.getMonth() - 1);
            this.calculateWeeks();
            this.scrollToNextGame(true);
        },
        nextMonth() {
            this.date.setMonth(this.date.getMonth() + 1);
            this.calculateWeeks();
            this.scrollToNextGame(true);
        },
        getGamesForDay(day) {
            const year = this.date.getFullYear();
            const month = this.date.getMonth() + 1; // Month is zero-based, so we add 1
            const formattedMonth = month < 10 ? '0' + month : month; // Ensure two-digit month
            const formattedDay = day < 10 ? '0' + day : day; // Ensure two-digit day
            const gameDate = `${year}-${formattedMonth}-${formattedDay}`;
            return this.schedule.filter(game => game.gameDate === gameDate);
        },
        checkTeamWin(day) {
            const game = this.getGamesForDay(day);
            if(game[0]) {
                if(game[0].gameState=="OFF" || game[0].gameState=="FINAL") {
                    if(game[0].awayTeam.score > game[0].homeTeam.score && game[0].awayTeam.abbrev == this.id) //awayTeam wins and this team is awayTeam
                        return 'win';
                    else if(game[0].awayTeam.score > game[0].homeTeam.score && game[0].awayTeam.abbrev != this.id) //awayTeam wins and this team is not awayTeam
                        return 'loss';
                    else if(game[0].homeTeam.score > game[0].awayTeam.score && game[0].homeTeam.abbrev == this.id) //homeTeam wins and this team is homeTeam
                        return 'win';
                    else //homeTeam wins and this team is not homeTeam
                        return 'loss';
                }
            }
            else {
                return 'none';
            }
        },
        gameStartTime(utcDateTime) {
            // Convert UTC string to Date object
            const utcDate = new Date(utcDateTime);
            // Set options for converting to local time
            const options = {
              hour12: true,
              hour: 'numeric',
              minute: 'numeric',
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Get user's local time zone
            };
            // Create a new DateTimeFormat object with the desired options
            const formatter = new Intl.DateTimeFormat('en-US', options);
            // Format the UTC date to local time string
            const localTimeString = formatter.format(utcDate);
            return localTimeString;
        },
        getDate(game, type) {
            const dateObj = new Date(game.startTimeUTC);
            if (type === 'date') {
                const month = dateObj.toLocaleString('default', { month: 'short' });
                const date = dateObj.getDate();
                return `${month} ${date}`;
            } else if (type === 'day') {
                return dateObj.toLocaleString('en-us', { weekday: 'short' }).toUpperCase();
            }
        },
        setTime(utcTime) {
            const localTime = new Date(utcTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return localTime;
        },
        dateDesc(dateStartTime) {
            const startTime = new Date(dateStartTime);
            return startTime.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        },
        seriesGameDateDesc(dateString) {
            const date = new Date(dateString);
            const month = date.toLocaleString('en-US', { month: 'short' });
            const day = date.getDate();
            const formattedDate = `${month.toUpperCase()} ${day}`;
            return formattedDate;
        },
        scrollToNextGame(firstDay) {
            if(!this.gameClicked) {
                this.$nextTick(() => {
                    let currentDate = this.date;
                    if(firstDay)
                        currentDate.setDate(1);
                    const nextGameIndex = this.schedule.findIndex(game => new Date(game.startTimeUTC) > currentDate);
                    if (nextGameIndex !== -1) {
                        // Get the scroll panel reference
                        const scrollPanelRef = this.$refs.scrollPanel;
                        if (scrollPanelRef && scrollPanelRef.scrollTo) {
                            // Calculate the scroll position
                            const rowHeight = 45; // Adjust this value based on your design
                            const scrollPosition = nextGameIndex * rowHeight;

                            // Scroll to the calculated position
                            scrollPanelRef.scrollTo(0, scrollPosition);
                        } else {
                            console.error('Scroll panel reference or scrollTo method is undefined');
                        }
                    }
                });
            }
        },
        getScrollTeam(game, type) {
            if(game.awayTeam.abbrev != this.id) {
                switch(type) {
                    case 'where':
                        return 'vs';
                    case 'logo':
                        return game.awayTeam.logo;
                    case 'team':
                        return game.awayTeam.placeName.default;
                }
            }
            else {
                switch(type) {
                    case 'where':
                        return 'at';
                    case 'logo':
                        return game.homeTeam.logo;
                    case 'team':
                        return game.homeTeam.placeName.default;
                }
            }
        },
        getScrollResult(game) {
            if(game.gameState=='OFF' || game.gameState=='FINAL') {
                let outcome = '';
                if(game.gameOutcome.lastPeriodType!='REG')
                    outcome = game.gameOutcome.lastPeriodType;

                if(game.awayTeam.abbrev == this.id && (game.awayTeam.score > game.homeTeam.score))
                    return `${outcome} W ${game.awayTeam.score}-${game.homeTeam.score}`;
                else if(game.awayTeam.abbrev == this.id && (game.awayTeam.score < game.homeTeam.score))
                    return `${outcome} L ${game.homeTeam.score}-${game.awayTeam.score}`;
                else if(game.homeTeam.abbrev == this.id && (game.homeTeam.score > game.awayTeam.score))
                    return `${outcome} W ${game.homeTeam.score}-${game.awayTeam.score}`;
                else
                    return `${outcome} L ${game.awayTeam.score}-${game.homeTeam.score}`;

            } else {
                return this.gameStartTime(game.startTimeUTC);
            }
        },
        configureLineScore() {
            this.popupLineScore = [];
            if((this.gameClickedInfo.gameState == "OFF" || this.gameClickedInfo.gameState == "FINAL") && (this.gameClickedInfo.summary.scoring)) {
                let tempScoreAway = {"logo": this.gameClickedInfo.awayTeam.logo, "team": this.gameClickedInfo.awayTeam.abbrev, "first": 0, "second": 0, "third": 0, "overtime": 0, "total": this.gameClickedInfo.awayTeam.score};
                let tempScoreHome = {"logo": this.gameClickedInfo.homeTeam.logo, "team": this.gameClickedInfo.homeTeam.abbrev, "first": 0, "second": 0, "third": 0, "overtime": 0, "total": this.gameClickedInfo.homeTeam.score};
                for(let i = 0; i < this.gameClickedInfo.summary.scoring.length; i++) {
                    for(let j = 0; j < this.gameClickedInfo.summary.scoring[i].goals.length; j++) {
                        switch(i) {
                            case 0:
                                if(this.gameClickedInfo.summary.scoring[i].goals[j].isHome)
                                    tempScoreHome.first += 1;
                                else
                                    tempScoreAway.first += 1;
                                break;
                            case 1:
                                if(this.gameClickedInfo.summary.scoring[i].goals[j].isHome)
                                    tempScoreHome.second += 1;
                                else
                                    tempScoreAway.second += 1;
                                break;
                            case 2:
                                if(this.gameClickedInfo.summary.scoring[i].goals[j].isHome)
                                    tempScoreHome.third += 1;
                                else
                                    tempScoreAway.third += 1;
                                break;
                            case 3:
                                if(this.gameClickedInfo.summary.scoring[i].goals[j].isHome)
                                    tempScoreHome.overtime += 1;
                                else
                                    tempScoreAway.overtime += 1;
                                break;
                        }
                    }
                }
                this.popupLineScore.push(tempScoreAway);
                this.popupLineScore.push(tempScoreHome);
            }
        },
        configureThreeStars(player, statType, goalieStatType) {
            if(this.boxScore.id && (this.gameClickedInfo.gameState == "OFF" || this.gameClickedInfo.gameState == "FINAL")) {
                //this if/else statement checks the api call and uses the proper json
                let boxScore = {};
                if(this.boxScore.boxscore)
                    boxScore = this.boxScore.boxscore
                else if(this.boxScore.playerByGameStats)
                    boxScore = this.boxScore
                //
                // Determine the team abbreviation
                const teamAbbrev = player.teamAbbrev;
                const teamStats = teamAbbrev === this.boxScore.awayTeam.abbrev ? 
                    boxScore.playerByGameStats.awayTeam :
                    boxScore.playerByGameStats.homeTeam;

                // Determine the position
                const position = player.position;
                // Get the appropriate array based on the position
                let playerArray;
                switch(position) {
                    case 'C':
                    case 'L':
                    case 'R':
                        playerArray = teamStats.forwards;
                        break;
                    case 'D':
                        playerArray = teamStats.defense;
                        break;
                    case 'G':
                        playerArray = teamStats.goalies;
                        break;
                    default:
                        return null;
                }
                // Find the player in the array
                const foundPlayer = playerArray.find(p => p.playerId === player.playerId);
                // Return the stat value
                if (foundPlayer) {
                    if (position === 'G' && goalieStatType) {
                        const [saves, shots] = foundPlayer[statType].split('/');
                        return goalieStatType === 'SV' ? parseInt(saves) : parseInt(shots);
                    } else {
                        return foundPlayer[statType];
                    }
                } else {
                    return null;
                }
            }
        },
        getStarNum(num) {
            switch(num) {
                case 0:
                    return '1ST';
                case 1:
                    return '2ND';
                case 2:
                    return '3RD';
                default:
                    return num;
            }
        },
        calculateProgressPercentage(awayValue, homeValue) {
            let totalValue = awayValue + homeValue;
            if(typeof awayValue === 'string')
                totalValue = parseFloat(awayValue) + parseFloat(homeValue);
            const percentage = (parseFloat(awayValue) / totalValue) * 100;
            return isNaN(percentage) ? 0 : percentage;
        },
        calculatePercentage(value, toDecimal) {
            return (value*100).toFixed(toDecimal);
        },
        getRanking(value) {
            switch(value) {
                case 1:
                case 21:
                case 31:
                    return value+'st';
                case 2:
                case 22:
                case 32:
                    return value+'nd';
                case 3:
                case 23:
                    return value+'rd';
                default:
                    return value+'th';
            }
        },
        getPlayerTeamLogo(teamAbbrev) {
            if(teamAbbrev == this.gameClickedInfo.awayTeam.abbrev)
                return this.gameClickedInfo.awayTeam.logo;
            else
                return this.gameClickedInfo.homeTeam.logo;
        },
        closePopupGame() {
            this.gameClicked = false;
            this.scrollToNextGame();
        },
        openGame(game) {
            this.$router.push({ name: 'game', params: { id: game.id }, query: { date: game.gameDate } });
        },
        goToTeam(abbrev) {
            const newUrl = window.location.href.replace(/\/team\/\w+/, `/team/${abbrev}`);
            window.location.href = newUrl;
            setTimeout(() => {
                window.location.reload();
            }, 50);
        },
    },
};
</script>

<style>
.schedule-section {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
}

.calendar {
    width: 70%;
}

.calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    margin-bottom: 10px;
}

.calendar-header button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 2rem;
    color: #ccc;
    padding-left: 30px;
    padding-right: 30px;
}

.weekdays {
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
}

.calendar-day {
    width: 100%;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    font-size: 0.8rem;
    padding: 5px;
}

.calendar-day:hover {
    cursor: pointer;
    background-color: var(--hover-color);
    transition: 0.5s ease;
}

.win-style {
  background-color: #01c58a94;
  color: white;
}

.lose-style {
  background-color: #ff00004f;
  color: white;
}

.game-details {
    margin-top: 20px;
    margin-left: -15px;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.game-details-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: large;
}

.game-details-team {
    display: flex;
    align-items: center;
}

.calendar-team-logo {
    width: 35px;
}

.game-details-result {
    align-self: flex-end;
    margin-top: -5px;
    height: -48px;
    font-size: small;
}

.scroll-calendar {
    margin-top: 2rem;
    border: solid;
    border-width: thin;
    border-color: white;
    border-radius: 5px;
    padding: 5px;
    width: 28%;
    float: right;
    height: 505px;
    overflow-y: auto;
}

.scroll-game-details {
    display: flex;
    justify-content: space-between;
    border-bottom: double;
    border-width: thin;
    border-color: #ffffff14;
    padding: 5px;
}

.scroll-game-details:hover {
    cursor: pointer;
    background-color: var(--hover-color);
    border-radius: 5px;
    transition: 0.5s ease;
}

.scroll-game-date {
    width: 25%;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    align-items: center;
    background-color: #7171714d;
}

.scroll-game-team {
    width: 50%;
    display: flex;
    align-items: center;
    padding-left: 10px;
}

.scroll-game-results {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: small;
}

.scroll-team-logo {
    width: 25px;
    margin-left: 5px;
}

.game-popup {
    margin-top: 2rem;
    border: solid;
    border-width: thin;
    border-color: #ccc;
    border-radius: 10px;
    padding: 5px;
    width: 28%;
    float: right;
    display: flex;
    flex-direction: column;
}

.popup-open-game {
    display: flex;
    justify-content: center;
}

.popup-open-game button{
    background-color: #00000000;
    border: none;
    cursor: pointer;
    font-size: 40px;
    color: var(--hover-color);
}

.popup-open-game:hover button{
    color: var(--main-color);
    transition: 0.5s ease;
}

.game-popup-close {
    font-size: large;
}

.game-popup-close:hover {
    cursor: pointer;
    color: white;
    transition: 0.5s ease;
}

.game-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
}

.game-popup-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: small;
}

.game-popup-time {
    display: flex;
    width: 35%;
    justify-content: center;
    font-size: large;
    align-items: center;
}

.game-popup-teams {
    display: flex;
    justify-content: space-between;
    padding: 5px;
}

.game-popup-team-section {
    width: 40%;
    height: 125%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.game-popup-team-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.popup-three-stars-box {
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    display:flex;
    justify-content:space-between;
    padding: 10px;
}

.popup-star-layout {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-content: space-between;
}

.popup-three-stars-column {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.popup-player-team-logo {
    width: 40px;
}

.popup-vertical-line-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.popup-vertical-line {
    border-left: 1px solid #ffffff1c;
    height: 100%;
}

.popup-vertical-line-stars {
    display: flex;
    align-items: center;
    justify-content: end;
    height: 100%;
    margin-top: -108px;
}

.popup-game-stat {
    display: flex;
    justify-content: space-between;
    font-size: small;
    margin-top: 3px;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
    .calendar {
        width: 100%;
    }
    .calendar-header {
        margin-top: 0rem;
        margin-bottom: 0px;
    }
    .calendar-team-logo {
        width: 42px;
        height: 42px;
        margin-right: -7px;
    }
    .calendar-day {
        height: 65px;
    }
    .game-details {
        margin-top: 11px;
        margin-left: -18px;
    }
    .game-details-team {
        margin-left: 8px;
    }
    .popup-open-game {
        height: 20px;
    }
    .popup-open-game button {
        margin-top: -15px;
    }
    .game-popup {
        margin-top: 0rem;
        width: 100%;
        border: none;
        height: calc(100dvh - 310px);
        overflow-y: auto;
    }
    .game-popup-teams {
        height: 100px;
    }
    .game-popup .p-datatable-table {
        width: 100%;
    }
    .schedule-section {
        flex-direction: column;
        margin-top: 0rem;
    }
}
</style>