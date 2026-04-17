<template>
  <Layout>
    <!-- Content specific to the respective page -->
    <h2>{{ pageTitle }} Page Content</h2>
  </Layout>

  <nav class="leaders-nav">
    <router-link :to="'/leaders/categories'" :class="{active: activeTab === 'categories'}">LEADERS</router-link>
    <router-link :to="'/leaders/statistics'" :class="{active: activeTab === 'statistics'}">STATISTICS</router-link>
  </nav>

  <router-view name="leaders-content"></router-view>
</template>
  
<script>
import Layout from '@/components/Layout.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'Leaders',
  components: {
    Layout,
  },
  setup() {
    const route = useRoute();

    const activeTab = computed(() => {
      const path = route.fullPath;

      if (path.includes('categories')) return 'categories';
      if (path.includes('statistics')) return 'statistics';

      return '';
    });

    return {
      activeTab,
    };
  },
  data() {
    return {
      isLoading: true,
      error: null,
    };
  },
  methods: {
    
  },
};
</script>
  
<style>
.leaders-nav {
  width: 100%;
  display: flex;
  justify-content: space-around;
  color: var(--link-color);
}

.leaders-nav a.active {
  background-color: var(--hover-dark-color);
  color: white;
  border-radius: 10px;
  font-weight: bold;
}
</style>