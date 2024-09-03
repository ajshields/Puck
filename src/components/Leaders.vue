<template>
  <Layout>
    <!-- Content specific to the respective page -->
    <h2>{{ pageTitle }} Page Content</h2>
  </Layout>

  <nav class="leaders-nav">
    <router-link :to="'/leaders/categories'">LEADERS</router-link>
    <router-link :to="'/leaders/statistics'">STATISTICS</router-link>
  </nav>

  <router-view name="leaders-content"></router-view>
</template>
  
<script>
import Layout from '@/components/Layout.vue';

export default {
  name: 'Leaders',
  components: {
    Layout,
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
</style>