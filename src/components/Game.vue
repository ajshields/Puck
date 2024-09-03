<template>
    <div>
      <!-- <h2>{{ pageTitle }} - Game Page</h2> -->
      <!-- <p>Game ID: {{ id }}</p> -->
      <!-- ... (other content) -->
    </div>
    <div><ProgressSpinner v-if="isLoading" /></div>
    <Settings></Settings>

    <div class="highlight-modal" v-if="showHighlight">
      <div class="highlight-modal-content">
        <span class="highlight-close" @click="showHighlight=false">&times;</span>
        <video :src="`https://edge.api.brightcove.com/playback/v1/accounts/6415718365001/videos/6347431119112`" controls autoplay style="width:650px;height:400px;border-radius:10px"></video>
      </div>
    </div>

    <div v-if="game.gameType">
        <strong style="color:white">{{ dateDesc() }}</strong>
        <!-- SCOREBOARD -->
        <div class="scoreboard">
            <button @click="goBack" class="back-button">&#9664;</button>
            <!-- Away Scoreboard -->
            <div style="display:flex">
                <img :src="game.awayTeam.logo" alt="Away Team Logo" @click="goToTeam(game.awayTeam.abbrev)" class="team-logo-game">
                <div @click="goToTeam(game.awayTeam.abbrev)" class="scoreboard-layout">
                    <strong>{{ game.awayTeam.placeName.default }}</strong>
                    <strong style="font-weight:bold;font-size:large">{{ game.awayTeam.name.default }}</strong>
                    <strong v-if="game.gameState=='PRE' || game.gameState=='FUT'" style="font-size:small">{{ game.awayTeam.record }}</strong>
                    <strong v-if="game.awayTeam.sog" style="font-size:small">SOG: {{ game.awayTeam.sog }}</strong>
                </div>
                <strong v-if="game.situation && game.situation.awayTeam.situationDescriptions" class="game-powerplay-tag" style="margin-left:10px">PP</strong>
                <strong v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" style="font-size:65px;margin-left:130px">{{ game.awayTeam.score }}</strong>
            </div>
            <!-- Middle Scoreboard -->
            <div class="scoreboard-layout-middle">
                <div v-if="game.gameState=='PRE' || game.gameState=='FUT'" class="middle-scoreboard">
                    <strong>{{ gameStartTime(game.startTimeUTC) }}</strong>
                    <strong>{{ game.venue.default }}</strong>
                </div>
                <div v-else class="middle-scoreboard">
                    <strong v-if="(game.gameState=='LIVE' || game.gameState=='CRIT') && !game.clock.inIntermission" style="font-size:large">{{ game.clock.timeRemaining }}</strong>
                    <strong v-if="(game.gameState=='LIVE' || game.gameState=='CRIT')">{{ getPeriodScoreboard(game.summary.linescore.byPeriod.length, game.clock.inIntermission) }}</strong>
                    <strong v-if="game.gameState=='OFF' || game.gameState=='FINAL'" style="font-size:large">Final</strong>
                    <strong v-if="game.gameState=='OFF' || game.gameState=='FINAL'">{{ getPeriodScoreboard(game.summary.linescore.byPeriod.length, game.clock.inIntermission, true) }}</strong>
                </div>
            </div>
            <!-- Home Scoreboard -->
            <div style="display:flex">
                <strong v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" style="font-size:65px;margin-right:130px">{{ game.homeTeam.score }}</strong>
                <strong v-if="game.situation && game.situation.homeTeam.situationDescriptions" class="game-powerplay-tag" style="margin-right:10px">PP</strong>
                <div @click="goToTeam(game.homeTeam.abbrev)" class="scoreboard-layout">
                    <strong>{{ game.homeTeam.placeName.default }}</strong>
                    <strong style="font-weight:bold;font-size:large">{{ game.homeTeam.name.default }}</strong>
                    <strong v-if="game.gameState=='PRE' || game.gameState=='FUT'" style="font-size:small">{{ game.homeTeam.record }}</strong>
                    <strong v-if="game.homeTeam.sog" style="font-size:small">SOG: {{ game.homeTeam.sog }}</strong>
                </div>
                <img :src="game.homeTeam.logo" alt="Home Team Logo" @click="goToTeam(game.homeTeam.abbrev)" class="team-logo-game">
            </div>
        </div>
        <div style="margin-top:20px;"></div>

        <div class="game-summary">
            <div class="game-left-side">
                <!-- GAME PLAYS -->
                <div v-if="(game.gameState=='LIVE' || game.gameState=='CRIT') && plays.length>0" style="margin-top:1rem">
                    <h3 style="color:white">Last Play</h3>
                    <div class="last-play-box">
                        <div class="last-play">
                            <img v-if="plays[0].team" :src="plays[0].team" :alt="plays[0].team" style="padding-right:3%;width:50px"/>
                            <strong style="padding-right:5%">{{ plays[0].time }}</strong>
                            <strong>{{ plays[0].event }}</strong>
                        </div>
                        <Accordion class="plays-section">
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
                        </Accordion>
                    </div>
                </div>

                <!-- SCORING SUMMARY -->
                <div v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" class="scoring-summary">
                    <div v-for="period in game.summary.scoring">
                        <h3 v-if="period.goals[0]">{{ getPeriod(period) }}</h3>
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
                            <!-- <button @click="playHighlight(goal)" class="highlight-button">&#11208;</button> -->
                        </div>
                        <div v-else v-for="attempt in game.summary.shootout" class="goal-box">
                            <img :src="attempt.headshot" alt="Player Logo" class="player-logo">
                            <img :src="getPlayerTeamLogo(attempt.teamAbbrev)" alt="Player Team Logo" class="player-team-logo">
                            <div class="summary-players" style="width:100%">
                                <div style="display:inline-flex;align-items:center">
                                    <strong class="goal-text" style="width:30%">{{ getAbbrevName(attempt.firstName, attempt.lastName) }}<strong v-if="attempt.gameWinner" class="goal-text-amount"> (GW)</strong></strong>
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
                        <strong style="font-size:x-large;color: white">Goalie Comparison</strong>
                        <!-- <strong style="font-size:small">Goalie Comparison</strong> -->
                        <div class="team-leaders-header-bar"></div>
                        <div class="team-leaders-logos">
                            <img :src="game.awayTeam.logo" alt="Team Stats Logo" @click="goToTeam(game.awayTeam.abbrev)" style="width:80px;cursor:pointer">
                            <img :src="game.homeTeam.logo" alt="Team Stats Logo" @click="goToTeam(game.homeTeam.abbrev)" style="width:80px;cursor:pointer">
                        </div>
                    </div>
                    <div class="goalie-stats-content">
                        <!-- goalies away side -->
                        <div class="goalie-stats-content-away">
                            <div v-for="goalie in game.matchup.goalieComparison.awayTeam" style="display:flex;padding:20px;margin-right:-15px;">
                                <div v-if="goalie.record" class="goalie-stat-values" style="margin-left:-25px">
                                    <div style="display:flex;flex-direction:column;align-items:center"><strong style="color:white">{{ goalie.record }}</strong><strong style="font-size:x-small">Record</strong></div>
                                    <div style="display:flex;flex-direction:column;align-items:center"><strong style="color:white">{{ getSavePctg(goalie.savePctg) }}</strong><strong style="font-size:x-small">SV%</strong></div>
                                    <div style="display:flex;flex-direction:column;align-items:center"><strong style="color:white">{{ goalie.gaa }}</strong><strong style="font-size:x-small">GAA</strong></div>
                                </div>
                                <div @click="goToPlayer(goalie.playerId)" class="goalie-stat-info" style="align-items:flex-end;padding-right:15px">
                                    <strong style="font-size:small">{{ goalie.firstName.default }}</strong>
                                    <strong style="font-size:larger;color:white">{{ goalie.lastName.default }}</strong>
                                    <strong style="font-size:small">#{{ goalie.sweaterNumber }} - {{ goalie.positionCode }}</strong>
                                </div>
                                <img :src="goalie.headshot" @click="goToPlayer(goalie.playerId)" alt="Goalie Category Headshot" class="category-headshot">
                            </div>
                        </div>
                        <div class="stat-leader-column">
                            <div class="vertical-line-container"><div class="vertical-line"></div></div>
                        </div>
                        <!-- goalies home side -->
                        <div class="goalie-stats-content-home">
                            <div v-for="goalie in game.matchup.goalieComparison.homeTeam" style="display:flex;padding:20px;margin-left:-15px;">
                                <img :src="goalie.headshot" @click="goToPlayer(goalie.playerId)" alt="Goalie Category Headshot" class="category-headshot">
                                <div @click="goToPlayer(goalie.playerId)" class="goalie-stat-info" style="align-items:flex-start;padding-left:15px">
                                    <strong style="font-size:small">{{ goalie.firstName.default }}</strong>
                                    <strong style="font-size:larger;color:white">{{ goalie.lastName.default }}</strong>
                                    <strong style="font-size:small">#{{ goalie.sweaterNumber }} - {{ goalie.positionCode }}</strong>
                                </div>
                                <div v-if="goalie.record" class="goalie-stat-values" style="margin-right:-25px">
                                    <div style="display:flex;flex-direction:column;align-items:center"><strong style="color:white">{{ goalie.record }}</strong><strong style="font-size:x-small">Record</strong></div>
                                    <div style="display:flex;flex-direction:column;align-items:center"><strong style="color:white">{{ getSavePctg(goalie.savePctg) }}</strong><strong style="font-size:x-small">SV%</strong></div>
                                    <div style="display:flex;flex-direction:column;align-items:center"><strong style="color:white">{{ goalie.gaa }}</strong><strong style="font-size:x-small">GAA</strong></div>
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
                                    <strong @click="goToPlayer(getGoalieInfo(game.awayTeam.abbrev, 'id'))">{{ getGoalieInfo(game.awayTeam.abbrev, 'name') }}</strong>
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
                                    <strong @click="goToPlayer(getGoalieInfo(game.homeTeam.abbrev, 'id'))">{{ getGoalieInfo(game.homeTeam.abbrev, 'name') }}</strong>
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
                            <AccordionTab v-for="(penalties, index) in penaltySummary" :key="index" :header="getPenaltyPeriod(index)+' Period'">
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
                <div v-if="game.gameState=='PRE' || game.gameState=='FUT'" class="team-leaders">
                    <div class="team-leaders-header">
                        <strong style="font-size:x-large;color: white">Players to Watch</strong>
                        <strong style="font-size:small">Last 5 Games</strong>
                        <div class="team-leaders-header-bar"></div>
                        <div class="team-leaders-logos">
                            <img :src="game.awayTeam.logo" alt="Team Stats Logo" @click="goToTeam(game.awayTeam.abbrev)" style="width:80px;cursor:pointer">
                            <img :src="game.homeTeam.logo" alt="Team Stats Logo" @click="goToTeam(game.homeTeam.abbrev)" style="width:80px;cursor:pointer">
                        </div>
                    </div>
                    <div v-for="category in game.matchup.teamLeadersL5" class="stat-leader">
                        <div class="stat-leader-column" style="align-items:center;width:50px;padding-left:80px">
                            <strong style="font-size:xxx-large;color:white">{{ category.awayLeader.value }}</strong>
                            <strong style="font-size:small;margin-top:-10px;">{{ getValueLetter(category.category, false) }}</strong>
                        </div>
                        <div class="stat-leader-middle">
                            <div @click="goToPlayer(category.awayLeader.playerId)" class="stat-leader-player-info" style="align-items:flex-end;padding-right:25px">
                                <strong style="font-size:small">{{ category.awayLeader.firstName.default }}</strong>
                                <strong style="font-size:larger;color:white">{{ category.awayLeader.lastName.default }}</strong>
                                <strong style="font-size:small">#{{ category.awayLeader.sweaterNumber }} - {{ category.awayLeader.positionCode }}</strong>
                            </div>
                            <div class="stat-leader-column">
                                <img :src="category.awayLeader.headshot" @click="goToPlayer(category.awayLeader.playerId)" alt="Player Category Headshot" class="category-headshot">
                            </div>
                            <div class="stat-leader-column">
                                <strong style="text-transform:uppercase;margin-top:-20px">{{ category.category }}</strong>
                                <div class="vertical-line-container"><div class="vertical-line"></div></div>
                            </div>
                            <div class="stat-leader-column">
                                <img :src="category.homeLeader.headshot" @click="goToPlayer(category.homeLeader.playerId)" alt="Player Category Headshot" class="category-headshot">
                            </div>
                            <div @click="goToPlayer(category.homeLeader.playerId)" class="stat-leader-player-info" style="align-items:flex-start;padding-left:25px">
                                <strong style="font-size:small">{{ category.homeLeader.firstName.default }}</strong>
                                <strong style="font-size:larger;color:white">{{ category.homeLeader.lastName.default }}</strong>
                                <strong style="font-size:small">#{{ category.homeLeader.sweaterNumber }} - {{ category.homeLeader.positionCode }}</strong>
                            </div>
                        </div>
                        <div class="stat-leader-column" style="align-items:center;width:50px;padding-right:80px">
                            <strong style="font-size:xxx-large;color:white">{{ category.homeLeader.value }}</strong>
                            <strong style="font-size:small;margin-top:-10px;">{{ getValueLetter(category.category, false) }}</strong>
                        </div>
                    </div>
                </div>

                <!-- PLAYER STATS -->
                <div v-if="game.gameState=='PRE' || game.gameState=='FUT'">
                    <div class="player-stats-box" style="margin-top:1rem">
                        <h3 style="color:white">Player Stats</h3>
                        <div class="player-stats-teams">
                            <v-button class="player-stats-button" :class="{ 'player-stats-button-selected': playerStatsTeamSelected === game.awayTeam.id }" @click="switchPlayerStats(game.awayTeam.id)">{{ game.awayTeam.name.default }}</v-button>
                            <v-button class="player-stats-button" :class="{ 'player-stats-button-selected': playerStatsTeamSelected === game.homeTeam.id }" @click="switchPlayerStats(game.homeTeam.id)">{{ game.homeTeam.name.default }}</v-button>
                        </div>
                    </div>
                    <DataTable :value="playerStats" :sortField="'points'" :sortOrder="-1" @row-click="rowGoToPlayer" tableStyle="width: 100%">
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
                                    <!-- <img src="@/assets/star.svg" alt="Star" style="margin-top:5px"/> -->
                                    <strong style="font-size:xx-large;color:var(--main-color)">&#128970;</strong>
                                </div>
                                <div style="margin-left:15px">
                                    <img :src="player.headshot" @click="goToPlayer(player.playerId)" alt="Player Category Headshot" class="category-headshot">
                                    <img :src="getPlayerTeamLogo(player.teamAbbrev)" alt="Player Team Logo" class="player-team-logo">
                                </div>
                                <div class="three-stars-column">
                                    <strong @click="goToPlayer(player.playerId)" style="cursor:pointer">{{ player.name }}</strong>
                                    <strong>#{{ player.sweaterNo }} - {{ player.position }}</strong>
                                    <strong></strong>
                                </div>
                            </div>
                            <div>
                                <div v-if="player.position=='G'" style="display:flex;justify-content:space-between">
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
                                        <strong style="color:white">{{ configureThreeStars(player, 'savePctg') }}</strong>
                                        <strong style="font-size:x-small">SV%</strong>
                                    </div>
                                </div>
                                <div v-else style="display:flex;justify-content:space-between">
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
                <div v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'">
                    <div class="player-stats-box" style="margin-top:1rem">
                        <h3 style="color:white">Stats</h3>
                        <div class="player-stats-teams">
                            <v-button class="player-stats-button" :class="{ 'player-stats-button-selected': playerGameStatsTeamSelected === game.awayTeam.id }" @click="switchPlayerGameStats('away')">{{ game.awayTeam.name.default }}</v-button>
                            <v-button class="player-stats-button" :class="{ 'player-stats-button-selected': playerGameStatsTeamSelected === game.homeTeam.id }" @click="switchPlayerGameStats('home')">{{ game.homeTeam.name.default }}</v-button>
                        </div>
                    </div>
                    <DataTable :value="playerGameStats" :sortField="'points'" :sortOrder="-1" @row-click="rowGoToPlayer" tableStyle="width: 100%">
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
                <div v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'">
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
                        <Column v-if="this.game.summary && this.game.summary.shotsByPeriod.length>3" field="overtime" header="OT" sortable style="width: 5%"></Column>
                        <Column field="total" header="T" sortable style="width: 5%"></Column>
                    </DataTable>
                </div>

                <!-- PERIOD SHOTS -->
                <div v-if="game.gameState=='LIVE' || game.gameState=='CRIT' || game.gameState=='OFF' || game.gameState=='FINAL'" style="margin-top:1rem">
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
                        <Column v-if="this.game.summary && this.game.summary.shotsByPeriod.length>3" field="overtime" header="OT" sortable style="width: 5%"></Column>
                        <Column field="total" header="T" sortable style="width: 5%"></Column>
                    </DataTable>
                </div>

                <!-- SEASON SERIES -->
                <div v-if="game.gameState=='PRE' || game.gameState=='FUT'" style="margin-top:1rem">
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
                    <div v-if="game.gameState=='PRE' || game.gameState=='FUT'">
                        <div class="game-stat" style="margin-bottom:20px">
                            <div class="away-game-stat"><img :src="game.awayTeam.logo" alt="Team Stats Logo" style="width: 30px"><strong style="color:white">{{ game.awayTeam.abbrev }}</strong></div>
                            <strong style="color:white">Team Stats</strong>
                            <div class="home-game-stat"><strong style="color:white">{{ game.homeTeam.abbrev }}</strong><img :src="game.homeTeam.logo" alt="Team Stats Logo" style="width: 30px"></div>
                        </div>
                        <!-- pp% category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ calculatePercentage(game.matchup.teamSeasonStats.awayTeam.ppPctg, 1) }}%</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(game.matchup.teamSeasonStats.awayTeam.ppPctgRank) }})</strong></div>
                            <strong>Power Play %</strong>
                            <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(game.matchup.teamSeasonStats.homeTeam.ppPctgRank) }})</strong><strong>{{ calculatePercentage(game.matchup.teamSeasonStats.homeTeam.ppPctg, 1) }}%</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.matchup.teamSeasonStats.awayTeam.ppPctg, game.matchup.teamSeasonStats.homeTeam.ppPctg) + '%' }"></div>
                        </div>
                        <!-- pk% category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ calculatePercentage(game.matchup.teamSeasonStats.awayTeam.pkPctg, 1) }}%</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(game.matchup.teamSeasonStats.awayTeam.pkPctgRank) }})</strong></div>
                            <strong>Penalty Kill %</strong>
                            <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(game.matchup.teamSeasonStats.homeTeam.pkPctgRank) }})</strong><strong>{{ calculatePercentage(game.matchup.teamSeasonStats.homeTeam.pkPctg, 1) }}%</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.matchup.teamSeasonStats.awayTeam.pkPctg, game.matchup.teamSeasonStats.homeTeam.pkPctg) + '%' }"></div>
                        </div>
                        <!-- fo% category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ calculatePercentage(game.matchup.teamSeasonStats.awayTeam.faceoffWinningPctg, 1) }}%</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(game.matchup.teamSeasonStats.awayTeam.faceoffWinningPctgRank) }})</strong></div>
                            <strong>Faceoff %</strong>
                            <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(game.matchup.teamSeasonStats.homeTeam.faceoffWinningPctgRank) }})</strong><strong>{{ calculatePercentage(game.matchup.teamSeasonStats.homeTeam.faceoffWinningPctg, 1) }}%</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.matchup.teamSeasonStats.awayTeam.faceoffWinningPctg, game.matchup.teamSeasonStats.homeTeam.faceoffWinningPctg) + '%' }"></div>
                        </div>
                        <!-- gf/g% category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ game.matchup.teamSeasonStats.awayTeam.goalsForPerGamePlayed }}</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(game.matchup.teamSeasonStats.awayTeam.goalsForPerGamePlayedRank) }})</strong></div>
                            <strong>GF/GP</strong>
                            <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(game.matchup.teamSeasonStats.homeTeam.goalsForPerGamePlayedRank) }})</strong><strong>{{ game.matchup.teamSeasonStats.homeTeam.goalsForPerGamePlayed }}</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.matchup.teamSeasonStats.awayTeam.goalsForPerGamePlayed, game.matchup.teamSeasonStats.homeTeam.goalsForPerGamePlayed) + '%' }"></div>
                        </div>
                        <!-- ga/g% category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ game.matchup.teamSeasonStats.awayTeam.goalsAgainstPerGamePlayed }}</strong><strong style="font-size:small;margin-left:4px">({{ getRanking(game.matchup.teamSeasonStats.awayTeam.goalsAgainstPerGamePlayedRank) }})</strong></div>
                            <strong>GA/GP</strong>
                            <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ getRanking(game.matchup.teamSeasonStats.homeTeam.goalsAgainstPerGamePlayedRank) }})</strong><strong>{{ game.matchup.teamSeasonStats.homeTeam.goalsAgainstPerGamePlayed }}</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.matchup.teamSeasonStats.awayTeam.goalsAgainstPerGamePlayed, game.matchup.teamSeasonStats.homeTeam.goalsAgainstPerGamePlayed) + '%' }"></div>
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
                            <div class="away-game-stat"><strong>{{ game.summary.teamGameStats[0].awayValue }}</strong></div>
                            <strong>Shots On Goal</strong>
                            <div class="home-game-stat"><strong>{{ game.summary.teamGameStats[0].homeValue }}</strong></div>
                        </div>
                        <!-- progress bar below -->
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.summary.teamGameStats[0].awayValue, game.summary.teamGameStats[0].homeValue) + '%' }"></div>
                        </div>
                        <!-- fo% category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ calculatePercentage(game.summary.teamGameStats[1].awayValue, 1) }}%</strong></div>
                            <strong>Faceoff %</strong>
                            <div class="home-game-stat"><strong>{{ calculatePercentage(game.summary.teamGameStats[1].homeValue, 1) }}%</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.summary.teamGameStats[1].awayValue, game.summary.teamGameStats[1].homeValue) + '%' }"></div>
                        </div>
                        <!-- pp% category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ fractionToPercentage(game.summary.teamGameStats[2].awayValue) }}%</strong><strong style="font-size:small;margin-left:4px">({{ game.summary.teamGameStats[2].awayValue }})</strong></div>
                            <strong>Power Play %</strong>
                            <div class="home-game-stat"><strong style="font-size:small;margin-right:4px">({{ game.summary.teamGameStats[2].homeValue }})</strong><strong>{{ fractionToPercentage(game.summary.teamGameStats[2].homeValue) }}%</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.summary.teamGameStats[2].awayValue, game.summary.teamGameStats[2].homeValue, true) + '%' }"></div>
                        </div>
                        <!-- pim category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ game.summary.teamGameStats[4].awayValue }}</strong></div>
                            <strong>Penalty Minutes</strong>
                            <div class="home-game-stat"><strong>{{ game.summary.teamGameStats[4].homeValue }}</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.summary.teamGameStats[4].awayValue, game.summary.teamGameStats[4].homeValue, true) + '%' }"></div>
                        </div>
                        <!-- hits category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ game.summary.teamGameStats[5].awayValue }}</strong></div>
                            <strong>Hits</strong>
                            <div class="home-game-stat"><strong>{{ game.summary.teamGameStats[5].homeValue }}</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.summary.teamGameStats[5].awayValue, game.summary.teamGameStats[5].homeValue, true) + '%' }"></div>
                        </div>
                        <!-- blocked shots category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ game.summary.teamGameStats[6].awayValue }}</strong></div>
                            <strong>Blocked Shots</strong>
                            <div class="home-game-stat"><strong>{{ game.summary.teamGameStats[6].homeValue }}</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.summary.teamGameStats[6].awayValue, game.summary.teamGameStats[6].homeValue, true) + '%' }"></div>
                        </div>
                        <!-- giveaways category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ game.summary.teamGameStats[7].awayValue }}</strong></div>
                            <strong>Giveaways</strong>
                            <div class="home-game-stat"><strong>{{ game.summary.teamGameStats[7].homeValue }}</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.summary.teamGameStats[7].awayValue, game.summary.teamGameStats[7].homeValue, true) + '%' }"></div>
                        </div>
                        <!-- takeaways category -->
                        <div class="game-stat">
                            <div class="away-game-stat"><strong>{{ game.summary.teamGameStats[8].awayValue }}</strong></div>
                            <strong>Takeaways</strong>
                            <div class="home-game-stat"><strong>{{ game.summary.teamGameStats[8].homeValue }}</strong></div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: calculateProgressPercentage(game.summary.teamGameStats[8].awayValue, game.summary.teamGameStats[8].homeValue, true) + '%' }"></div>
                        </div>
                    </div>
                </div>

                <!-- LAST 10 GAMES -->
                <div v-if="game.gameState=='PRE' || game.gameState=='FUT'" style="margin-top:1rem">
                    <h3 style="margin-top:0rem;padding:5px;color:white">Last 10 Games</h3>
                    <div>
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
                <div class="overall-game-info">
                    <h3 style="margin-top:0rem;padding:5px;color:white">Game Info</h3>
                    <div class="overall-game-info-section">
                        <strong class="overall-game-info-label">Networks</strong>
                        <strong v-for="(network, index) in game.tvBroadcasts" :key="index"><strong v-if="index!=0">, </strong>{{ network.network }}</strong>
                    </div>
                    <div class="overall-game-info-section">
                        <strong class="overall-game-info-label">Location</strong>
                        <strong>{{ game.venue.default }}, {{ game.venueLocation.default }}</strong>
                    </div>
                    <div class="overall-game-info-section">
                        <strong class="overall-game-info-label">{{ game.awayTeam.abbrev }} Coach</strong>
                        <strong v-if="game.matchup">{{ game.matchup.gameInfo.awayTeam.headCoach.default }}</strong>
                        <strong v-if="game.summary">{{ game.summary.gameInfo.awayTeam.headCoach.default }}</strong>
                    </div>
                    <div class="overall-game-info-section">
                        <strong class="overall-game-info-label">{{ game.homeTeam.abbrev }} Coach</strong>
                        <strong v-if="game.matchup">{{ game.matchup.gameInfo.homeTeam.headCoach.default }}</strong>
                        <strong v-if="game.summary">{{ game.summary.gameInfo.homeTeam.headCoach.default }}</strong>
                    </div>
                    <div v-if="game.summary" class="overall-game-info-section">
                        <strong class="overall-game-info-label">Referees</strong>
                        <strong v-for="(referee, index) in game.summary.gameInfo.referees" :key="index"><strong v-if="index!=0">, </strong>{{ referee.default }}</strong>
                    </div>
                    <div v-if="game.summary" class="overall-game-info-section">
                        <strong class="overall-game-info-label">Linesmen</strong>
                        <strong v-for="(linesmen, index) in game.summary.gameInfo.linesmen" :key="index"><strong v-if="index!=0">, </strong>{{ linesmen.default }}</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Display error message -->
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
</template>
  
