<template>
    <div class="layout-container">
        <header class="layout-header">
            <div class="layout-header-nav">
              <router-link :to="'/scores'" class="app-header">Puck</router-link>
              <div class="settings-section">
                <Settings></Settings>
                <Account></Account>
                <Options></Options>
              </div>
            </div>
            <nav class="app-nav">
                <router-link to="/scores" class="app-nav-tab" :class="{active: activeTab === 'scores'}">SCORES</router-link>
                <router-link to="/news" class="app-nav-tab" :class="{active: activeTab === 'news'}">NEWS</router-link>
                <router-link to="/standings" class="app-nav-tab" :class="{active: activeTab === 'standings'}">STANDINGS</router-link>
                <router-link to="/leaders/categories" class="app-nav-tab" :class="{active: activeTab === 'leaders'}">LEADERS</router-link>
                <!-- <router-link to="/fantasy">FANTASY</router-link> -->
            </nav>
        </header>
        <router-view></router-view>
    </div>
</template>
  
<script>
import Options from '@/components/Options.vue';
import Account from '@/components/Account.vue';
import Settings from '@/components/Settings.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'Layout',
  components: {
    Options,
    Account,
    Settings
  },
  setup() {
    const route = useRoute();

    const activeTab = computed(() => {
      const path = route.fullPath;

      if (path.includes('scores')) return 'scores';
      if (path.includes('news')) return 'news';
      if (path.includes('standings')) return 'standings';
      if (path.includes('leaders')) return 'leaders';

      return '';
    });

    return {
      activeTab,
    };
  },
};
</script>

<style>
.layout-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.layout-header {
  width: 100%;
  display: flex;
  flex-direction: column; /* Adjusted flex direction to column */
  align-items: flex-start; /* Adjusted alignment to start */
  margin-bottom: 20px;
}

.layout-header-nav {
  display: flex;
  justify-content: space-between;
  width: 100%
}

.layout-title {
  font-size: 1.5rem; /* Adjust as needed */
  margin-right: 10px; /* Add spacing between title and nav */
}

.app-nav {
  width: 100%;
  display: flex;
  justify-content: space-around;
  border-bottom: solid;
  border-radius: 20px;
  color: var(--link-color);
}

.app-nav-tab {
  width: 15%;
  display: flex;
  justify-content: center;
}

.app-nav a.active {
  background-color: var(--hover-dark-color);
  color: white;
  border-radius: 10px;
  font-weight: bold;
}

.app-header {
  font-size: x-large;
}

.nav-link {
  margin-right: 10px; /* Adjust as needed */
  color: rgb(4, 246, 0); /* Set your desired color */
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline; /* Add an underline on hover if desired */
}

.settings-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 44px;
  margin-right: -15px;
  width: 50%;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
  .app-nav-tab {
    width: 27%;
  }
  .layout-container {
    max-width: none;
    margin: 0px;
    padding: 0px;
  }
  .layout-header {
    margin-bottom: 5px;
  }
  .layout-header-nav {
    align-items: flex-end;
  }
}
</style>