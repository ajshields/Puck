<template>
    <div><ProgressSpinner v-if="isLoading" /></div>
    <div class="lineup-content">
        <div v-if="forwards.length>0" class="forwards">
            <h3 class="lines-header">Forwards</h3>
            <div class="forwards-header" style="color:white">
                <strong class="player-spot">LW</strong>
                <strong class="player-spot">C</strong>
                <strong class="player-spot">RW</strong>
            </div>
            <div v-for="(players, index) in groupedForwards" :key="index" class="forward-line">
                <div v-for="(player, playerIndex) in players" :key="playerIndex" class="player-spot">
                    <img :src="getPlayerJersey(player.imageSrc)" alt="Player Jersey" class="player-jersey">
                    <div>{{ player.name }}</div>
                </div>
            </div>
        </div>

        <div v-if="defense.length>0" class="defense">
            <h3 class="lines-header">Defense Pairings</h3>
            <div v-for="(players, index) in groupedDefense" :key="index" class="defense-pairing">
                <div v-for="(player, playerIndex) in players" :key="playerIndex" class="player-spot">
                    <img :src="getPlayerJersey(player.imageSrc)" alt="Player Jersey" class="player-jersey">
                    <div>{{ player.name }}</div>
                </div>
            </div>
        </div>

        <div v-if="powerplay1.length>0" class="powerplay">
            <h3 class="lines-header">1st Powerplay Unit</h3>
            <div class="powerplay-line"> <!-- Forwards -->
                <div class="player-spot"><img :src="getPlayerJersey(powerplay1[0].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay1[0].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(powerplay1[1].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay1[1].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(powerplay1[2].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay1[2].name }}</div></div>
            </div>
            <div class="powerplay-line"> <!-- Defense -->
                <div class="player-spot"><img :src="getPlayerJersey(powerplay1[3].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay1[3].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(powerplay1[4].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay1[4].name }}</div></div>
            </div>
        </div>

        <div v-if="powerplay2.length>0" class="powerplay">
            <h3 class="lines-header">2nd Powerplay Unit</h3>
            <div class="powerplay-line"> <!-- Forwards -->
                <div class="player-spot"><img :src="getPlayerJersey(powerplay2[0].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay2[0].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(powerplay2[1].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay2[1].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(powerplay2[2].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay2[2].name }}</div></div>
            </div>
            <div class="powerplay-line"> <!-- Defense -->
                <div class="player-spot"><img :src="getPlayerJersey(powerplay2[3].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay2[3].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(powerplay2[4].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ powerplay2[4].name }}</div></div>
            </div>
        </div>

        <div v-if="penaltykill1.length>0" class="penaltykill">
            <h3 class="lines-header">1st Penalty Kill Unit</h3>
            <div class="penaltykill-line"> <!-- Forwards -->
                <div class="player-spot"><img :src="getPlayerJersey(penaltykill1[0].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ penaltykill1[0].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(penaltykill1[1].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ penaltykill1[1].name }}</div></div>
            </div>
            <div class="penaltykill-line"> <!-- Defense -->
                <div class="player-spot"><img :src="getPlayerJersey(penaltykill1[2].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ penaltykill1[2].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(penaltykill1[3].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ penaltykill1[3].name }}</div></div>
            </div>
        </div>

        <div v-if="penaltykill2.length>0" class="penaltykill">
            <h3 class="lines-header">2nd Penalty Kill Unit</h3>
            <div class="penaltykill-line"> <!-- Forwards -->
                <div class="player-spot"><img :src="getPlayerJersey(penaltykill2[0].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ penaltykill2[0].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(penaltykill2[1].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ penaltykill2[1].name }}</div></div>
            </div>
            <div class="penaltykill-line"> <!-- Defense -->
                <div class="player-spot"><img :src="getPlayerJersey(penaltykill2[2].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ penaltykill2[2].name }}</div></div>
                <div class="player-spot"><img :src="getPlayerJersey(penaltykill2[3].imageSrc)" alt="Player Jersey" class="player-jersey"><div>{{ penaltykill2[3].name }}</div></div>
            </div>
        </div>

        <div v-if="defense.length>0" class="goalies">
            <h3 class="lines-header">Goalies</h3>
            <div class="goalies-lines">
                <div v-for="(player, playerIndex) in goalies" :key="playerIndex" class="player-spot">
                    <img :src="getPlayerJersey(player.imageSrc)" alt="Player Jersey" class="player-jersey">
                    <div>{{ player.name }}</div>
                </div>
            </div>
        </div>

        <div v-if="injuries.length>0" class="injuries">
            <h3 class="lines-header">Injuries</h3>
            <div class="injuries-lines">
                <div v-for="(player, playerIndex) in injuries" :key="playerIndex" class="player-spot">
                    <img :src="getPlayerJersey(player.imageSrc)" alt="Player Jersey" class="player-jersey">
                    <div>{{ player.name }}</div>
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { fetchApiHtml } from '@/services/fetchApi';

