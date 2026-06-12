import { defineStore } from 'pinia';
import { fetchApi } from '@/services/fetchApi';
import { useAuthStore } from '@/stores/auth';

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export const usePreferencesStore = defineStore('preferences', {
    state: () => ({
        favorite_teams: [],
        favorite_players: [],
        app_theme: '#00F2FF',
        loaded: false,
    }),

    actions: {
        // INIT
        async init() {
            this.loadFromLocal();
            const auth = useAuthStore();
            if (auth.isLoggedIn) {
              await this.fetchFromServer();
            }
            this.applyTheme();
            this.loaded = true;
        },

        // LOCAL STORAGE
        loadFromLocal() {
            const local = localStorage.getItem('preferences');
            if (!local) return;
            try {
                const parsed = JSON.parse(local);

                this.favorite_teams = asArray(parsed.favorite_teams);
                this.favorite_players = asArray(parsed.favorite_players);
                this.app_theme = parsed.app_theme || '#00F2FF';
            } catch (err) {
                console.warn('Failed to parse local preferences', err);

                // fallback safe state
                this.favorite_teams = [];
                this.favorite_players = [];
                this.app_theme = '#00F2FF';
            }
        },

        saveToLocal() {
            localStorage.setItem(
                'preferences',
                JSON.stringify({
                    favorite_teams: this.favorite_teams,
                    favorite_players: this.favorite_players,
                    app_theme: this.app_theme,
                })
            );
        },

        // SERVER
        async fetchFromServer() {
            try {
                const res = await fetchApi('/backend/user/preferences');
                const data = await res.json();

                if (!data) return;

                this.favorite_teams = asArray(data.favorite_teams);
                this.favorite_players = asArray(data.favorite_players);
                this.app_theme = data.app_theme || '#00F2FF';

                this.saveToLocal();
            } catch (err) {
                console.warn('Failed to fetch preferences from server', err);
            }
        },

        async saveToServer() {
            const auth = useAuthStore();
            if (!auth.isLoggedIn) return;

            await fetchApi('/backend/user/preferences', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
                body: {
                    favorite_teams: JSON.parse(JSON.stringify(this.favorite_teams)),
                    favorite_players: JSON.parse(JSON.stringify(this.favorite_players)),
                    app_theme: this.app_theme,
                },
            });
        },
        applyTheme() {
            document.documentElement.style.setProperty('--link-color', this.app_theme);
            document.documentElement.style.setProperty('--main-color', this.app_theme);
            document.documentElement.style.setProperty('--hover-color', `${this.app_theme}94`);
            document.documentElement.style.setProperty('--hover-dark-color', `${this.app_theme}3d`);
        }
    },
});