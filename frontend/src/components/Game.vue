<template>
    <div>
      <!-- <h2>{{ pageTitle }} - Game Page</h2> -->
      <!-- <p>Game ID: {{ id }}</p> -->
      <!-- ... (other content) -->
    </div>
    <div><ProgressSpinner v-if="isLoading" /></div>

    <div class="highlight-modal" v-if="showHighlight" @click="showHighlight=false">
        <div class="highlight-modal-content" @click.stop>
            <span class="highlight-close" @click="showHighlight=false">&times;</span>
            <!-- <video :src="`https://edge.api.brightcove.com/playback/v1/accounts/6415718365001/videos/6347431119112`" controls autoplay style="width:650px;height:400px;border-radius:10px"></video> -->
            <!-- <iframe
              :src="highlightUrl"
              width="650"
              height="400"
              style="border-radius:10px"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            /> -->
            <video
              v-if="highlightUrl"
              :src="highlightUrl"
              controls
              autoplay
              playsinline
              style="width:100%"
            />
        </div>
    </div>

    <div v-if="game.gameType">
        <div class="game-nav-header">
            <button @click="goBack" class="back-button">&#9664;</button>
            <strong class="date-formatting">{{ dateDesc() }}</strong>
            <div class="game-settings-section">
                <Settings></Settings>
                <Account></Account>
                <Options></Options>
            </div>
        </div>
        <!-- SCOREBOARD -->
        <div class="scoreboard">
            <!-- Away Scoreboard -->
            <div class="away-scoreboard">
                <img :src="game.awayTeam.logo" alt="Away Team Logo" @click="goToTeam(game.awayTeam.abbrev)" class="team-logo-game away">
                <div @click="goToTeam(game.awayTeam.abbrev)" class="scoreboard-layout away">
                    <strong class="scoreboard-city-name" :class="{'game-favorite-team': isFavoriteTeam(game.awayTeam.abbrev)}">{{ game.awayTeam.placeName.default }}</strong>
                    <strong class="scoreboard-team-name" :class="{'game-favorite-team': isFavoriteTeam(game.awayTeam.abbrev)}">{{ game.awayTeam.commonName.default }}</strong>
                    <strong v-if="game.gameState=='PRE' || game.gameState=='FUT'" style="font-size:small">{{ game.awayTeam.record }}</strong>
                    <strong v-if="game.awayTeam.sog" class="scoreboard-team-sog">SOG: {{ game.awayTeam.sog }}</strong>
                </div>
                <div class="game-score-layout away">
                    <strong v-if="game.situation && game.situation.awayTeam.situationDescriptions" class="game-powerplay-tag away">PP</strong>
                    <strong v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" class="away-team-score-layout" :class="{pp: game.situation && game.situation.awayTeam.situationDescriptions}">{{ game.awayTeam.score }}</strong>
                </div>
            </div>
            <!-- Middle Scoreboard -->
            <div class="scoreboard-layout-middle">
                <div v-if="game.gameState=='PRE' || game.gameState=='FUT'" class="middle-scoreboard">
                    <strong>{{ gameStartTime(game.startTimeUTC) }}</strong>
                    <strong>{{ game.venue.default }}</strong>
                </div>
                <div v-else class="middle-scoreboard">
                    <strong v-if="(game.gameState=='LIVE' || game.gameState=='CRIT') && !game.clock.inIntermission" style="font-size:large">{{ game.clock.timeRemaining }}</strong>
                    <strong v-if="(game.gameState=='LIVE' || game.gameState=='CRIT')">{{ getPeriodScoreboard(false, game.periodDescriptor.number, game.gameType, game?.clock?.inIntermission,) }}</strong>
                    <strong v-if="game.gameState=='OFF' || game.gameState=='FINAL'" style="font-size:large">Final</strong>
                    <strong v-if="game.gameState=='OFF' || game.gameState=='FINAL'">{{ getPeriodScoreboard(true, game.periodDescriptor.number, game.gameType) }}</strong>
                </div>
            </div>
            <!-- Home Scoreboard -->
            <div class="home-scoreboard">
                <div class="game-score-layout home">
                    <strong v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" class="home-team-score-layout" :class="{pp: game.situation && game.situation.homeTeam.situationDescriptions}">{{ game.homeTeam.score }}</strong>
                    <strong v-if="game.situation && game.situation.homeTeam.situationDescriptions" class="game-powerplay-tag home">PP</strong>
                </div>
                <div @click="goToTeam(game.homeTeam.abbrev)" class="scoreboard-layout home">
                    <strong class="scoreboard-city-name" :class="{'game-favorite-team': isFavoriteTeam(game.homeTeam.abbrev)}">{{ game.homeTeam.placeName.default }}</strong>
                    <strong class="scoreboard-team-name" :class="{'game-favorite-team': isFavoriteTeam(game.homeTeam.abbrev)}">{{ game.homeTeam.commonName.default }}</strong>
                    <strong v-if="game.gameState=='PRE' || game.gameState=='FUT'" style="font-size:small">{{ game.homeTeam.record }}</strong>
                    <strong v-if="game.homeTeam.sog" class="scoreboard-team-sog">SOG: {{ game.homeTeam.sog }}</strong>
                </div>
                <img :src="game.homeTeam.logo" alt="Home Team Logo" @click="goToTeam(game.homeTeam.abbrev)" class="team-logo-game home">
            </div>
        </div>
        <div style="margin-top:20px;"></div>
        <PullToRefresh scrollSelector=".game-summary" @refresh="refreshGame">
            <div class="game-summary">
                <div class="game-left-side">
                    <!-- GAME PLAYS -->
                    <div v-if="(game.gameState=='LIVE' || game.gameState=='CRIT') && plays.length>0" style="margin-top:1rem">
                        <h3 style="margin-top:-1rem;color:white">Last Play</h3>
                        <div class="last-play-box">
                            <div class="last-play">
                                <img v-if="plays[0].team" :src="plays[0].team" :alt="plays[0].team" style="padding-right:3%;width:50px"/>
                                <strong style="padding-right:5%">{{ plays[0].time }}</strong>
                                <strong>{{ plays[0].event }}</strong>
                            </div>
                            <!-- <Accordion class="plays-section"> //Only use this if you want all plays in game displayed
                                <AccordionTab header="">
                                    <div class="plays-section-dropdown">
                                        <DataTable :value="plays" tableStyle="width: 100%">
                                            <Column style="width:5%">
                                                <template #body="slotProps">
                                                    <img :src="slotProps.data.team" :alt="slotProps.data.team" style="width:30px"/>
                                                </template>
                                            </Column>
                                            <Column field="time" header="" style="width:5%"></Column>
                                            <Column field="event" header="" style="width:50%;text-align:left"></Column>
                                        </DataTable>
                                    </div>
                                </AccordionTab>
                            </Accordion> -->
                        </div>
                    </div>

                    <!-- SCORING SUMMARY -->
                    <div v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" class="scoring-summary">
                        <div v-for="period in game.summary.scoring">
                            <h3 v-if="period.goals[0]">{{ getPeriod(period, game.gameType) }}</h3>
                            <div v-if="period.periodDescriptor.periodType!='SO'" v-for="goal in period.goals" :key="goal.id" class="goal-box">
                                <img :src="goal.headshot" @click="goToPlayer(goal.playerId)" alt="Player Logo" class="player-logo">
                                <img :src="getPlayerTeamLogo(goal.teamAbbrev.default)" alt="Player Team Logo" class="player-team-logo">
                                <div class="summary-players">
                                    <div>
                                        <strong @click="goToPlayer(goal.playerId)" class="goal-text">{{ goal.name.default }} <strong class="goal-text-amount">{{ getGoalsInGame(goal.playerId, goal.goalsToDate) }}</strong><strong class="goal-text-amount"> ({{ goal.goalsToDate }})</strong></strong>
                                        <strong v-if="goal.strength!='ev'" class="special-teams">{{ goal.strength }}</strong>
                                        <strong v-if="goal.goalModifier!='none'" class="special-teams">{{ getGoalModifier(goal.goalModifier) }}</strong>
                                    </div>
                                    <div>
                                        <strong style="font-size:small"> {{ goal.timeInPeriod }}</strong>
                                        <strong v-if="goal.assists.length>0 || goal.goalModifier!='penalty-shot'" class="assist-text"> - </strong>
                                        <strong v-if="goal.assists[0]" @click="goToPlayer(goal.assists[0].playerId)" class="assist-text" style="cursor:pointer">{{ goal.assists[0].name.default }} ({{ goal.assists[0].assistsToDate }})</strong>
                                        <strong v-if="goal.assists[1]" @click="goToPlayer(goal.assists[1].playerId)" class="assist-text" style="cursor:pointer">, {{ goal.assists[1].name.default }} ({{ goal.assists[1].assistsToDate }})</strong>
                                        <strong v-if="goal.assists.length==0 && goal.goalModifier!='penalty-shot'" class="assist-text">Unassisted</strong>
                                    </div>
                                </div>
                                <button @click="fetchHighlight(goal.highlightClip)" class="highlight-button">&#9205;</button>
                            </div>
                            <div v-else v-for="attempt in game.summary.shootout.events" class="goal-box-shootout">
                                <img :src="attempt.headshot" alt="Player Logo" class="player-logo">
                                <img :src="getPlayerTeamLogo(attempt.teamAbbrev.default)" alt="Player Team Logo" class="player-team-logo">
                                <div class="summary-players" style="width:100%">
                                    <div style="display:inline-flex;align-items:center">
                                        <strong class="goal-text-shootout">{{ getAbbrevName(attempt.firstName.default, attempt.lastName.default) }}<strong v-if="attempt.gameWinner" class="goal-text-amount"> (GW)</strong></strong>
                                        <img v-if="attempt.result=='goal'" src="@/assets/puck.svg" alt="Puck" class="penalty-shot-logo"/>
                                        <img v-else src="@/assets/mask.svg" alt="Mask" class="penalty-shot-logo"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- GOALIE COMPARISON STATS -->
                    <div v-if="game.gameState=='PRE' || game.gameState=='FUT'" class="goalie-stats" style="margin-top:1rem">
                        <div class="team-leaders-header">
                            <strong class="team-leaders-header-text">Goalie Comparison</strong>
                            <!-- <strong style="font-size:small">Goalie Comparison</strong> -->
                            <div class="team-leaders-header-bar"></div>
                            <div class="team-leaders-logos">
                                <img :src="game.awayTeam.logo" alt="Team Stats Logo" @click="goToTeam(game.awayTeam.abbrev)" class="team-leaders-logo-size">
                                <img :src="game.homeTeam.logo" alt="Team Stats Logo" @click="goToTeam(game.homeTeam.abbrev)" class="team-leaders-logo-size">
                            </div>
                        </div>
                        <div v-if="gameStory.preGameMatchup" class="goalie-stats-content">
                            <!-- goalies away side -->
                            <div class="goalie-stats-content-away">
                                <div v-for="goalie in gameStory.preGameMatchup.goalieComparison.awayTeam" class="goalie-stats-content-away-section">
                                    <div v-if="goalie.record" class="goalie-stat-values away">
                                        <div class="goalie-record-section away"><strong class="goalie-compare record">{{ goalie.record }}</strong><strong class="goalie-compare record-text">Record</strong></div>
                                        <div style="display:flex;flex-direction:column;align-items:center"><strong class="goalie-compare svg">{{ getSavePctg(goalie.savePctg) }}</strong><strong class="goalie-compare svg-text">SV%</strong></div>
                                        <div style="display:flex;flex-direction:column;align-items:center"><strong class="goalie-compare gaa">{{ goalie.gaa }}</strong><strong class="goalie-compare gaa-text">GAA</strong></div>
                                    </div>
                                    <div v-if="goalie.playerId" @click="goToPlayer(goalie.playerId)" class="goalie-stat-info away">
                                        <strong class="player-compare first-name">{{ goalie.firstName.default }}</strong>
                                        <strong class="player-compare last-name">{{ goalie.lastName.default }}</strong>
                                        <strong class="player-compare position-num">#{{ goalie.sweaterNumber }} - {{ goalie.positionCode }}</strong>
                                    </div>
                                    <img :src="goalie.headshot" @click="goToPlayer(goalie.playerId)" alt="Goalie Category Headshot" class="category-headshot">
                                </div>
                            </div>
                            <div class="stat-leader-column">
                                <div class="vertical-line-container"><div class="vertical-line"></div></div>
                            </div>
                            <!-- goalies home side -->
                            <div class="goalie-stats-content-home">
                                <div v-for="goalie in gameStory.preGameMatchup.goalieComparison.homeTeam" class="goalie-stats-content-away-section">
                                    <img :src="goalie.headshot" @click="goToPlayer(goalie.playerId)" alt="Goalie Category Headshot" class="category-headshot">
                                    <div v-if="goalie.playerId" @click="goToPlayer(goalie.playerId)" class="goalie-stat-info home">
                                        <strong class="player-compare first-name">{{ goalie.firstName.default }}</strong>
                                        <strong class="player-compare last-name">{{ goalie.lastName.default }}</strong>
                                        <strong class="player-compare position-num">#{{ goalie.sweaterNumber }} - {{ goalie.positionCode }}</strong>
                                    </div>
                                    <div v-if="goalie.record" class="goalie-stat-values home">
                                        <div class="goalie-record-section home"><strong class="goalie-compare record">{{ goalie.record }}</strong><strong class="goalie-compare record-text">Record</strong></div>
                                        <div style="display:flex;flex-direction:column;align-items:center"><strong class="goalie-compare svg">{{ getSavePctg(goalie.savePctg) }}</strong><strong class="goalie-compare svg-text">SV%</strong></div>
                                        <div style="display:flex;flex-direction:column;align-items:center"><strong class="goalie-compare gaa">{{ goalie.gaa }}</strong><strong class="goalie-compare gaa-text">GAA</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" style="margin-top:1rem">
                        <h3 style="color:white">Goaltending</h3>
                        <div class="goalie-stats">
                            <div style="display:flex"> <!-- awayGoalie -->
                                <div class="goalies-column" style="width:10%">
                                    <img :src="game.awayTeam.logo" @click="goToTeam(game.awayTeam.abbrev)" alt="Away Team Logo" style="width:50px;cursor:pointer">
                                    <strong>#{{ getGoalieInfo(game.awayTeam.abbrev, 'jerseyNumber') }}</strong>
                                </div>
                                <!-- Goalie Headshot Image -->
                                <div style="width:90%">
                                    <div style="color:white;cursor:pointer">
                                        <strong @click="goToPlayer(getGoalieInfo(game.awayTeam.abbrev, 'id'))" class="goalie-info-name">{{ getGoalieInfo(game.awayTeam.abbrev, 'name') }}</strong>
                                        <!-- <span>{{ getGoalieInfo(game.awayTeam.abbrev, 'record') }}</span> -->
                                    </div>
                                    <div style="display:flex;justify-content:space-around">
                                        <div class="goalies-column">
                                            <strong style="color:white">{{ getGoalieInfo(game.awayTeam.abbrev, 'SA') }}</strong>
                                            <strong style="font-size:x-small">SA</strong>
                                        </div>
                                        <div class="goalies-column">
                                            <strong style="color:white">{{ getGoalieInfo(game.awayTeam.abbrev, 'GA') }}</strong>
                                            <strong style="font-size:x-small">GA</strong>
                                        </div>
                                        <div class="goalies-column">
                                            <strong style="color:white">{{ getGoalieInfo(game.awayTeam.abbrev, 'SV') }}</strong>
                                            <strong style="font-size:x-small">SV</strong>
                                        </div>
                                        <div class="goalies-column">
                                            <strong style="color:white">{{ getGoalieInfo(game.awayTeam.abbrev, 'SV%') }}</strong>
                                            <strong style="font-size:x-small">SV%</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex"> <!-- homeGoalie -->
                                <div class="goalies-column" style="width:10%">
                                    <img :src="game.homeTeam.logo" @click="goToTeam(game.homeTeam.abbrev)" alt="Away Team Logo" style="width:50px;cursor:pointer">
                                    <strong>#{{ getGoalieInfo(game.homeTeam.abbrev, 'jerseyNumber') }}</strong>
                                </div>
                                <!-- goalie player image -->
                                <div style="width:90%">
                                    <div style="color:white;cursor:pointer">
                                        <strong @click="goToPlayer(getGoalieInfo(game.homeTeam.abbrev, 'id'))" class="goalie-info-name">{{ getGoalieInfo(game.homeTeam.abbrev, 'name') }}</strong>
                                        <!-- <span>{{ getGoalieInfo(game.homeTeam.abbrev, 'record') }}</span> -->
                                    </div>
                                    <div style="display:flex;justify-content:space-around">
                                        <div class="goalies-column">
                                            <strong style="color:white">{{ getGoalieInfo(game.homeTeam.abbrev, 'SA') }}</strong>
                                            <strong style="font-size:x-small">SA</strong>
                                        </div>
                                        <div class="goalies-column">
                                            <strong style="color:white">{{ getGoalieInfo(game.homeTeam.abbrev, 'GA') }}</strong>
                                            <strong style="font-size:x-small">GA</strong>
                                        </div>
                                        <div class="goalies-column">
                                            <strong style="color:white">{{ getGoalieInfo(game.homeTeam.abbrev, 'SV') }}</strong>
                                            <strong style="font-size:x-small">SV</strong>
                                        </div>
                                        <div class="goalies-column">
                                            <strong style="color:white">{{ getGoalieInfo(game.homeTeam.abbrev, 'SV%') }}</strong>
                                            <strong style="font-size:x-small">SV%</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- PENALTY SUMMARY -->
                    <div v-if="(game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL') && penaltySummary.length>0" style="margin-top:1rem">
                        <h3 style="color:white">Penalties</h3>
                        <Accordion class="penalties-box">
                                <AccordionTab v-for="(penalties, index) in penaltySummary" :key="index" :header="getPenaltyPeriod(index, game.gameType)+' Period'">
                                    <DataTable :value="penalties" tableStyle="width: 100%">
                                        <Column style="width: 1%">
                                            <template #body="slotProps">
                                                <img v-if="slotProps.data.team === game.awayTeam.abbrev" :src="game.awayTeam.logo" :alt="game.awayTeam.abbrev" class="penalties-team-logo"/>
                                                <img v-else-if="slotProps.data.team === game.homeTeam.abbrev" :src="game.homeTeam.logo" :alt="game.homeTeam.abbrev" class="penalties-team-logo"/>
                                            </template>
                                        </Column>
                                        <Column field="team" header="Team" style="width: 5%"></Column>
                                        <Column field="player" header="Player" style="width: 10%"></Column>
                                        <Column field="penalty" header="Penalty" style="width: 20%"></Column>
                                        <Column field="time" header="Time" style="width: 5%"></Column>
                                    </DataTable>
                                </AccordionTab>
                        </Accordion>
                    </div>

                    <!-- TEAM LEADERS -->
                    <div v-if="(game.gameState=='PRE' || game.gameState=='FUT') && game.preGameMatchup" class="team-leaders">
                        <div class="team-leaders-header">
                            <strong class="team-leaders-header-text">Players to Watch</strong>
                            <strong class="team-leaders-last-five">Last 5 Games</strong>
                            <div class="team-leaders-header-bar"></div>
                            <div class="team-leaders-logos">
                                <img :src="game.awayTeam.logo" alt="Team Stats Logo" @click="goToTeam(game.awayTeam.abbrev)" class="team-leaders-logo-size">
                                <img :src="game.homeTeam.logo" alt="Team Stats Logo" @click="goToTeam(game.homeTeam.abbrev)" class="team-leaders-logo-size">
                            </div>
                        </div>
                        <div v-for="category in gameStory.preGameMatchup.skatingLeaders.leaders" class="stat-leader">
                            <div class="stat-leader-column away">
                                <strong style="font-size:xxx-large;color:white">{{ category.awayLeader.value }}</strong>
                                <strong style="font-size:small;margin-top:-10px;">{{ getValueLetter(category.category, false) }}</strong>
                            </div>
                            <div class="stat-leader-middle">
                                <div @click="goToPlayer(category.awayLeader.playerId)" class="stat-leader-player-info away">
                                    <strong class="player-compare first-name">{{ category.awayLeader.firstName.default }}</strong>
                                    <strong class="player-compare last-name">{{ category.awayLeader.lastName.default }}</strong>
                                    <strong class="player-compare position-num">#{{ category.awayLeader.sweaterNumber }} - {{ category.awayLeader.positionCode }}</strong>
                                </div>
                                <div class="stat-leader-column headshot">
                                    <img :src="category.awayLeader.headshot" @click="goToPlayer(category.awayLeader.playerId)" alt="Player Category Headshot" class="category-headshot">
                                </div>
                                <div class="stat-leader-column">
                                    <strong class="vertical-line-category">{{ category.category }}</strong>
                                    <div class="vertical-line-container"><div class="vertical-line"></div></div>
                                </div>
                                <div class="stat-leader-column headshot">
                                    <img :src="category.homeLeader.headshot" @click="goToPlayer(category.homeLeader.playerId)" alt="Player Category Headshot" class="category-headshot">
                                </div>
                                <div @click="goToPlayer(category.homeLeader.playerId)" class="stat-leader-player-info home">
                                    <strong class="player-compare first-name">{{ category.homeLeader.firstName.default }}</strong>
                                    <strong class="player-compare last-name">{{ category.homeLeader.lastName.default }}</strong>
                                    <strong class="player-compare position-num">#{{ category.homeLeader.sweaterNumber }} - {{ category.homeLeader.positionCode }}</strong>
                                </div>
                            </div>
                            <div class="stat-leader-column home">
                                <strong style="font-size:xxx-large;color:white">{{ category.homeLeader.value }}</strong>
                                <strong style="font-size:small;margin-top:-10px;">{{ getValueLetter(category.category, false) }}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- PLAYER STATS -->
                    <div v-if="game.gameState=='PRE' || game.gameState=='FUT'" class="players-stats-section">
                        <div class="player-stats-box" style="margin-top:1rem">
                            <h3 style="color:white">Stats</h3>
                            <div class="player-stats-teams">
                                <v-button class="player-stats-button" :class="{ 'player-stats-button-selected': playerStatsTeamSelected === game.awayTeam.id }" @click="switchPlayerStats(game.awayTeam.id)">{{ game.awayTeam.commonName.default }}</v-button>
                                <v-button class="player-stats-button" :class="{ 'player-stats-button-selected': playerStatsTeamSelected === game.homeTeam.id }" @click="switchPlayerStats(game.homeTeam.id)">{{ game.homeTeam.commonName.default }}</v-button>
                            </div>
                        </div>
                        <DataTable :value="playerStats" :sortField="'points'" :sortOrder="-1" @row-click="rowGoToPlayer">
                            <Column field="sweaterNumber" header="#" style="width:3%;color:white;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="name" header="Player" class="stats-name-header" style="width:5%;color:white;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="position" header="POS" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="gamesPlayed" header="GP" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="goals" header="G" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="assists" header="A" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="points" header="P" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="plusMinus" header="+/-" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="pim" header="PIM" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="shots" header="S" style="width:4%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="powerPlayGoals" header="PPG" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="hits" header="H" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="avgTimeOnIce" header="TOI/G" style="width:5%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="faceoffWinningPctg" header="FO%" style="width:5%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                        </DataTable>
                    </div>

                    <!-- THREE STARS -->
                    <div v-if="game.gameState=='OFF' || game.gameState=='FINAL'" style="margin-top:1rem">
                        <h3 style="color:white">Three Stars</h3>
                        <div class="three-stars-box">
                            <div v-for="(player, index) in game.summary.threeStars" :key="index">
                                <div style="display:flex">
                                    <div class="three-stars-column">
                                        <strong>{{ getStarNum(index) }}</strong>
                                        <img src="@/assets/star.svg" alt="Star" style="margin-top:5px"/>
                                        <!-- <strong style="font-size:xx-large;color:var(--main-color)">&#128970;</strong> -->
                                    </div>
                                    <div class="three-stars-formatting">
                                        <img :src="player.headshot" @click="goToPlayer(player.playerId)" alt="Player Category Headshot" class="category-headshot three-stars">
                                        <img :src="getPlayerTeamLogo(player.teamAbbrev)" alt="Player Team Logo" class="player-team-logo three-stars">
                                    </div>
                                    <div class="three-stars-column">
                                        <strong v-if="player.name.default" @click="goToPlayer(player.playerId)" style="cursor:pointer">{{ player.name.default }}</strong>
                                        <strong v-else @click="goToPlayer(player.playerId)" style="cursor:pointer">{{ player.name }}</strong>
                                        <strong>#{{ player.sweaterNo }} - {{ player.position }}</strong>
                                        <strong></strong>
                                    </div>
                                </div>
                                <div>
                                    <div v-if="player.position=='G'" class="three-stars-stats">
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ configureThreeStars(player, 'saveShotsAgainst', 'SA') }}</strong>
                                            <strong style="font-size:x-small">SA</strong>
                                        </div>
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ configureThreeStars(player, 'goalsAgainst') }}</strong>
                                            <strong style="font-size:x-small">GA</strong>
                                        </div>
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ configureThreeStars(player, 'saveShotsAgainst', 'SV') }}</strong>
                                            <strong style="font-size:x-small">SV</strong>
                                        </div>
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ getSavePctg(configureThreeStars(player, 'savePctg')) }}</strong>
                                            <strong style="font-size:x-small">SV%</strong>
                                        </div>
                                    </div>
                                    <div v-else class="three-stars-stats">
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ configureThreeStars(player, 'goals') }}</strong>
                                            <strong style="font-size:x-small">G</strong>
                                        </div>
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ configureThreeStars(player, 'assists') }}</strong>
                                            <strong style="font-size:x-small">A</strong>
                                        </div>
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ configureThreeStars(player, 'pim') }}</strong>
                                            <strong style="font-size:x-small">PIM</strong>
                                        </div>
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ configureThreeStars(player, 'plusMinus') }}</strong>
                                            <strong style="font-size:x-small">+/-</strong>
                                        </div>
                                        <div class="three-stars-column">
                                            <strong style="color:white">{{ configureThreeStars(player, 'toi') }}</strong>
                                            <strong style="font-size:x-small">TOI</strong>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="index==0 || index==1" class="vertical-line-stars"><div class="vertical-line" style="margin-right:-20px"></div></div>
                            </div>
                        </div>
                    </div>

                    <!-- PLAYER GAME STATS -->
                    <div v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" class="players-stats-section">
                        <div class="player-stats-box" style="margin-top:1rem">
                            <h3 style="color:white">Stats</h3>
                            <div class="player-stats-teams">
                                <v-button class="player-stats-button" :class="{ 'player-stats-button-selected': playerGameStatsTeamSelected === game.awayTeam.id }" @click="switchPlayerGameStats('away')">{{ game.awayTeam.commonName.default }}</v-button>
                                <v-button class="player-stats-button" :class="{ 'player-stats-button-selected': playerGameStatsTeamSelected === game.homeTeam.id }" @click="switchPlayerGameStats('home')">{{ game.homeTeam.commonName.default }}</v-button>
                            </div>
                        </div>
                        <DataTable :value="playerGameStats" :sortField="'points'" :sortOrder="-1" @row-click="rowGoToPlayer">
                            <Column field="sweaterNumber" header="#" style="width:3%;color:white;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="name" header="Player" class="stats-name-header" style="width:5%;color:white;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="goals" header="G" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="assists" header="A" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="points" header="P" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="plusMinus" header="+/-" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="pim" header="PIM" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="shots" header="S" style="width:4%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="hits" header="H" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="powerPlayGoals" header="PPG" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="avgTimeOnIce" header="TOI" style="width:5%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                            <Column field="faceoffWinningPctg" header="FO%" style="width:5%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                        </DataTable>
                    </div>
                </div>

                <div class="game-right-side">
                    <!-- LINE SCORE -->
                    <div v-if="(game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL') && (this.game.summary.shotsByPeriod)">
                        <h3 style="color:white">Linescore</h3>
                        <DataTable :value="lineScore">
                            <Column style="width: 3%">
                                <template #body="slotProps">
                                  <img :src="slotProps.data.logo" :alt="slotProps.data.team"/>
                                </template>
                            </Column>
                            <Column field="team" header="" style="width: 5%"></Column>
                            <Column field="first" header="1st" sortable style="width: 5%"></Column>
                            <Column field="second" header="2nd" style="width: 5%"></Column>
                            <Column field="third" header="3rd" sortable style="width: 5%"></Column>
                            <!-- <Column v-if="this.game.summary && this.game.summary.shotsByPeriod.length>3" field="overtime" header="OT" sortable style="width: 5%"></Column> -->
                            <Column field="total" header="T" sortable style="width: 5%"></Column>
                        </DataTable>
                    </div>

                    <!-- PERIOD SHOTS -->
                    <div v-if="(game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL') && (this.game.summary.shotsByPeriod)" style="margin-top:1rem">
                        <h3 style="color:white">Shots On Goal</h3>
                        <DataTable :value="periodShots">
                            <Column style="width: 3%">
                                <template #body="slotProps">
                                  <img :src="slotProps.data.logo" :alt="slotProps.data.team"/>
                                </template>
                            </Column>
                            <Column field="team" header="" style="width: 5%"></Column>
                            <Column field="first" header="1st" sortable style="width: 5%"></Column>
                            <Column field="second" header="2nd" style="width: 5%"></Column>
                            <Column field="third" header="3rd" sortable style="width: 5%"></Column>
                            <!-- <Column v-if="this.game.summary && this.game.summary.shotsByPeriod.length>3" field="overtime" header="OT" sortable style="width: 5%"></Column> -->
                            <Column field="total" header="T" sortable style="width: 5%"></Column>
                        </DataTable>
                    </div>

                    <!-- SEASON SERIES -->
                    <div v-if="(game.gameState=='PRE' || game.gameState=='FUT') && (game.matchup.gameType==2) && (game.matchup.seasonSeries)" style="margin-top:1rem">
                        <div class="season-series">
                            <h3 style="margin-top:0rem;padding:5px;color:white">Season Series</h3>
                            <div class="season-series-games">
                                <div v-for="(seriesGame, index) in game.matchup.seasonSeries" :key="index" @click="openGame(seriesGame)" class="season-series-game">
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
                    </div>

                    <!-- TEAM STATS -->
                    <div class="team-stats">
                        <!-- PRE GAME -->
                        <div v-if="(game.gameState=='PRE' || game.gameState=='FUT') && (gameStory.preGameMatchup)">
                            <div class="game-stat" style="margin-bottom:20px">
                                <div class="away-game-stat"><img :src="game.awayTeam.logo" alt="Team Stats Logo" style="width: 30px"><strong style="color:white">{{ game.awayTeam.abbrev }}</strong></div>
                                <strong style="color:white">Team Stats</strong>
                                <div class="home-game-stat"><strong style="color:white">{{ game.homeTeam.abbrev }}</strong><img :src="game.homeTeam.logo" alt="Team Stats Logo" style="width: 30px"></div>
                            </div>
                            <!-- pp% category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ calculatePercentage(gameStory.preGameMatchup.teamSeasonStats.awayTeam.ppPctg, 1) }}%</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.awayTeam.ppPctgRank) }})</strong></div>
                                <strong>Power Play %</strong>
                                <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.homeTeam.ppPctgRank) }})</strong><strong>{{ calculatePercentage(gameStory.preGameMatchup.teamSeasonStats.homeTeam.ppPctg, 1) }}%</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory.preGameMatchup.teamSeasonStats.awayTeam.ppPctg, gameStory.preGameMatchup.teamSeasonStats.homeTeam.ppPctg) + '%' }"></div>
                            </div>
                            <!-- pk% category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ calculatePercentage(gameStory.preGameMatchup.teamSeasonStats.awayTeam.pkPctg, 1) }}%</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.awayTeam.pkPctgRank) }})</strong></div>
                                <strong>Penalty Kill %</strong>
                                <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.homeTeam.pkPctgRank) }})</strong><strong>{{ calculatePercentage(gameStory.preGameMatchup.teamSeasonStats.homeTeam.pkPctg, 1) }}%</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory.preGameMatchup.teamSeasonStats.awayTeam.pkPctg, gameStory.preGameMatchup.teamSeasonStats.homeTeam.pkPctg) + '%' }"></div>
                            </div>
                            <!-- fo% category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ calculatePercentage(gameStory.preGameMatchup.teamSeasonStats.awayTeam.faceoffWinningPctg, 1) }}%</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.awayTeam.faceoffWinningPctgRank) }})</strong></div>
                                <strong>Faceoff %</strong>
                                <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.homeTeam.faceoffWinningPctgRank) }})</strong><strong>{{ calculatePercentage(gameStory.preGameMatchup.teamSeasonStats.homeTeam.faceoffWinningPctg, 1) }}%</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory.preGameMatchup.teamSeasonStats.awayTeam.faceoffWinningPctg, gameStory.preGameMatchup.teamSeasonStats.homeTeam.faceoffWinningPctg) + '%' }"></div>
                            </div>
                            <!-- gf/g% category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ gameStory.preGameMatchup.teamSeasonStats.awayTeam.goalsForPerGamePlayed }}</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.awayTeam.goalsForPerGamePlayedRank) }})</strong></div>
                                <strong>GF/GP</strong>
                                <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.homeTeam.goalsForPerGamePlayedRank) }})</strong><strong>{{ gameStory.preGameMatchup.teamSeasonStats.homeTeam.goalsForPerGamePlayed }}</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory.preGameMatchup.teamSeasonStats.awayTeam.goalsForPerGamePlayed, gameStory.preGameMatchup.teamSeasonStats.homeTeam.goalsForPerGamePlayed) + '%' }"></div>
                            </div>
                            <!-- ga/g% category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ gameStory.preGameMatchup.teamSeasonStats.awayTeam.goalsAgainstPerGamePlayed }}</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.awayTeam.goalsAgainstPerGamePlayedRank) }})</strong></div>
                                <strong>GA/GP</strong>
                                <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(gameStory.preGameMatchup.teamSeasonStats.homeTeam.goalsAgainstPerGamePlayedRank) }})</strong><strong>{{ gameStory.preGameMatchup.teamSeasonStats.homeTeam.goalsAgainstPerGamePlayed }}</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory.preGameMatchup.teamSeasonStats.awayTeam.goalsAgainstPerGamePlayed, gameStory.preGameMatchup.teamSeasonStats.homeTeam.goalsAgainstPerGamePlayed) + '%' }"></div>
                            </div>
                        </div>

                        <!-- DURING/POST GAME -->
                        <div v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'">
                            <div class="game-stat" style="margin-bottom:20px">
                                <div class="away-game-stat"><img :src="game.awayTeam.logo" alt="Team Stats Logo" style="width: 30px"><strong style="color:white">{{ game.awayTeam.abbrev }}</strong></div>
                                <strong style="color:white">Game Stats</strong>
                                <div class="home-game-stat"><strong style="color:white">{{ game.homeTeam.abbrev }}</strong><img :src="game.homeTeam.logo" alt="Team Stats Logo" style="width: 30px"></div>
                            </div>
                            <!-- sog category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[0]?.awayValue }}</strong></div>
                                <strong>Shots On Goal</strong>
                                <div class="home-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[0]?.homeValue }}</strong></div>
                            </div>
                            <!-- progress bar below -->
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory?.summary?.teamGameStats[0]?.awayValue, gameStory?.summary?.teamGameStats[0]?.homeValue) + '%' }"></div>
                            </div>
                            <!-- fo% category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ calculatePercentage(gameStory?.summary?.teamGameStats[1]?.awayValue, 1) }}%</strong></div>
                                <strong>Faceoff %</strong>
                                <div class="home-game-stat"><strong>{{ calculatePercentage(gameStory?.summary?.teamGameStats[1]?.homeValue, 1) }}%</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory?.summary?.teamGameStats[1]?.awayValue, gameStory?.summary?.teamGameStats[1]?.homeValue) + '%' }"></div>
                            </div>
                            <!-- pp% category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ fractionToPercentage(gameStory?.summary?.teamGameStats[2]?.awayValue) }}%</strong><strong style="font-size:small;margin-left:4px">({{ gameStory?.summary?.teamGameStats[2]?.awayValue }})</strong></div>
                                <strong>Power Play %</strong>
                                <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ gameStory?.summary?.teamGameStats[2]?.homeValue }})</strong><strong>{{ fractionToPercentage(gameStory?.summary?.teamGameStats[2]?.homeValue) }}%</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory?.summary?.teamGameStats[2]?.awayValue, gameStory?.summary?.teamGameStats[2]?.homeValue, true) + '%' }"></div>
                            </div>
                            <!-- pim category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[4]?.awayValue }}</strong></div>
                                <strong>Penalty Minutes</strong>
                                <div class="home-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[4]?.homeValue }}</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory?.summary?.teamGameStats[4]?.awayValue, gameStory?.summary?.teamGameStats[4]?.homeValue, true) + '%' }"></div>
                            </div>
                            <!-- hits category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[5]?.awayValue }}</strong></div>
                                <strong>Hits</strong>
                                <div class="home-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[5]?.homeValue }}</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory?.summary?.teamGameStats[5]?.awayValue, gameStory?.summary?.teamGameStats[5]?.homeValue, true) + '%' }"></div>
                            </div>
                            <!-- blocked shots category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[6]?.awayValue }}</strong></div>
                                <strong>Blocked Shots</strong>
                                <div class="home-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[6]?.homeValue }}</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory?.summary?.teamGameStats[6]?.awayValue, gameStory?.summary?.teamGameStats[6]?.homeValue, true) + '%' }"></div>
                            </div>
                            <!-- giveaways category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[7]?.awayValue }}</strong></div>
                                <strong>Giveaways</strong>
                                <div class="home-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[7]?.homeValue }}</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory?.summary?.teamGameStats[7]?.awayValue, gameStory?.summary?.teamGameStats[7]?.homeValue, true) + '%' }"></div>
                            </div>
                            <!-- takeaways category -->
                            <div class="game-stat">
                                <div class="away-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[8]?.awayValue }}</strong></div>
                                <strong>Takeaways</strong>
                                <div class="home-game-stat"><strong>{{ gameStory?.summary?.teamGameStats[8]?.homeValue }}</strong></div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: calculateProgressPercentage(gameStory?.summary?.teamGameStats[8]?.awayValue, gameStory?.summary?.teamGameStats[8]?.homeValue, true) + '%' }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- LAST 10 GAMES -->
                    <div v-if="(game.gameState=='PRE' || game.gameState=='FUT') && (game.matchup)" style="margin-top:1rem">
                        <h3 v-if="game.matchup.last10Record" style="margin-top:0rem;padding:5px;color:white">Last 10 Games</h3>
                        <div v-if="game.matchup.last10Record">
                            <div class="last-ten-box"> <!--away team-->
                                <div class="last-ten-team">
                                    <strong>{{ game.awayTeam.name.default }}</strong>
                                    <strong>{{ game.matchup.last10Record.awayTeam.record }}</strong>
                                </div>
                                <div class="last-ten-games">
                                    <div v-for="game in game.matchup.last10Record.awayTeam.pastGameResults" class="last-ten-game">
                                        <strong v-if="game.gameResult=='W' || game.gameResult=='OTW' || game.gameResult=='SOW'" class="last-ten-opp" style="background-color:var(--hover-color)">{{ game.opponentAbbrev }}</strong>
                                        <strong v-else class="last-ten-opp">{{ game.opponentAbbrev }}</strong>
                                        <strong style="font-size:small">{{ game.gameResult }}</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="last-ten-box"> <!--home team-->
                                <div class="last-ten-team">
                                    <strong>{{ game.homeTeam.name.default }}</strong>
                                    <strong>{{ game.matchup.last10Record.homeTeam.record }}</strong>
                                </div>
                                <div class="last-ten-games">
                                    <div v-for="game in game.matchup.last10Record.homeTeam.pastGameResults" class="last-ten-game">
                                        <strong v-if="game.gameResult=='W' || game.gameResult=='OTW' || game.gameResult=='SOW'" class="last-ten-opp" style="background-color:var(--hover-color)">{{ game.opponentAbbrev }}</strong>
                                        <strong v-else class="last-ten-opp">{{ game.opponentAbbrev }}</strong>
                                        <strong style="font-size:small">{{ game.gameResult }}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- GAME INFO -->
                    <div v-if="game" class="overall-game-info">
                        <h3 style="margin-top:0rem;padding:5px;color:white">Game Info</h3>
                        <div class="overall-game-info-section">
                            <strong class="overall-game-info-label">Networks</strong>
                            <strong v-for="(network, index) in game.tvBroadcasts" :key="index"><strong v-if="index!=0">, </strong>{{ network.network }}</strong>
                        </div>
                        <div class="overall-game-info-section">
                            <strong class="overall-game-info-label">Location</strong>
                            <strong>{{ game.venue.default }}, {{ game.venueLocation.default }}</strong>
                        </div>
                        <!-- <div v-if="game.matchup" class="overall-game-info-section">
                            <strong class="overall-game-info-label">{{ game.awayTeam.abbrev }} Coach</strong>
                            <strong v-if="game.matchup.gameInfo">{{ game.matchup.gameInfo.awayTeam.headCoach.default }}</strong>
                            <strong v-if="game.summary">{{ game.summary.gameInfo.awayTeam.headCoach.default }}</strong>
                        </div>
                        <div v-if="game.matchup" class="overall-game-info-section">
                            <strong class="overall-game-info-label">{{ game.homeTeam.abbrev }} Coach</strong>
                            <strong v-if="game.matchup.gameInfo">{{ game.matchup.gameInfo.homeTeam.headCoach.default }}</strong>
                            <strong v-if="game.summary">{{ game.summary.gameInfo.homeTeam.headCoach.default }}</strong>
                        </div> -->
                        <!-- <div v-if="game.summary.referees" class="overall-game-info-section">
                            <strong class="overall-game-info-label">Referees</strong>
                            <strong v-for="(referee, index) in game.summary.gameInfo.referees" :key="index"><strong v-if="index!=0">, </strong>{{ referee.default }}</strong>
                        </div>
                        <div v-if="game.summary.linesmen" class="overall-game-info-section">
                            <strong class="overall-game-info-label">Linesmen</strong>
                            <strong v-for="(linesmen, index) in game.summary.gameInfo.linesmen" :key="index"><strong v-if="index!=0">, </strong>{{ linesmen.default }}</strong>
                        </div> -->
                    </div>
                </div>
            </div>
        </PullToRefresh>
    </div>

    <!-- Display error message -->
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
</template>
  