export default {
    name: 'Lineup',
    components: {
        ProgressSpinner,
        DataTable,
        Column,
    },
    props: {
        id: String,
    },
    mounted() {
        this.fetchLineup();
    },
    data() {
        return {
            isLoading: true,
            date: new Date(),
            lineupTeam: null,
            forwards: [],
            defense: [],
            powerplay1: [],
            powerplay2: [],
            penaltykill1: [],
            penaltykill2: [],
            goalies: [],
            injuries: [],
            error: null,
        };
    },
    methods: {
        async fetchLineup() {
            this.setupTeamChange();
            try {
                const response = await fetchApiHtml(`/dailyFaceoff/teams/${this.lineupTeam.value}/line-combinations`); // Make a GET request to the server endpoint for scraping lineup data
                const htmlContent = await response.text(); // Get the HTML content as text
                this.parseHTML(htmlContent); // Parse the HTML content
                this.isLoading = false;
            } catch (error) {
                console.error('Error fetching lineup:', error);
                this.error = 'Error fetching lineup. See console for details.';
                this.isLoading = false;
            }
        },
        parseHTML(htmlContent) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const lineupContainer = doc.getElementById('defense');
            if (!lineupContainer) {
                console.error("Lineup container not found in HTML.");
                return;
            }
            const lineupDivs = lineupContainer.closest('.flex.flex-col').querySelectorAll('.flex.flex-row.flex-wrap.justify-evenly > div');
            const lineup = [];
            lineupDivs.forEach(div => {
                const playerNameSpan = div.querySelector('.text-xs.font-bold.uppercase.xl\\:text-base');
                const playerName = playerNameSpan ? playerNameSpan.textContent.trim() : 'Unknown';
                const img = div.querySelector('img');
                const playerImageSrc = img ? img.getAttribute('src') : null;
                if (playerName !== 'Unknown')
                lineup.push({ name: playerName, imageSrc: playerImageSrc });
            });

            for(let i = 0; i < lineup.length; i++) {
                if(i<=11) //forwards
                    this.forwards.push(lineup[i]);
                else if(i<=17) //defense
                    this.defense.push(lineup[i]);
                else if(i<=22) //powerplay1
                    this.powerplay1.push(lineup[i]);
                else if(i<=27) //powerplay2
                    this.powerplay2.push(lineup[i]);
                else if(i<=31) //penaltykill1
                    this.penaltykill1.push(lineup[i]);
                else if(i<=35) //penaltykill2
                    this.penaltykill2.push(lineup[i]);
                else if(i<=37) //goalies
                    this.goalies.push(lineup[i]);
                else //injuries
                    this.injuries.push(lineup[i]);
            }
        },
        setupTeamChange() {
            switch(this.id) {
                case 'ANA':
                    this.lineupTeam = {team: 'Anaheim Ducks', value: 'anaheim-ducks'};
                    break;
                case 'ARI':
                    this.lineupTeam = {team: 'Arizona Coyotes', value: 'arizona-coyotes'};
                    break;
                case 'BOS':
                    this.lineupTeam = {team: 'Boston Bruins', value: 'boston-bruins'};
                    break;
                case 'BUF':
                    this.lineupTeam = {team: 'Buffalo Sabres', value: 'buffalo-sabres'};
                    break;
                case 'CGY':
                    this.lineupTeam = {team: 'Calgary Flames', value: 'calgary-flames'};
                    break;
                case 'CAR':
                    this.lineupTeam = {team: 'Carolina Hurricanes', value: 'carolina-hurricanes'};
                    break;
                case 'CHI':
                    this.lineupTeam = {team: 'Chicago Blackhawks', value: 'chicago-blackhawks'};
                    break;
                case 'COL':
                    this.lineupTeam = {team: 'Colorado Avalanche', value: 'colorado-avalanche'};
                    break;
                case 'CBJ':
                    this.lineupTeam = {team: 'Columbus Blue Jackets', value: 'columbus-blue-jackets'};
                    break;
                case 'DAL':
                    this.lineupTeam = {team: 'Dallas Stars', value: 'dallas-stars'};
                    break;
                case 'DET':
                    this.lineupTeam = {team: 'Detroit Red Wings', value: 'detroit-red-wings'};
                    break;
                case 'EDM':
                    this.lineupTeam = {team: 'Edmonton Oilers', value: 'edmonton-oilers'};
                    break;
                case 'FLA':
                    this.lineupTeam = {team: 'Florida Panthers', value: 'florida-panthers'};
                    break;
                case 'LAK':
                    this.lineupTeam = {team: 'Los Angeles Kings', value: 'los-angeles-kings'};
                    break;
                case 'MIN':
                    this.lineupTeam = {team: 'Minnesota Wild', value: 'minnesota-wild'};
                    break;
                case 'MTL':
                    this.lineupTeam = {team: 'Montreal Canadiens', value: 'montreal-canadiens'};
                    break;
                case 'NSH':
                    this.lineupTeam = {team: 'Nashville Predators', value: 'nashville-predators'};
                    break;
                case 'NJD':
                    this.lineupTeam = {team: 'New Jersey Devils', value: 'new-jersey-devils'};
                    break;
                case 'NYI':
                    this.lineupTeam = {team: 'New York Islanders', value: 'new-york-islanders'};
                    break;
                case 'NYR':
                    this.lineupTeam = {team: 'New York Rangers', value: 'new-york-rangers'};
                    break;
                case 'OTT':
                    this.lineupTeam = {team: 'Ottawa Senators', value: 'ottawa-senators'};
                    break;
                case 'PHI':
                    this.lineupTeam = {team: 'Philadelphia Flyers', value: 'philadelphia-flyers'};
                    break;
                case 'PIT':
                    this.lineupTeam = {team: 'Pittsburgh Penguins', value: 'pittsburgh-penguins'};
                    break;
                case 'SJS':
                    this.lineupTeam = {team: 'San Jose Sharks', value: 'san-jose-sharks'};
                    break;
                case 'SEA':
                    this.lineupTeam = {team: 'Seattle Kraken', value: 'seattle-kraken'};
                    break;
                case 'STL':
                    this.lineupTeam = {team: 'St Louis Blues', value: 'st-louis-blues'};
                    break;
                case 'TBL':
                    this.lineupTeam = {team: 'Tampa Bay Lightning', value: 'tampa-bay-lightning'};
                    break;
                case 'TOR':
                    this.lineupTeam = {team: 'Toronto Maple Leafs', value: 'toronto-maple-leafs'};
                    break;
                case 'VAN':
                    this.lineupTeam = {team: 'Vancouver Canucks', value: 'vancouver-canucks'};
                    break;
                case 'VGK':
                    this.lineupTeam = {team: 'Vegas Golden Knights', value: 'vegas-golden-knights'};
                    break;
                case 'WSH':
                    this.lineupTeam = {team: 'Washington Capitals', value: 'washington-capitals'};
                    break;
                case 'WPG':
                    this.lineupTeam = {team: 'Winnipeg Jets', value: 'winnipeg-jets'};
                    break;
                default:
                    this.lineupTeam = null;
            }
        },
        getPlayerJersey(imageSrc) {
            // Split the string using '&' as the delimiter
            const parts = imageSrc.split('&');
            // Extract the first part which contains the URL
            const urlPart = parts[0];
            // Find the index of '='
            const index = urlPart.indexOf('=');
            // Extract the substring starting from the index of '=' + 1
            const encodedUrl = urlPart.substring(index + 1);
            // Decode the URL
            const decodedUrl = decodeURIComponent(encodedUrl);
            return decodedUrl;
        },
    },
    computed: {
        groupedForwards() {
            const grouped = [];
            for (let i = 0; i < this.forwards.length; i += 3) {
                grouped.push(this.forwards.slice(i, i + 3));
            }
            return grouped;
        },
        groupedDefense() {
            const grouped = [];
            for (let i = 0; i < this.defense.length; i += 2) {
                grouped.push(this.defense.slice(i, i + 2));
            }
            return grouped;
        },
    },
};
</script>

<style>
.forwards, .defense {
    display: flex;
    flex-direction: column;
}

.powerplay, .penaltykill, .goalies, .injuries {
    display: flex;
    flex-direction: column;
    border-bottom: solid;
    border-width: thin;
    border-color: #dedede1c;
}

.lines-header {
    font-size: x-large;
    color: white;
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.forwards-header, .forward-line, .defense-pairing {
    display: flex;
    justify-content: center;
    border-bottom: solid;
    border-width: thin;
    border-color: #dedede1c;
}

.powerplay-line, .penaltykill-line, .goalies-lines {
    display: flex;
    justify-content: center;
}

.injuries-lines {
    display: flex;
}

.player-spot {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;
    margin-top: 5px;
}

.player-jersey {
    width: 120px;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
    .injuries-lines {
        overflow-x: auto;
    }
    .lineup-content {
        margin-top: 1rem;
        height: calc(100dvh - 330px);
        overflow-y: auto;
        overflow-x: hidden;
    }
    .lines-header {
        margin-top: 0rem;
    }
    .player-jersey {
        width: 100px;
    }
    .player-spot {
        width: 100%;
        font-size: small;
    }
}
</style>