<script>
import ProgressSpinner from './ProgressSpinner.vue';
import Settings from '@/components/Settings.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';

export default {
    name: 'Game',
    components: {
        ProgressSpinner,
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
            error: null,
            selectedDate: null,
            game: {},
            boxScore: {},
            plays: [],
            lineScore: [],
            periodShots: [],
            penaltySummary: [],
            playerStats: [],
            playerStatsTeamSelected: null,
            playerGameStats: [],
            playerGameStatsTeamSelected: null,
        };
    },
    mounted() {
        this.fetchGame();
        this.fetchGameBox();
        this.fetchPlays();
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
                const response = await fetch(`/api/v1_1/gamecenter/${this.id}/landing`, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
          
                const data = await response.json();
                this.game = data;
                console.log(this.game);
                this.configureLineScore();
                this.configurePeriodShots();
                this.configurePenaltySummary();
                this.switchPlayerStats(data.awayTeam.id);
                this.isLoading = false;
            } catch (error) {
              console.error('Error fetching scores:', error);
              alert('Error fetching scores. See console for details.');
            }
        },
        async fetchGameBox() {
            try {
                this.isLoading = true;
                const response = await fetch(`/api/v1_1/gamecenter/${this.id}/boxscore`, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                this.boxScore = data;
                console.log(this.boxScore);
                this.switchPlayerGameStats('away');
                this.isLoading = false;
            } catch (error) {
              console.error('Error fetching scores:', error);
              alert('Error fetching scores. See console for details.');
            }
        },
        async fetchPlays() {
            try {
                this.isLoading = true;
                const response = await fetch(`/api/v1/gamecenter/${this.id}/play-by-play`, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                this.configurePlays(data);
                this.isLoading = false;
            } catch (error) {
              console.error('Error fetching scores:', error);
              alert('Error fetching scores. See console for details.');
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
            console.log(data);
            for(let i = data.plays.length-1; i>=0; i--) {
                let team = '';
                let event = '';
                switch(data.plays[i].typeDescKey) {
                    case 'stoppage':
                        event = data.plays[i].details.secondaryReason ? `Stoppage - ${(data.plays[i].details.secondaryReason).replace(/-/g, ' ')}` : `Stoppage - ${(data.plays[i].details.reason).replace(/-/g, ' ')}`;
                        break;
                    case 'period-start':
                        event = `Start of period ${data.plays[i].period}`
                        break;
                    case 'period-end':
                        event = `End of period ${data.plays[i].period}`
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
            if(this.game.gameState == "LIVE" || this.game.gameState == 'CRIT' || this.game.gameState == "OFF" || this.game.gameState == "FINAL") {
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
            if(this.game.gameState == "LIVE" || this.game.gameState == 'CRIT' || this.game.gameState == "OFF" || this.game.gameState == "FINAL") {
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
                this.game.matchup.skaterSeasonStats.forEach((player) => {
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
            if(this.boxScore.boxscore) {
                this.playerGameStats = [];
                if(teamId=='away') {
                    this.playerGameStatsTeamSelected = this.boxScore.awayTeam.id;
                    this.boxScore.boxscore.playerByGameStats.awayTeam.forwards.forEach((player) => {
                        this.playerGameStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.shots,
                            'hits': player.hits,
                            'powerPlayGoals': player.powerPlayGoals,
                            'avgTimeOnIce': player.toi,
                            'faceoffWinningPctg': isNaN(player.faceoffWinningPctg) ? '' : (player.faceoffWinningPctg*100).toFixed(1),
                        });
                    });
                    this.boxScore.boxscore.playerByGameStats.awayTeam.defense.forEach((player) => {
                        this.playerGameStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.shots,
                            'hits': player.hits,
                            'powerPlayGoals': player.powerPlayGoals,
                            'avgTimeOnIce': player.toi,
                            'faceoffWinningPctg': isNaN(player.faceoffWinningPctg) ? '' : (player.faceoffWinningPctg*100).toFixed(1),
                        });
                    });
                } else {
                    this.playerGameStatsTeamSelected = this.boxScore.homeTeam.id;
                    this.boxScore.boxscore.playerByGameStats.homeTeam.forwards.forEach((player) => {
                        this.playerGameStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.shots,
                            'hits': player.hits,
                            'powerPlayGoals': player.powerPlayGoals,
                            'avgTimeOnIce': player.toi,
                            'faceoffWinningPctg': isNaN(player.faceoffWinningPctg) ? '' : (player.faceoffWinningPctg*100).toFixed(1),
                        });
                    });
                    this.boxScore.boxscore.playerByGameStats.homeTeam.defense.forEach((player) => {
                        this.playerGameStats.push({
                            'sweaterNumber': player.sweaterNumber,
                            'name': player.name.default,
                            'goals': player.goals,
                            'assists': player.assists,
                            'points': player.points,
                            'plusMinus': player.plusMinus,
                            'pim': player.pim,
                            'shots': player.shots,
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
                const teamStats = teamAbbrev === this.boxScore.awayTeam.abbrev ? 
                        this.boxScore.boxscore.playerByGameStats.awayTeam :
                        this.boxScore.boxscore.playerByGameStats.homeTeam;

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
                        return goalie.savePctg;
                    case 'id':
                        return goalie.playerId;
                    default:
                        return '';
                }
            }
        },
        configureThreeStars(player, statType, goalieStatType) {
            if(this.boxScore.id) {
                // Determine the team abbreviation
                const teamAbbrev = player.teamAbbrev;
                const teamStats = teamAbbrev === this.boxScore.awayTeam.abbrev ? 
                    this.boxScore.boxscore.playerByGameStats.awayTeam :
                    this.boxScore.boxscore.playerByGameStats.homeTeam;

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
                            team: penalty.teamAbbrev,
                            player: penalty.committedByPlayer,
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
        getPeriodScoreboard(period, intermission, over) {
            let periodShow = '';
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
            if(intermission)
                periodShow = periodShow + ' INT';
            return periodShow;
        },
        getPeriod(period) {
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
            // Split the fraction string into numerator and denominator
            const [numeratorStr, denominatorStr] = fraction.split('/');
            // Parse the numerator and denominator as floats
            const numerator = parseFloat(numeratorStr);
            const denominator = parseFloat(denominatorStr);
            // Calculate the fraction value
            const fractionValue = numerator / denominator;
            // Multiply the fraction value by 100 to get the percentage value
            const percentage = fractionValue * 100;
            // Return the percentage value
            return isNaN(percentage) ? 0 : percentage.toFixed(1);
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
        getPenaltyPeriod(index) {
            if(this.game.summary) {
                const period = this.game.summary.penalties[index].periodDescriptor.number;
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
        },
        playHighlight(goal) {
            this.showHighlight = true;
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
                if(this.playerGameStatsTeamSelected == this.game.awayTeam.id) {
                    this.boxScore.boxscore.playerByGameStats.awayTeam.forwards.forEach((player) => {
                        if(row.data.name == player.name.default)
                            this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                    });
                    this.boxScore.boxscore.playerByGameStats.awayTeam.defense.forEach((player) => {
                        if(row.data.name == player.name.default)
                            this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                    });
                } else {
                    this.boxScore.boxscore.playerByGameStats.homeTeam.forwards.forEach((player) => {
                        if(row.data.name == player.name.default)
                            this.$router.push({ name: 'player.season', params: { id: player.playerId }});
                    });
                    this.boxScore.boxscore.playerByGameStats.homeTeam.defense.forEach((player) => {
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
  top: -50px;
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

.back-button {
    background: none;
    border: none;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    position: absolute;
    left: 20px; /* Adjust the left position as needed */
    top: 2%; /* Vertically center the button */
    transform: translateY(-50%);
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

.goalie-stats-content-home {
    width: 50%;
    display: flex;
    flex-direction: column;
}

.goalie-stat-values {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.goalie-stat-info {
    display: flex;
    flex-direction: column;
    width: 125px;
    align-self: center;
    cursor: pointer;
}

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

.stat-leader {
    display: flex;
    justify-content: space-between;
    margin-top: 45px;
}

.stat-leader-column {
    display: flex;
    flex-direction: column;
}

.stat-leader-player-info {
    display: flex;
    flex-direction: column;
    width: 115px;
    align-self: center;
    cursor: pointer;
}

.stat-leader-middle {
    display: flex;
    flex-direction: row;
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
}

.stats-name-header {
    text-align: left;
}

.player-stats-button {
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

.player-stats-button:hover {
    background-color: var(--main-color);
    color: black;
}

.player-stats-button-selected {
    background-color: var(--main-color);
    color: black;
}

.penalties-box {
    cursor: pointer;
    border: solid;
    border-width: thin;
    border-color: #ffffff14;
    border-radius: 5px;
    padding: 5px;
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
    padding: 10px;
}

.three-stars-column {
    display: flex;
    flex-direction: column;
    align-items: center;
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

.game-powerplay-tag {
    margin-top: 17px;
    width: 35px;
    height: 100%;
    background-color: var(--main-color);
    /* color: black; */
    border-radius: 3px;
    font-size: smaller;
    text-align: center;
}

.middle-scoreboard {
    display: flex;
    flex-direction: column;
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
    font-size: 30px;
    border: none;
    border-radius: 50px;
    height: 40px;
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
</style>