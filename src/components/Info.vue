<template>
    <!-- <div><ProgressSpinner v-if="isLoading" /></div> -->

    <div>
        <div class="info-section">
            <h3 style="color:white">Player Info</h3>
            <div><strong>Birth Date: </strong><strong style="color:white">{{ playerInfo.birthDate }} (Age {{ getAge(playerInfo.birthDate) }})</strong></div>
            <div><strong>Birth Place: </strong><strong style="color:white">{{ playerInfo.birthCity.default }}, <strong v-if="playerInfo.birthStateProvince">{{ playerInfo.birthStateProvince.default }}, </strong>{{ playerInfo.birthCountry }}</strong></div>
            <div><strong>Height: </strong><strong style="color:white">{{ getHeight(playerInfo.heightInInches) }}</strong></div>
            <div><strong>Weight: </strong><strong style="color:white">{{ playerInfo.weightInPounds }} lbs</strong></div>
            <div><strong>Draft: </strong><strong style="color:white">{{ playerInfo.draftDetails.year }} - Round {{ playerInfo.draftDetails.round }} ({{ getRanking(playerInfo.draftDetails.overallPick) }} overall) by {{ playerInfo.draftDetails.teamAbbrev }}</strong></div>
            <div v-if="playerInfo.position!='G'"><strong>Shoots: </strong><strong style="color:white">{{ playerInfo.shootsCatches }}</strong></div>
            <div v-else><strong>Catches: </strong><strong style="color:white">{{ playerInfo.shootsCatches }}</strong></div>
        </div>
        <div v-if="playerInfo.awards" class="awards-section">
            <h3 class="awards-header">Awards</h3>
            <div v-if="playerInfo.position!='G'" v-for="award in playerInfo.awards">
                <strong class="awards-header">{{ award.trophy.default }}</strong>
                <DataTable :value="configureAward(award)" tableStyle="width: 100%">
                    <Column field="seasonId" header="Season" style="width:15%;text-align:left;color:white;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="gamesPlayed" header="GP" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="goals" header="G" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="assists" header="A" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="points" header="P" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="plusMinus" header="+/-" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="pim" header="PIM" style="width:4%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="hits" header="HIT" style="width:5%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="blockedShots" header="BLK" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                </DataTable>
            </div>
            <div v-else v-for="award in playerInfo.awards">
                <strong class="awards-header">{{ award.trophy.default }}</strong>
                <DataTable :value="configureAward(award)" tableStyle="width: 100%">
                    <Column field="seasonId" header="Season" style="width:15%;text-align:left;color:white;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="gamesPlayed" header="GP" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="wins" header="W" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="losses" header="L" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="otLosses" header="OTL" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="savePctg" header="SV%" style="width:3%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                    <Column field="gaa" header="GAA" style="width:4%;border-bottom:solid;border-width:thin;border-color:#ffffff0f"></Column>
                </DataTable>
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

export default {
    name: 'Season',
    components: {
        ProgressSpinner,
        DataTable,
        Column,
    },
    props: {
        id: String,
        playerInfo: Object,
    },
    mounted() {
        
    },
    data() {
      return {
          isLoading: true,
          error: null,
      };
    },
    methods: {
        configureAward(award) {
            let awardSeason = [];
            for(let i = award.seasons.length-1; i >= 0; i--) {
                if(this.playerInfo.position!='G') {
                    awardSeason.push({
                        'seasonId': this.formatYears(award.seasons[i].seasonId),
                        'gamesPlayed': award.seasons[i].gamesPlayed,
                        'goals': award.seasons[i].goals,
                        'assists': award.seasons[i].assists,
                        'points': award.seasons[i].points,
                        'plusMinus': award.seasons[i].plusMinus,
                        'pim': award.seasons[i].pim,
                        'hits': award.seasons[i].hits,
                        'blockedShots': award.seasons[i].blockedShots,
                    });
                } else {
                    awardSeason.push({
                        'seasonId': this.formatYears(award.seasons[i].seasonId),
                        'gamesPlayed': award.seasons[i].gamesPlayed,
                        'wins': award.seasons[i].wins,
                        'losses': award.seasons[i].losses,
                        'otLosses': award.seasons[i].otLosses,
                        'savePctg': (award.seasons[i].savePctg.toFixed(3)).slice(1),
                        'gaa': (award.seasons[i].gaa).toFixed(2),
                    });
                }
            }
            return awardSeason;
        },
        formatYears(years) {
            const yearsString = years.toString();
            const startYear = yearsString.slice(0, 4);
            const endYear = yearsString.slice(4);
            return `${startYear}-${endYear}`;
        },
        getRanking(value) {
            const lastDigit = value % 10;
            const suffix = (value % 100 > 10 && value % 100 < 20) ? 'th' : (lastDigit === 1) ? 'st' : (lastDigit === 2) ? 'nd' : (lastDigit === 3) ? 'rd' : 'th';
            return `${value}${suffix}`;
        },
        getHeight(height) {
            const feet = Math.floor(height / 12);
            const inches = height % 12;
            return `${feet}'${inches}"`;
        },
        getAge(birthdate) {
            const today = new Date();
            const birthDate = new Date(birthdate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },
    },
};
</script>

<style>
.info-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.awards-section {
    width: 60%;
    margin-left: 20%;
}

.awards-header {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
    .awards-section {
        width: 100%;
        margin-left: 0%;
    }
}
</style>