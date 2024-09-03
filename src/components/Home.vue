<template>
  <Layout></Layout>
  <Scores></Scores>
</template>

<script>
import Layout from '@/components/Layout.vue';
import Scores from '@/components/Scores.vue';

export default {
  name: 'Home',
  components: {
    Layout,
    Scores,
  },
};
</script>

<style>
/* Add your styles here */
</style>