<template>
    <div><ProgressSpinner v-if="isLoading" /></div>
    <div class="settings-options">
        <Button class="settings-button" icon="pi pi-cog" aria-label="Settings" @click="openSettingsModel()"/>
    </div>

    <div v-if="showColorPicker" class="theme-picker" @click="showColorPicker=false">
      <span class="color-close" @click="showColorPicker=false">&times;</span>
      <color-picker v-bind="color" @input="onInput" style="width:200px;height:200px"></color-picker>
    </div>

    <div class="settings-modal" v-if="showSettings" @click="showSettings=false">
        <div class="settings-modal-content" @click.stop>
            <span class="settings-close" @click="showSettings=false;">&times;</span>
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
                <div class="theme-section">
                  <span>Theme</span>
                  <div class="theme-buttons">
                    <Button label="Select" :style="{ backgroundColor:selectedAppTheme, border:`1px solid ${selectedAppTheme}` }" @click="showColorPicker=true" />
                    <Button label="Default" style="background-color:#00F2FF;border:1px solid #00F2FF;" @click="selectedAppTheme='#00F2FF'"/>
                  </div>
                </div>
                <div class="settings-buttons">
                    <Button class="settings-cancel" label="Cancel" @click="showSettings=false"/>
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
import ColorPicker from '@radial-color-picker/vue-color-picker';
import '@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';
import teams from '@/constants/teams';

export default {
  name: 'Account',
  components: {
    ProgressSpinner,
    PanelMenu,
    Menubar,
    Button,
    MultiSelect,
    ColorPicker
  },
  data() {
    return {
        auth: useAuthStore(),
        isLoading: false,
        todaysDate: new Date(new Date().toLocaleDateString()).toISOString().split('T')[0],
        showSettings: false,
        selectedFavoriteTeams: [],
        originalFavoriteTeams: [],
        selectedAppTheme: '',
        originalAppTheme: '',
        teams,
        color: { hue: 0, saturation: 100, luminosity: 50, alpha: 1 },
        showColorPicker: false,
    };
  },
  methods: {
    openSettingsModel() {
      const prefs = usePreferencesStore();
      // copy current saved state into editable draft
      this.selectedFavoriteTeams = [...(Array.isArray(prefs.favorite_teams) ? prefs.favorite_teams : [])];
      this.originalFavoriteTeams = [...this.selectedFavoriteTeams];
      this.selectedAppTheme = prefs.app_theme;
      this.originalAppTheme = prefs.app_theme;
      this.showSettings = true;
    },
    async saveSettings() {
      const auth = useAuthStore();
      const prefs = usePreferencesStore();
      this.isLoading = true;

      try {
        prefs.favorite_teams = [...this.selectedFavoriteTeams];
        prefs.app_theme = this.selectedAppTheme;
        // save locally
        prefs.saveToLocal();
        // save server (if logged in)
        if (auth.token) {
          await prefs.saveToServer();
        }
        prefs.applyTheme();
        this.showSettings = false;
      } finally {
        this.isLoading = false;
      }
    },
    onInput(hue) {
      this.color.hue = hue;
      this.selectedAppTheme = this.hslToHex(this.color.hue, this.color.saturation, this.color.luminosity);
    },
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // Achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
    
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return "#" + toHex(r) + toHex(g) + toHex(b);
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
  background-color: #000000ea;
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

.settings-save:hover {
  cursor: pointer;
  background-color: var(--hover-dark-color);
  transition: background-color 0.4s ease;
}

.settings-save,
.settings-cancel {
  height: 40px;
  font-size: large;
  color: white;
  background-color: var(--hover-color);
  border: none;
  border-radius: 10px;
  width: 25%
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
  align-items: center;
}

.favourite-teams-dropdown {
  margin-left: 10px;
  max-width: 630px;
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

.theme-section {
  display: flex;
  align-items: center;
  margin-top: 2rem;
}

.theme-buttons {
  display: flex;
  justify-content: space-evenly;
  width: 80%;
}

.theme-picker {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
  align-items: center;
  justify-content: center;
}

.color-close {
    color: white;
    font-size: xxx-large;
    cursor: pointer;
}

.settings-buttons {
  margin-top: 2rem;
  display: flex;
  justify-content: space-around;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
  .favourite-teams-dropdown {
    max-width: 220px;
  }
  .settings-modal {
    top: -65px;
  }
  .settings-modal-content {
    margin: 48% auto;
    width: 100%;
  }
  .settings-options {
    margin-left: 0%;
    margin-right: 3%;
  }
  .settings-save,
  .settings-cancel {
    width: 30%
  }
}
</style>