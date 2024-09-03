<template>
    <div><ProgressSpinner v-if="isLoading" /></div>

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
    name: 'SalaryCap',
    components: {
        ProgressSpinner,
        DataTable,
        Column,
    },
    props: {
        id: String,
    },
    mounted() {
        this.fetchSalaryCap();
    },
    data() {
        return {
            isLoading: true,
            date: new Date(),
            salaryTeam: null,
            error: null,
        };
    },
    methods: {
        async fetchSalaryCap() {
            this.setupTeamChange();
            console.log();
            try {
                const response = await fetch(`/puckPedia/team/${this.salaryTeam.value}`); // Make a GET request to the server endpoint for scraping salary cap data
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const htmlContent = await response.text(); // Get the HTML content as text
                console.log(htmlContent);
                //this.parseHTML(htmlContent); // Parse the HTML content
                this.isLoading = false;
            } catch (error) {
                console.error('Error fetching salary cap:', error);
                this.error = 'Error fetching salary cap. See console for details.';
                this.isLoading = false;
            }
        },
        parseHTML(htmlContent) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            //get fowards lines
            /*const forwardsContainer = doc.getElementById('forwards');
            if (!forwardsContainer) {
                console.error("Forwards container not found in HTML.");
                return;
            }
            const forwardDivs = forwardsContainer.closest('.flex.flex-col').querySelectorAll('.flex.flex-row.flex-wrap.justify-evenly > div');
            const forwards = [];
            forwardDivs.forEach(div => {
                const playerNameSpan = div.querySelector('.text-xs.font-bold.uppercase.xl\\:text-base');
                const playerName = playerNameSpan ? playerNameSpan.textContent.trim() : 'Unknown';
                const img = div.querySelector('img');
                const playerImageSrc = img ? img.getAttribute('src') : null;
                if(playerName!='Unknown')
                    forwards.push({ name: playerName, imageSrc: playerImageSrc });
            });*/
            //get defense lines
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
                    this.salaryTeam = {team: 'Anaheim Ducks', value: 'anaheim-ducks'};
                    break;
                case 'ARI':
                    this.salaryTeam = {team: 'Arizona Coyotes', value: 'arizona-coyotes'};
                    break;
                case 'BOS':
                    this.salaryTeam = {team: 'Boston Bruins', value: 'boston-bruins'};
                    break;
                case 'BUF':
                    this.salaryTeam = {team: 'Buffalo Sabres', value: 'buffalo-sabres'};
                    break;
                case 'CGY':
                    this.salaryTeam = {team: 'Calgary Flames', value: 'calgary-flames'};
                    break;
                case 'CAR':
                    this.salaryTeam = {team: 'Carolina Hurricanes', value: 'carolina-hurricanes'};
                    break;
                case 'CHI':
                    this.salaryTeam = {team: 'Chicago Blackhawks', value: 'chicago-blackhawks'};
                    break;
                case 'COL':
                    this.salaryTeam = {team: 'Colorado Avalanche', value: 'colorado-avalanche'};
                    break;
                case 'CBJ':
                    this.salaryTeam = {team: 'Columbus Blue Jackets', value: 'columbus-blue-jackets'};
                    break;
                case 'DAL':
                    this.salaryTeam = {team: 'Dallas Stars', value: 'dallas-stars'};
                    break;
                case 'DET':
                    this.salaryTeam = {team: 'Detroit Red Wings', value: 'detroit-red-wings'};
                    break;
                case 'EDM':
                    this.salaryTeam = {team: 'Edmonton Oilers', value: 'edmonton-oilers'};
                    break;
                case 'FLA':
                    this.salaryTeam = {team: 'Florida Panthers', value: 'florida-panthers'};
                    break;
                case 'LAK':
                    this.salaryTeam = {team: 'Los Angeles Kings', value: 'los-angeles-kings'};
                    break;
                case 'MIN':
                    this.salaryTeam = {team: 'Minnesota Wild', value: 'minnesota-wild'};
                    break;
                case 'MTL':
                    this.salaryTeam = {team: 'Montreal Canadiens', value: 'montreal-canadiens'};
                    break;
                case 'NSH':
                    this.salaryTeam = {team: 'Nashville Predators', value: 'nashville-predators'};
                    break;
                case 'NJD':
                    this.salaryTeam = {team: 'New Jersey Devils', value: 'new-jersey-devils'};
                    break;
                case 'NYI':
                    this.salaryTeam = {team: 'New York Islanders', value: 'new-york-islanders'};
                    break;
                case 'NYR':
                    this.salaryTeam = {team: 'New York Rangers', value: 'new-york-rangers'};
                    break;
                case 'OTT':
                    this.salaryTeam = {team: 'Ottawa Senators', value: 'ottawa-senators'};
                    break;
                case 'PHI':
                    this.salaryTeam = {team: 'Philadelphia Flyers', value: 'philadelphia-flyers'};
                    break;
                case 'PIT':
                    this.salaryTeam = {team: 'Pittsburgh Penguins', value: 'pittsburgh-penguins'};
                    break;
                case 'SJS':
                    this.salaryTeam = {team: 'San Jose Sharks', value: 'san-jose-sharks'};
                    break;
                case 'SEA':
                    this.salaryTeam = {team: 'Seattle Kraken', value: 'seattle-kraken'};
                    break;
                case 'STL':
                    this.salaryTeam = {team: 'St Louis Blues', value: 'st-louis-blues'};
                    break;
                case 'TBL':
                    this.salaryTeam = {team: 'Tampa Bay Lightning', value: 'tampa-bay-lightning'};
                    break;
                case 'TOR':
                    this.salaryTeam = {team: 'Toronto Maple Leafs', value: 'toronto-maple-leafs'};
                    break;
                case 'VAN':
                    this.salaryTeam = {team: 'Vancouver Canucks', value: 'vancouver-canucks'};
                    break;
                case 'VGK':
                    this.salaryTeam = {team: 'Vegas Golden Knights', value: 'vegas-golden-knights'};
                    break;
                case 'WSH':
                    this.salaryTeam = {team: 'Washington Capitals', value: 'washington-capitals'};
                    break;
                case 'WPG':
                    this.salaryTeam = {team: 'Winnipeg Jets', value: 'winnipeg-jets'};
                    break;
                default:
                    this.salaryTeam = null;
            }
        },
    },
};
</script>

<style>

</style>