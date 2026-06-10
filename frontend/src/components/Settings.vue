<template>
    <div><ProgressSpinner v-if="isLoading" /></div>
    <div class="settings-options">
        <Button class="settings-button" icon="pi pi-cog" aria-label="Settings" @click="openSettingsModel()"/>
    </div>

    <div class="settings-modal" v-if="showSettings" @click="showSettings=false">
        <div class="settings-modal-content" @click.stop>
            <span class="settings-close" @click="showSettings=false">&times;</span>
            <div class="settings-content">
                <h1 class="settings-header">Settings</h1>
                <div class="favourite-teams-section">
                    <span>Favourite Teams</span>
                    <div class="favourite-teams-dropdown">
                        <MultiSelect
                            v-model="selectedFavoriteTeams"
                            :options="teams"
                            optionLabel="team"
                            optionValue="value"
                            filter
                            display="chip"
                            placeholder="Select Favourite Teams"
                            class="w-full"
                        >
                            <template #option="slotProps">
                                <div class="team-option">
                                    <img
                                        :src="slotProps.option.logo"
                                        :alt="slotProps.option.team"
                                        class="team-logo"
                                    />
                                    <span>
                                        {{ slotProps.option.team }}
                                    </span>
                                </div>
                            </template>
                        </MultiSelect>
                    </div>
                </div> 
                <div>
                    <Button class="settings-cancel" label="Cancel" @click="cancelSettings()"/>
                    <Button class="settings-save" label="Save" @click="saveSettings()"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import PanelMenu from 'primevue/panelmenu';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import MultiSelect from 'primevue/multiselect';
import { useAuthStore } from '@/stores/auth';
import teams from '@/constants/teams';

export default {
  name: 'Account',
  components: {
    ProgressSpinner,
    PanelMenu,
    Menubar,
    Button,
    MultiSelect
  },
  data() {
    return {
        auth: useAuthStore(),
        isLoading: false,
        todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0],
        showSettings: false,
        selectedFavoriteTeams: [],
        teams

    };
  },
  methods: {
    openSettingsModel() {
      this.showSettings = true;
    },
  },
};
</script>

<style>
.settings-button {
    color: var(--main-color);
    background: none;
    border: none;
    height: 20px;
    font-size: 15px;
    margin-top: 3px;
    cursor: pointer;
}

.settings-options {
  width: 3%;
}

.settings-modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: -375px;
  width: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.settings-modal-content {
  margin: 30% auto;
  padding: 20px;
  width: 60%;
}

.settings-close {
    color: white;
    font-size: x-large;
    cursor: pointer;
}

.settings-save {
  height: 40px;
  font-size: large;
  color: white;
  background-color: var(--hover-color);
  border: none;
  border-radius: 10px;
}

.settings-save:hover {
  cursor: pointer;
  background-color: var(--hover-dark-color);
  transition: background-color 0.4s ease;
}

.settings-cancel {
  height: 40px;
  font-size: large;
  color: white;
  background-color: var(--hover-color);
  border: none;
  border-radius: 10px;
}

.settings-cancel:hover {
  cursor: pointer;
  background-color: var(--hover-dark-color);
  transition: background-color 0.4s ease;
}

.settings-content {
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  justify-content: center;
}

.favourite-teams-section {
    display: flex;
}

.favourite-teams-dropdown {
    margin-left: 10px;
    max-width: 100%;
    overflow-x: auto;
}

.favourite-teams-dropdown .p-multiselect-item {
    display: flex;
}

.team-option {
    display: flex;
    align-items: center;
    gap: 10px;
}

.team-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
  .settings-modal {
    top: -65px;
  }
  .settings-modal-content {
    margin: 48% auto;
    width: 85%;
  }
  .settings-options {
    margin-left: 0%;
    margin-right: 3%;
  }
}
</style>