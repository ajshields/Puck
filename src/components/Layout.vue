<template>
  <Settings></Settings>
    <div class="layout-container">
        <header class="layout-header">
            <router-link :to="'/scores'" class="app-header">PuckIt</router-link>
            <nav class="app-nav">
                <router-link to="/scores">SCORES</router-link>
                <router-link to="/standings">STANDINGS</router-link>
                <router-link to="/leaders/categories">LEADERS</router-link>
                <router-link to="/fantasy">FANTASY</router-link>
            </nav>
        </header>
        <router-view></router-view>
    </div>
</template>
  
<script>
import Settings from '@/components/Settings.vue';

export default {
  name: 'Layout',
  components: {
    Settings,
  },
};
</script>

<style>
.layout-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
 /* display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #333;
    color: #fff;*/
}

.layout-header {
  width: 100%;
  display: flex;
  flex-direction: column; /* Adjusted flex direction to column */
  align-items: flex-start; /* Adjusted alignment to start */
  margin-bottom: 20px;
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
</style>