<script>
import ProgressSpinner from './ProgressSpinner.vue';
import PullToRefresh from '@/components/PullToRefresh.vue';
import Options from '@/components/Options.vue';
import Account from '@/components/Account.vue';
import Settings from '@/components/Settings.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import { fetchApi } from '@/services/fetchApi';
import { usePreferencesStore } from '@/stores/preferences';

export default {
    name: 'Game',
    components: {
        ProgressSpinner,
        PullToRefresh,
        Options,
        Account,
        Settings,
        DataTable,
        Column,
        Accordion,
        AccordionTab,
        'v-button': Button,
    },
    props: {
        pageTitle: String,
        id: String, // Make sure to include id as a prop
    },
    data() {
        return {
            isLoading: true,
            showHighlight: false,
            highlightUrl: null,
            error: null,
            selectedDate: null,
            game: {},
            boxScore: {},
            gameStory: {},
            plays: [],
            lineScore: [],
            periodShots: [],
            penaltySummary: [],
            playerStats: [],
            playerStatsTeamSelected: null,
            playerGameStats: [],
            playerGameStatsTeamSelected: null,
            favoriteTeams: (usePreferencesStore()).favorite_teams
        };
    },
    mounted() {
        this.fetchGame();
        this.fetchGameBox();
        this.fetchPlays();
        this.fetchGameStory();
    },
    created() {
        // Check if there is a date parameter in the query
        const queryDate = this.$route.query.date;
        this.selectedDate = queryDate || new Date().toISOString().split('T')[0];
    },
    computed: {
        playerStatsTeamOptions() {
            return [
                { label: this.game.awayTeam.name.default, value: this.game.awayTeam.id },
                { label: this.game.homeTeam.name.default, value: this.game.homeTeam.id }
            ];
        }
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'scores', params: { date: this.selectedDate } });
        },
        async refreshGame() {
          try {
            this.isLoading = true;

            const [game, box, plays, story] = await Promise.all([
              fetchApi(`/api/v1/gamecenter/${this.id}/landing`).then(r => r.json()),
              fetchApi(`/api/v1/gamecenter/${this.id}/boxscore`).then(r => r.json()),
              fetchApi(`/api/v1/gamecenter/${this.id}/play-by-play`).then(r => r.json()),
              fetchApi(`/api/v1/wsc/game-story/${this.id}`).then(r => r.json())
            ]);

            // assign AFTER all are ready
            this.game = game;
            this.boxScore = box;
            this.configurePlays(plays);
            this.gameStory = story;

            } catch (e) {
              console.error(e);
            } finally {
              this.isLoading = false;
            }
        },
        //fetchGame method
            //use one of two API calls: 
                //https://api-web.nhle.com/v1/gamecenter/2023020778/boxscore
                    // - more in depth data and box score info on whole game
                    // - use this for advanced data such as all stats and plays for the game  (implement later on)
                //https://api-web.nhle.com/v1/gamecenter/2023020778/landing 
                    // - brief overview of game including goals scorers by period
                    // - use this for the (matchup) screen to display main data from game
        async fetchGame() {
            try {
                this.isLoading = true;
                const response = await fetchApi(`/api/v1/gamecenter/${this.id}/landing`);
                const data = await response.json();
                this.game = data;
                this.configureLineScore();
                this.configurePeriodShots();
                this.configurePenaltySummary();
                this.switchPlayerStats(data.awayTeam.id);
                this.isLoading = false;
            } catch (error) {
              console.error('Error fetching gamecenter:', error);
              //alert('Error fetching gamecenter. See console for details.');
            }
        },
        async fetchGameBox() {
            try {
                this.isLoading = true;
                const response = await fetchApi(`/api/v1/gamecenter/${this.id}/boxscore`);
                const data = await response.json();
                this.boxScore = data;
                this.switchPlayerGameStats('away');
                this.isLoading = false;
            } catch (error) {
              console.error('Error fetching boxscore:', error);
              alert('Error fetching boxscore. See console for details.');
            }
        },
        async fetchGameStory() {
            try {
                this.isLoading = true;
                const response = await fetchApi(`/api/v1/wsc/game-story/${this.id}`);
                const data = await response.json();
                this.gameStory = data;
            } catch (error) {
              console.error('Error fetching game-story:', error);
              alert('Error fetching game-story. See console for details.');
            }
        },
        async fetchPlays() {
            try {
                this.isLoading = true;
                const response = await fetchApi(`/api/v1/gamecenter/${this.id}/play-by-play`);
                const data = await response.json();
                this.configurePlays(data);
                this.isLoading = false;
            } catch (error) {
              console.error('Error fetching play-by-play:', error);
              //alert('Error fetching play-by-play. See console for details.');
            }
        },
        async fetchHighlight(highlightClip) {
            const response = await fetch(
              `https://edge.api.brightcove.com/playback/v1/accounts/6415718365001/videos/${highlightClip}`,
              {
                headers: {
                  Accept: 'application/json;pk=BCpkADawqM3l37Vq8trLJ95vVwxubXYZXYglAopEZXQTHTWX3YdalyF9xmkuknxjBgiMYwt8VZ_OZ1jAjYxz_yzuNh_cjC3uOaMspVTD-hZfNUHtNnBnhVD0Gmsih8TBF8QlQFXiCQM3W_u4ydJ1qK2Rx8ZutCUg3PHb7Q'
                }
              }
            );
          
            const data = await response.json();
            const mp4Source = data.sources.find(
              source => source.container === 'MP4'
            );

            this.highlightUrl = mp4Source.src;
            this.showHighlight = true;
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
        dateDesc() {
            const startTime = new Date(this.game.startTimeUTC);
            const formattedDate = startTime.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            return formattedDate.toUpperCase();
        },
        seriesGameDateDesc(dateString) {
            const date = new Date(dateString);
            const month = date.toLocaleString('en-US', { month: 'short' });
            const day = date.getDate();
            const formattedDate = `${month.toUpperCase()} ${day}`;
            return formattedDate;
        },
        configurePlays(data) {
            //for(let i = data.plays.length-1; i>=0; i--) { //do this if you want all plays in game configured
            if(data.plays.length>0) { //do this if you want only most recent play configured
                let i = data.plays.length-1;
                let team = '';
                let event = '';
                switch(data.plays[i].typeDescKey) {
                    case 'stoppage':
                        event = data.plays[i].details.secondaryReason ? `Stoppage - ${(data.plays[i].details.secondaryReason).replace(/-/g, ' ')}` : `Stoppage - ${(data.plays[i].details.reason).replace(/-/g, ' ')}`;
                        break;
                    case 'period-start':
                        event = `Start of period ${data.plays[i].periodDescriptor.number}`
                        break;
                    case 'period-end':
                        event = `End of period ${data.plays[i].periodDescriptor.number}`
                        break;
                    case 'faceoff':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `${this.getPlayPlayer(data.plays[i].details.winningPlayerId, data.rosterSpots)} won faceoff against ${this.getPlayPlayer(data.plays[i].details.losingPlayerId, data.rosterSpots)} in the ${this.getZone(data.plays[i].details.zoneCode)}`;
                        break;
                    case 'shot-on-goal':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `Shot on goal by ${this.getPlayPlayer(data.plays[i].details.shootingPlayerId, data.rosterSpots)} saved by ${this.getPlayPlayer(data.plays[i].details.goalieInNetId, data.rosterSpots)}`;
                        break;
                    case 'missed-shot':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `Shot missed by ${this.getPlayPlayer(data.plays[i].details.shootingPlayerId, data.rosterSpots)}`;
                        break;
                    case 'blocked-shot':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `${this.getPlayPlayer(data.plays[i].details.blockingPlayerId, data.rosterSpots)} blocked a shot by ${this.getPlayPlayer(data.plays[i].details.shootingPlayerId, data.rosterSpots)}`;
                        break;
                    case 'hit':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `${this.getPlayPlayer(data.plays[i].details.hittingPlayerId, data.rosterSpots)} credited with a hit on ${this.getPlayPlayer(data.plays[i].details.hitteePlayerId, data.rosterSpots)} in the ${this.getZone(data.plays[i].details.zoneCode)}`;
                        break;
                    case 'giveaway':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `Giveaway by ${this.getPlayPlayer(data.plays[i].details.playerId, data.rosterSpots)} in the ${this.getZone(data.plays[i].details.zoneCode)}`;
                        break;
                    case 'takeaway':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `Takeaway by ${this.getPlayPlayer(data.plays[i].details.playerId, data.rosterSpots)} in the ${this.getZone(data.plays[i].details.zoneCode)}`;
                        break;
                    case 'goal':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        if(data.plays[i].details.assist2PlayerId)
                            event = `Goal scored by ${this.getPlayPlayer(data.plays[i].details.scoringPlayerId, data.rosterSpots)} assisted by ${this.getPlayPlayer(data.plays[i].details.assist1PlayerId, data.rosterSpots)} and ${this.getPlayPlayer(data.plays[i].details.assist2PlayerId, data.rosterSpots)}`;
                        else if(data.plays[i].details.assist1PlayerId)
                            event = `Goal scored by ${this.getPlayPlayer(data.plays[i].details.scoringPlayerId, data.rosterSpots)} assisted by ${this.getPlayPlayer(data.plays[i].details.assist1PlayerId, data.rosterSpots)}`;
                        else
                            event = `Goal scored by ${this.getPlayPlayer(data.plays[i].details.scoringPlayerId, data.rosterSpots)}`;
                        break;
                    case 'penalty':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `Penalty to ${this.getPlayPlayer(data.plays[i].details.committedByPlayerId, data.rosterSpots)} - ${data.plays[i].details.duration} minutes for ${(data.plays[i].details.descKey).replace(/-/g, ' ')} (drawn by ${this.getPlayPlayer(data.plays[i].details.drawnByPlayerId, data.rosterSpots)})`;
                        break;
                    case 'delayed-penalty':
                        team = this.getPlayTeam(data.plays[i].details.eventOwnerTeamId, data);
                        event = `Delayed penalty`;
                        break;
                    case 'game-end':
                        event = `End of game`
                        break;
                    default:
                        break;
                }
                this.plays.push({
                    'team': team,
                    'time': data.plays[i].timeRemaining,
                    'event': event,
                });
            }
        },
        getPlayTeam(teamId, data) {
            if(teamId == data.awayTeam.id)
                return data.awayTeam.logo;
            else
                return data.homeTeam.logo;
        },
        getPlayPlayer(playerId, roster) {
            for (const player of roster) {
                if(player.playerId == playerId)
                    return `${player.firstName.default} ${player.lastName.default}`;
            }
            return 'Player';
        },
        getZone(zoneCode) {
            switch(zoneCode) {
                case 'N':
                    return 'neutral zone';
                case 'O':
                    return 'offensive zone';
                case 'D':
                    return 'defensive zone';
                default:
                    return 'zone';
            }
        },
        configureLineScore() {
            if((this.game.gameState == "LIVE" || this.game.gameState == 'CRIT' || this.game.gameState == "OFF" || this.game.gameState == "FINAL") && (this.game.summary.linescore)) {
                let tempScoreAway = {"logo": this.game.awayTeam.logo, "team": this.game.awayTeam.abbrev, "first": "", "second": "", "third": "", "overtime": "", "total": this.game.awayTeam.score};
                let tempScoreHome = {"logo": this.game.homeTeam.logo, "team": this.game.homeTeam.abbrev, "first": "", "second": "", "third": "", "overtime": "", "total": this.game.homeTeam.score};
                for(let i = 0; i < this.game.summary.linescore.byPeriod.length; i++) {
                    switch(i) {
                        case 0:
                            tempScoreAway.first = this.game.summary.linescore.byPeriod[i].away;
                            tempScoreHome.first = this.game.summary.linescore.byPeriod[i].home;
                            break;
                        case 1:
                            tempScoreAway.second = this.game.summary.linescore.byPeriod[i].away;
                            tempScoreHome.second = this.game.summary.linescore.byPeriod[i].home;
                            break;
                        case 2:
                            tempScoreAway.third = this.game.summary.linescore.byPeriod[i].away;
                            tempScoreHome.third = this.game.summary.linescore.byPeriod[i].home;
                            break;
                        case 3:
                            tempScoreAway.overtime = this.game.summary.linescore.byPeriod[i].away;
                            tempScoreHome.overtime = this.game.summary.linescore.byPeriod[i].home;
                            break;
                    }
                }
                this.lineScore.push(tempScoreAway);
                this.lineScore.push(tempScoreHome);
            }
        },
        configurePeriodShots() {
            if((this.game.gameState == "LIVE" || this.game.gameState == 'CRIT' || this.game.gameState == "OFF" || this.game.gameState == "FINAL") && (this.game.summary.shotsByPeriod)) {
                let tempShotsAway = {"logo": this.game.awayTeam.logo, "team": this.game.awayTeam.abbrev, "first": "", "second": "", "third": "", "overtime": "", "total": this.game.awayTeam.sog};
                let tempShotsHome = {"logo": this.game.homeTeam.logo, "team": this.game.homeTeam.abbrev, "first": "", "second": "", "third": "", "overtime": "", "total": this.game.homeTeam.sog};
                for(let i = 0; i < this.game.summary.shotsByPeriod.length; i++) {
                    switch(i) {
                        case 0:
                            tempShotsAway.first = this.game.summary.shotsByPeriod[i].away;
                            tempShotsHome.first = this.game.summary.shotsByPeriod[i].home;
                            break;
                        case 1:
                            tempShotsAway.second = this.game.summary.shotsByPeriod[i].away;
                            tempShotsHome.second = this.game.summary.shotsByPeriod[i].home;
                            break;
                        case 2:
                            tempShotsAway.third = this.game.summary.shotsByPeriod[i].away;
                            tempShotsHome.third = this.game.summary.shotsByPeriod[i].home;
                            break;
                        case 3:
                            tempShotsAway.overtime = this.game.summary.shotsByPeriod[i].away;
                            tempShotsHome.overtime = this.game.summary.shotsByPeriod[i].home;
                            break;
                    }
                }
                this.periodShots.push(tempShotsAway);
                this.periodShots.push(tempShotsHome);
            }
        },
        switchPlayerStats(teamId) {
            if(this.game.matchup) {
                this.playerStatsTeamSelected = teamId;
                this.playerStats = [];
                this.game.matchup.skaterSeasonStats.skaters.forEach((player) => {
                    if(player.teamId == teamId) {
                        this.playerStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'position': player.position,
                            'gamesPlayed': player.gamesPlayed,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.shots,
                            'powerPlayGoals': player.powerPlayGoals,
                            'hits': player.hits,
                            'avgTimeOnIce': player.avgTimeOnIce,
                            'faceoffWinningPctg': isNaN(player.faceoffWinningPctg) ? '' : (player.faceoffWinningPctg*100).toFixed(1),
                        });
                    }
                });
            }
        },
        switchPlayerGameStats(teamId) {
            //this if/else statement checks the api call and uses the proper json
            let boxScore = {};
            if(this.boxScore.boxscore)
                boxScore = this.boxScore.boxscore
            else if(this.boxScore.playerByGameStats)
                boxScore = this.boxScore
            //
            if(boxScore && boxScore.playerByGameStats) {
                this.playerGameStats = [];
                if(teamId=='away') {
                    this.playerGameStatsTeamSelected = this.boxScore.awayTeam.id;
                    boxScore.playerByGameStats.awayTeam.forwards.forEach((player) => {
                        this.playerGameStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.sog,
                            'hits': player.hits,
                            'powerPlayGoals': player.powerPlayGoals,
                            'avgTimeOnIce': player.toi,
                            'faceoffWinningPctg': isNaN(player.faceoffWinningPctg) ? '' : (player.faceoffWinningPctg*100).toFixed(1),
                        });
                    });
                    boxScore.playerByGameStats.awayTeam.defense.forEach((player) => {
                        this.playerGameStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.sog,
                            'hits': player.hits,
                            'powerPlayGoals': player.powerPlayGoals,
                            'avgTimeOnIce': player.toi,
                            'faceoffWinningPctg': isNaN(player.faceoffWinningPctg) ? '' : (player.faceoffWinningPctg*100).toFixed(1),
                        });
                    });
                } else {
                    this.playerGameStatsTeamSelected = this.boxScore.homeTeam.id;
                    boxScore.playerByGameStats.homeTeam.forwards.forEach((player) => {
                        this.playerGameStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.sog,
                            'hits': player.hits,
                            'powerPlayGoals': player.powerPlayGoals,
                            'avgTimeOnIce': player.toi,
                            'faceoffWinningPctg': isNaN(player.faceoffWinningPctg) ? '' : (player.faceoffWinningPctg*100).toFixed(1),
                        });
                    });
                    boxScore.playerByGameStats.homeTeam.defense.forEach((player) => {
                        this.playerGameStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.sog,
                            'hits': player.hits,
                            'powerPlayGoals': player.powerPlayGoals,
                            'avgTimeOnIce': player.toi,
                            'faceoffWinningPctg': isNaN(player.faceoffWinningPctg) ? '' : (player.faceoffWinningPctg*100).toFixed(1),
                        });
                    });
                }
            }
        },
        getGoalieInfo(teamAbbrev, statType) {
            if(this.boxScore.id) {
                //this if/else statement checks the api call and uses the proper json
                let boxScore = {};
                if(this.boxScore.boxscore)
                    boxScore = this.boxScore.boxscore
                else if(this.boxScore.playerByGameStats)
                    boxScore = this.boxScore
                //
                const teamStats = teamAbbrev === this.boxScore.awayTeam.abbrev ? 
                        boxScore.playerByGameStats.awayTeam :
                        boxScore.playerByGameStats.homeTeam;

                const goalies = teamStats.goalies;
                if (goalies.length === 0) return '';
                const goalie = goalies.reduce((a, b) => (a.toi > b.toi) ? a : b);
                switch (statType) {
                    case 'jerseyNumber':
                        return goalie.sweaterNumber;
                    case 'name':
                        return goalie.name.default;
                    case 'record':
                        return `${goalie.record}-${goalie.goalsAgainst}`;
                    case 'SA':
                        return goalie.saveShotsAgainst.split('/')[1];
                    case 'GA':
                        return goalie.goalsAgainst;
                    case 'SV':
                        return goalie.saveShotsAgainst.split('/')[0];
                    case 'SV%':
                        return Number(goalie.savePctg).toFixed(3);
                    case 'id':
                        return goalie.playerId;
                    default:
                        return '';
                }
            }
        },
        configureThreeStars(player, statType, goalieStatType) {
            if(this.boxScore.id) {
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
        configurePenaltySummary() {
            if(this.game.summary) {
                for (const penaltyEntry of this.game.summary.penalties) {
                    // Initialize an array to store penalties for the current period
                    const periodPenalties = [];
                    // Loop through each penalty in the current period
                    for (const penalty of penaltyEntry.penalties) {
                        // Function to convert the penalty type format
                        const formatPenaltyType = (descKey) => {
                            // Split the string by hyphen
                            const words = descKey.split('-');
                            // Capitalize the first letter of the first word and make the rest lowercase
                            const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
                            // Join the words back together with spaces
                            return [firstWord, ...words.slice(1)].join(' ');
                        };
                        // Create a penalty object
                        const penaltyObj = {
                            team: penalty.teamAbbrev.default ? penalty.teamAbbrev.default : penalty.teamAbbrev,
                            player: `${penalty?.committedByPlayer?.firstName.default} ${penalty?.committedByPlayer?.lastName.default}`,
                            penalty: `${formatPenaltyType(penalty.descKey)} - ${penalty.duration} minutes`,
                            time: penalty.timeInPeriod
                        };
                        // Add the penalty object to periodPenalties
                        periodPenalties.push(penaltyObj);
                    }
                    // Add the periodPenalties array to penaltySummary
                    this.penaltySummary.push(periodPenalties);
                }
            }
        },
        getPeriodScoreboard(over, period, gameType, intermission) {
            let periodShow = '';
            if(gameType==3 && period>4) {
                if(over)
                    return `(${period-3}OT)`;
                periodShow = `${period-3}OT`;
            }
            else {
                switch(period) {
                    case 1:
                        periodShow = '1ST';
                        break;
                    case 2:
                        periodShow = '2ND';
                        break
                    case 3:
                        if(over)
                            return '';
                        periodShow = '3RD';
                        break
                    case 4:
                        if(over)
                            return '(OT)';
                        periodShow = 'OT';
                        break
                    case 5:
                        if(over)
                            return '(SO)';
                        periodShow = 'SO';
                        break
                    default:
                        periodShow = '';
                }
            }
            if(intermission)
                periodShow = periodShow + ' INT';
            return periodShow;
        },
        getPeriod(period, gameType) {
            if(gameType==3 && period.periodDescriptor.number>4)
                return `${period.periodDescriptor.number-3}OT`;
            switch(period.periodDescriptor.number) {
                case 1:
                    return '1st Period';
                case 2:
                    return '2nd Period';
                case 3:
                    return '3rd Period';
                case 4:
                    return 'Overtime';
                case 5:
                    return 'Shootout';
                default:
                    return '';
            }
        },
        getPeriodAbbrev(score) {
            switch(score.period) {
                case 1:
                    return '1st';
                case 2:
                    return '2nd';
                case 3:
                    return '3rd';
                case 4:
                    return 'OT';
                case 5:
                    return 'SO';
                default:
                    return '';
            }
        },
        getPlayerTeamLogo(teamAbbrev) {
            if(teamAbbrev == this.game.awayTeam.abbrev)
                return this.game.awayTeam.logo;
            else
                return this.game.homeTeam.logo;
        },
        getGoalsInGame(playerId, goalsToDate) {
            if(this.game.summary) {
                for (const period of this.game.summary.scoring) {
                    for (const goal of period.goals) {
                        if(goal.playerId == playerId) {
                            const gameGoals = goalsToDate - goal.goalsToDate;
                            if(gameGoals==0)
                                return '';
                            else
                                return (' - '+(gameGoals+1));
                        }
                    }
                }
            }
        },
        getGoalModifier(goalModifier) {
            switch(goalModifier) {
                case 'penalty-shot':
                    return 'PS';
                case 'empty-net':
                    return 'EN';
                default:
                    return goalModifier;
            }
        },
        getAbbrevName(firstName, lastName) {
            return (firstName[0]+'. '+lastName);
        },
        getValueLetter(category, isGoalie) {
            if(isGoalie) {
                switch(category) {
                    case 'WINS':
                        return 'W-L-OTL';
                    case 'SAVE PERCENTAGE':
                        return 'SV%';
                    case 'GOALS AGAINST AVERAGE':
                        return 'GAA';
                    default:
                        return category;
                }
            }
            else {
                switch(category) {
                    case 'points':
                        return 'P';
                    case 'goals':
                        return 'G';
                    case 'assists':
                        return 'A';
                    case 'plusMinus':
                        return '+/-';
                    default:
                        return category;
                }
            }
        },
        calculateProgressPercentage(awayValue, homeValue) {
            if(typeof awayValue == "string")
                awayValue = eval(awayValue);
            if(typeof homeValue == "string")
                homeValue = eval(homeValue);
            let totalValue = awayValue + homeValue;
            if(typeof awayValue === 'string')
                totalValue = parseFloat(awayValue) + parseFloat(homeValue);
            const percentage = (parseFloat(awayValue) / totalValue) * 100;
            return isNaN(percentage) ? 0 : percentage;
        },
        calculatePercentage(value, toDecimal) {
            return (value*100).toFixed(toDecimal);
        },
        getSavePctg(savePctg) {
            if(savePctg)
                return String((savePctg).toFixed(3)).slice(1);
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
        fractionToPercentage(fraction) {
            if (typeof fraction !== 'string' || !fraction.includes('/')) {
                return 0;
            }
            const [numeratorStr, denominatorStr] = fraction.split('/');
            const numerator = parseFloat(numeratorStr);
            const denominator = parseFloat(denominatorStr);
            // Check for invalid numbers or division by zero
            if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
                return 0;
            }
            const percentage = (numerator / denominator) * 100;
            // Return as a number rounded to 1 decimal place
            return Math.round(percentage * 10) / 10;
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
        getPenaltyPeriod(index, gameType) {
            if(this.game.summary) {
                const period = this.game.summary.penalties[index].periodDescriptor.number;
                if(gameType==3 && period>4)
                    return `${period-3}OT`;
                else {
                    switch(period) {
                        case 1:
                            return '1ST';
                        case 2:
                            return '2ND';
                        case 3:
                            return '3RD';
                        case 4:
                            return 'OT';
                        default:
                            return period;
                    }
                }
            }
        },
        isFavoriteTeam(team) {
            return this.favoriteTeams.includes(team);
        },
        openGame(game) {
            const url = this.$router.resolve({ name: 'game', params: { id: game.id }, query: { date: this.selectedDate } }).href;
            window.location.href = url;
        },
        goToTeam(abbrev) {
            this.$router.push({ name: 'team.schedule', params: { id: abbrev }});
        },
        goToPlayer(playerId) {
            this.$router.push({ name: 'player.season', params: { id: playerId }});
        },
        rowGoToPlayer(row) {
            if(this.game.gameState=='PRE' || this.game.gameState=='FUT') {
                if(row.data.position!='G') {
                    this.game.matchup.skaterSeasonStats.forEach((player) => {
                        if(row.data.name == player.name.default)
                            this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                    });
                }
            } else {
                //this if/else statement checks the api call and uses the proper json
                let boxScore = {};
                if(this.boxScore.boxscore)
                    boxScore = this.boxScore.boxscore
                else if(this.boxScore.playerByGameStats)
                    boxScore = this.boxScore
                //
                if(this.playerGameStatsTeamSelected == this.game.awayTeam.id) {
                    boxScore.playerByGameStats.awayTeam.forwards.forEach((player) => {
                        if(row.data.name == player.name.default)
                            this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                    });
                    boxScore.playerByGameStats.awayTeam.defense.forEach((player) => {
                        if(row.data.name == player.name.default)
                            this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                    });
                } else {
                    boxScore.playerByGameStats.homeTeam.forwards.forEach((player) => {
                        if(row.data.name == player.name.default)
                            this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                    });
                    boxScore.playerByGameStats.homeTeam.defense.forEach((player) => {
                        if(row.data.name == player.name.default)
                            this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                    });
                }
            }
        },
    },
};
</script>
  
<style>
.highlight-modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: -275px;
  width: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.highlight-modal-content {
  margin: 15% auto;
  padding: 20px;
}

.highlight-close {
    color: white;
    font-size: x-large;
    cursor: pointer;
}

.game-nav-header {
    display: flex;
    align-items: center;
}

.back-button {
    background: none;
    border: none;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    position: absolute;
}

.date-formatting {
    color: white;
    width: 93%;
    margin-left: 4%;
}

.scoreboard {
    /* position: fixed; */
    top: 0;
    width: 100%;
    height: 100px; /* Adjust the height as needed */
    background-color: #333; /* Change the background color as needed */
    border-radius: 5px;
    color: #fff; /* Change the text color as needed */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px; /* Adjust the padding as needed */
    box-sizing: border-box; /* Include padding and border in the total width/height */
}

.game-left-side {
    display: flex;
    flex-direction: column;
    width: 65%;
}

.game-right-side {
    display: flex;
    flex-direction: column;
    width: 32%;
    margin-left: 25px;
}

.game-summary {
  display: flex;
  justify-content: space-between; /* Distribute items horizontally */
}

.last-play-box {
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 5px;
}

.last-play {
    display: flex;
    align-items: center;
}

.plays-section {
    cursor: pointer;
}

.plays-section-dropdown {
    overflow-y: scroll;
    max-height: 200px;
}

.goalie-stats {
    display: flex;
    flex-direction: column;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    padding: 5px;
}

.goalie-stats-content {
    display: flex;
}

.goalie-stats-content-away {
    width: 50%;
    display: flex;
    flex-direction: column;
}

.goalie-stats-content-away-section {
    display: flex;
    padding: 20px;
    margin-right: -15px;
}

.goalie-stats-content-home-section {
    display: flex;
    padding: 20px;
    margin-left: -15px;
}

.goalie-stats-content-home {
    width: 50%;
    display: flex;
    flex-direction: column;
}

.goalie-stat-values {
    width: 75%;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.goalie-stat-values.away {
    margin-right:-25px;
    margin-left: -40px;
}
.goalie-stat-values.home {
    margin-left:-25px;
    margin-right: -30px;
}

.goalie-stat-info.away{
    display: flex;
    flex-direction: column;
    width: 125px;
    align-self: center;
    cursor: pointer;
    align-items: flex-end;
    padding-right: 5px;
}
.goalie-stat-info.home {
    display: flex;
    flex-direction: column;
    width: 125px;
    align-self: center;
    cursor: pointer;
    align-items: flex-start;
    padding-left: 5px;
}

.goalie-record-section {
    display:flex;
    flex-direction:column;
    align-items:center;
}

.goalie-compare.record{color:white}
.goalie-compare.record-text{font-size:x-small}
.goalie-compare.svg{color:white}
.goalie-compare.svg-text{font-size:x-small}
.goalie-compare.gaa{color:white}
.goalie-compare.gaa-text{font-size:x-small}
.player-compare.first-name{font-size:small}
.player-compare.last-name{font-size:larger;color:white}
.player-compare.position-num{font-size:small}

.goalies-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

.team-leaders {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
}

.team-leaders-header {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin: 20px;
}

.team-leaders-header-text {
    font-size: x-large;
    color: white;
}

.team-leaders-last-five {
    font-size: small;
}

.team-leaders-header-bar {
    border: solid;
    border-width: thin;
    border-color: #86868642;
    margin-top: 20px;
    margin-bottom: 20px;
}

.team-leaders-logos {
    display: flex;
    justify-content: space-between;
}

.team-leaders-logo-size {
    width: 80px;
    cursor: pointer;
}

.stat-leader {
    display: flex;
    justify-content: space-between;
    margin-top: 45px;
}

.stat-leader-column {
    display: flex;
    flex-direction: column;
}
.stat-leader-column.away {
    align-items: center;
    width: 50px;
    padding-left: 80px;
}
.stat-leader-column.home {
    align-items: center;
    width: 50px;
    padding-right: 80px;
}

.stat-leader-player-info {
    display: flex;
    flex-direction: column;
    width: 115px;
    align-self: center;
    cursor: pointer;
}
.stat-leader-player-info.away {
    align-items:flex-end;
    padding-right: 25px;
}
.stat-leader-player-info.home {
    align-items:flex-start;
    padding-left: 25px;
}

.stat-leader-middle {
    display: flex;
    flex-direction: row;
}

.players-stats-section .p-datatable-table {
    width: 100%;
}

.players-stats-section tr {
    background-color: #181818;
}

.players-stats-section td {
    padding: 0rem 1rem;
    text-align: center;
    border: none;
    border-bottom: 1px solid #5d5d5d38;
}

.players-stats-section th {
    border: none;
}

.players-stats-section th:nth-child(2) .p-column-header-content {
    justify-content: flex-start;
}

.players-stats-section .p-column-header-content {
    justify-content: center;
}

.player-stats-box {
    display: flex;
    width: 100%;
    margin-top: 1rem;
    justify-content: space-between;
    align-items: flex-end;
}

.player-stats-teams {
    display: flex;
    justify-content: flex-end;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 8px;
    height: 30px;
    width: 50%;
}

.stats-name-header {
    text-align: left !important;
}

.player-stats-button {
    display: flex;
    width: 50%;
    justify-content: center;
    background-color: #ffffff00;
    color: white;
    border: none;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    margin: 2px 2px;
    transition-duration: 0.3s;
    cursor: pointer;
    border-radius: 8px;
}

.player-stats-button:hover {
    background-color: var(--main-color);
    color: black;
}

.player-stats-button-selected {
    background-color: var(--main-color);
    color: black;
}

.penalties-box tr {
    background-color: #181818;
}

.penalties-box td {
    padding: 0rem 1rem;
    text-align: center;
    border: none;
}

.penalties-box th {
    border: none;
}

.penalties-box th:first-child .p-column-header-content {
    justify-content: flex-start;
}

.penalties-box .p-column-header-content {
    justify-content: center;
}

.penalties-box .p-accordion-content {
    padding: 0rem !important;
}

.penalties-box a {
    padding: 1rem;
}

.penalties-team-logo {
    width: 30px;
}

.three-stars-box {
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    display:flex;
    justify-content:space-between;
    padding: 25px;
}

.three-stars-column {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.three-stars-formatting {
    margin-left: 15px;
}

.three-stars-stats {
    display: flex;
    justify-content: space-between;
}

.vertical-line-category {
    text-transform: uppercase;
    margin-top: -20px;
}

.vertical-line-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.vertical-line {
    border-left: 1px solid #ffffff1c;
    height: 100%;
}

.vertical-line-stars {
    display: flex;
    align-items: center;
    justify-content: end;
    height: 100%;
    margin-top: -125px;
}

.team-logo-game {
    width: 100px;
    height: 100px;
}

.team-logo-game:hover {
    cursor: pointer;
}

.player-logo {
    width: 65px;
    height: 65px;
    cursor: pointer;
    background-color: #ffffff14;
    border-width: thin;
    border-radius: 50px;
}

.category-headshot {
    width: 80px;
    height: 80px;
    cursor: pointer;
    background-color: #ffffff14;
    border-width: thin;
    border-radius: 50px;
}
.category-headshot.three-stars {
    width: 60px;
    height: 60px;
}

.player-team-logo {
    width: 40px;
    margin-left: -13px;
    margin-top: 38px;
}

.scoreboard-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.scoreboard-layout:hover {
    cursor: pointer;
}

.scoreboard-layout-middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.scoreboard-team-name {
    font-weight: bold;
    font-size: large;
}

.scoreboard-team-sog {
    font-size: small;
}

.game-powerplay-tag.away {
    margin-top: 17px;
    width: 35px;
    height: 17%;
    background-color: var(--main-color);
    color: black;
    border-radius: 3px;
    font-size: smaller;
    text-align: center;
    margin-left: 10px
}

.game-powerplay-tag.home {
    margin-bottom: -15px;
    width: 35px;
    height: 17%;
    background-color: var(--main-color);
    color: black;
    border-radius: 3px;
    font-size: smaller;
    text-align: center;
    margin-left: 73%;
}

.away-team-score-layout {
    font-size:65px;
    margin-left:130px;
}
.away-team-score-layout.pp {
    margin-top: -35px;
    height: 75%;
}

.home-team-score-layout {
    font-size:65px;
    margin-right:130px;
}
.home-team-score-layout.pp {
    margin-top: -20px;
    height: 100%;
}

.away-scoreboard {
    display: flex;
}

.middle-scoreboard {
    display: flex;
    flex-direction: column;
}

.home-scoreboard {
    display: flex;
}

.game-score-layout.away {
    display: flex;
    flex-direction: column;
    height: 104px;
}
.game-score-layout.home {
    display: flex;
    flex-direction: column-reverse;
    height: 104px;
}

.scoring-summary {
    color: #fff; /* Change the text color as needed */
    display: flex;
    flex-direction: column;
}

.goal-box {
    display: flex;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    margin-bottom: 5px;
    align-items: center;
}

.goal-text {
    font-size: large;
    margin-right: 10px;
    cursor: pointer;
}

.goal-text-amount {
    font-size: medium;
    color: #9f9f9f;
}

.goal-box-shootout {
    display: flex;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    margin-bottom: 5px;
    align-items: center;
    width: 50%;
}

.goal-text-shootout {
    font-size: large;
    margin-right: 10px;
    cursor: pointer;
    width: 70%
}

.special-teams {
    text-transform: uppercase;
    border: solid;
    border-width: thin;
    border-radius: 4px;
    border-color: var(--main-color);
    color: var(--main-color);
}

.summary-players {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding-left: 10px;
}

.assist-text {
    font-size: small;
    color: #9f9f9f;
}

.highlight-button {
    display: flex;
    background: #5e5e5e;
    color: #181818;
    font-size: 45px;
    border: none;
    border-radius: 50px;
    height: 40px;
    width: 37px;
    line-height: 1px;
    cursor: pointer;
    align-items: center;
    margin-left: auto;
    margin-right: 10px;
}

.penalty-shot-logo {
    width: 35px;
}

.season-series {
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    padding: 5px;
}

.season-series-games {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.season-series-game {
    width: 45%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
}

.season-series-game:hover {
    cursor: pointer;
    background-color: var(--hover-color);
    transition: width 4.5s ease;
}

.season-series-content {
    width: 100%;
    display: flex;
}

.game-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-left: 6px;
}

.team-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.team-content, .team-score {
    display: flex;
    align-items: center;
}

.team-content img {
    margin-right: 5px;
}

.team-score strong {
    margin-left: auto;
}

.team-stats {
    margin-top: 1rem;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
}

.game-stat {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.away-game-stat {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 10px;
}

.home-game-stat {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
}

.progress-bar {
    width: 100%;
    height: 5px;
    background-color: #f0f0f0; /* Background color of the progress bar */
    border-radius: 5px; /* Rounded corners */
    overflow: hidden; /* Hide overflow */
}

.progress {
    height: 100%;
    background-color: var(--main-color); /* Color of the progress bar */
    transition: width 4.5s ease; /* Smooth transition effect */
}

.last-ten-box {
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 1rem;
}

.last-ten-games {
    display: flex;
    flex-wrap: wrap;
}

.last-ten-game {
    display: flex;
    width: 20%;
    flex-direction: column;
    align-items: center;
}

.last-ten-opp {
    width: 80%;
    display: flex;
    justify-content: center;
    background-color: #ffffff21;
    color: white;
    border-radius: 5px;
}

.last-ten-team {
    display: flex;
    justify-content: space-between;
    font-size: medium;
    color: white;
    padding: 7px;
}

.overall-game-info {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    padding: 5px;
}

.overall-game-info-section {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
}

.overall-game-info-label {
    width:30%;
}

.game-favorite-team {
    color: var(--favorites-color);
}

.game-settings-section {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 40px;
    margin-top: -5px;
    margin-right: -20px;
    width: 100%;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
    .away-team-score-layout {
        display: flex;
        margin-top: 25px;
        margin-left: 10px;
        margin-right: 0px;
        font-size: 35px;
        align-items: center;
    }
    .away-team-score-layout.pp {
        margin-top: -7px;
        height: 75%;
    }
    .back-button {
        left: 0px;
    }
    .category-headshot {
        width: 60px;
        height: 60px;
    }
    .category-headshot.three-stars {
        width: 40px;
        height: 40px;
    }
    .date-formatting {
        margin-left: 10%;
    }
    .game-left-side {
        width: 100%;
    }
    .game-right-side {
        width: 100%;
        margin-left: 0px;
    }
    .game-powerplay-tag.away {
        margin-top: 5px;
        width: 16px;
        height: 15%;
        font-size: x-small;
        margin-left: 0px;
    }
    .game-powerplay-tag.home {
        margin-top: 5px;
        width: 16px;
        height: 15%;
        font-size: x-small;
        margin-right: 0px;
    }
    .game-summary {
        flex-direction: column;
        height: calc(100dvh - 230px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .game-type {
        margin-left: 0px;
    }
    .goal-box-shootout {
        width: 100%;
    }
    .goalie-record-section.away {
        align-items: flex-start;
    }
    .goalie-record-section.home {
        align-items: flex-end;
    }
    .goalie-compare.record{font-size:x-small}
    .goalie-compare.record-text{font-size:xx-small}
    .goalie-compare.svg{font-size:x-small}
    .goalie-compare.svg-text{font-size:xx-small}
    .goalie-compare.gaa{font-size:x-small}
    .goalie-compare.gaa-text{font-size:xx-small}
    .player-compare.first-name{font-size:x-small}
    .player-compare.last-name{font-size:small}
    .player-compare.position-num{font-size:x-small}
    .goalie-info-name {
        margin-left: 15px;
    }
    .goalie-stats-content-away-section {
        padding: 10px;
        margin-right: 0px;
        align-items: center;
        height: 100px;
    }
    .goalie-stats-content-home-section {
        padding: 10px;
        margin-left: 0px;
        align-items: center;
        height: 100px;
    }
    .goalie-stat-values {
        flex-direction: column;
    }
    .goalie-stat-info.away{
        padding-right: 5px;
    }
    .goalie-stat-info.home {
        padding-right: 5px;
    }
    .goalie-stat-values.away {
        margin-left: -10px;
        display: flex;
        align-items: flex-start;
    }
    .goalie-stat-values.home {
        margin-right: -10px;
        display: flex;
        align-items: flex-end;
    }
    .penalties-box .p-datatable-tbody {
        font-size: smaller;
    }
    .penalties-box a {
        padding: 0.5rem;
    }
    .highlight-button {
        font-size: 25px;
        height: 23px;
        width: 24px;
    }
    .highlight-modal {
        top: -250px;
    }
    .highlight-modal-content {
        margin: calc(100dvh - 295px) auto;
        padding: 0px 20px 0px 20px;
    }
    .home-team-score-layout {
        display: flex;
        margin-bottom: 23px;
        margin-left: 0px;
        margin-right: 10px;
        font-size: 35px;
        align-items: center;
    }
    .home-team-score-layout.pp {
        margin-top: 19px;
        height: 75%;
    }
    .away-scoreboard {
        display: flex;
        width: 42%;
        justify-content: flex-start;
    }
    .middle-scoreboard {
        font-size: small;
    }
    .home-scoreboard {
        display: flex;
        width: 42%;
        justify-content: flex-end;
    }
    .last-play-box {
        font-size: small;
    }
    .overall-game-info-section {
        font-size: small;
    }
    .players-stats-section .p-datatable-table {
        width: 165%;
    }
    .player-stats-teams {
        width: 80%;
    }
    .player-team-logo.three-stars {
        width: 30px;
        margin-left: -45px;
        margin-top: 30px;
    }
    .scoreboard {
        display: flex;
        padding: 0px;
        justify-content: space-between;
    }
    .scoreboard-city-name {
        font-size: smaller;
    }
    .scoreboard-layout-middle {
        width: 20%;
    }
    .scoreboard-layout.away {
        margin-left: 0%;
    }
    .scoreboard-layout.home {
        margin-left: 0%;
        font-size: small;
    }
    .scoreboard-team-name {
        font-weight: bold;
        font-size: small;
    }
    .scoreboard-team-sog {
        font-size: xx-small;
    }
    .stat-leader {
        margin-top: 30px;
    }
    .stat-leader-column.away {
        padding-left: 0px;
    }
    .stat-leader-column.home {
        padding-right: 0px;
    }
    .stat-leader-column.headshot {
        justify-content: center;
    }
    .stat-leader-player-info.away {
        align-items:center;
        padding-right: 0px;
        width: 70px;
    }
    .stat-leader-player-info.home {
        align-items:center;
        padding-left: 0px;
        width: 70px;
    }
    .team-leaders-header {
        margin: 0px;
    }
    .team-leaders-header-bar {
        margin-top: 2px;
        margin-bottom: 0px;
    }
    .team-leaders-header-text {
        font-size: small;
        display: flex;
        justify-content: center;
    }
    .team-leaders-last-five {
        display: flex;
        justify-content: center;
        font-size: x-small;
    }
    .team-leaders-logos {
        justify-content: space-around;
    }
    .team-leaders-logo-size {
        width: 66px;
    }
    .team-logo-game.away {
        width: 70px;
        height: 100px;
        margin-left: -8px;
    }
    .team-logo-game.home {
        width: 70px;
        height: 100px;
        margin-right: -8px;
    }
    .three-stars-box {
        padding: 10px;
    }
    .three-stars-column {
        font-size: xx-small;
        margin-right: 5px;
    }
    .three-stars-formatting {
        display: flex;
        margin-left: 0px;
        align-items: center;
    }
    .three-stars-stats {
        justify-content: space-around;
        width: 90%;
    }
    .vertical-line-category {
        width: 30px;
        display: flex;
        justify-content: center;
    }
    .vertical-line-stars {
        justify-content: flex-start;
        margin-top: -80px;
        margin-left: 113px;
    }
}
</style>