import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import { createRouter, createWebHistory } from 'vue-router';
import store from './store';
import Home from './components/Home.vue';
import Scores from './components/Scores.vue';
import Standings from './components/Standings.vue';
import Leaders from './components/Leaders.vue';
import Fantasy from './components/Fantasy.vue';
import Game from './components/Game.vue';
import Team from './components/Team.vue';
import Roster from './components/Roster.vue';
import Lineup from './components/Lineup.vue';
import SalaryCap from './components/SalaryCap.vue';
import Schedule from './components/Schedule.vue';
import Categories from './components/Categories.vue';
import Statistics from './components/Statistics.vue';
import Player from './components/Player.vue';
import Season from './components/Season.vue';
import Career from './components/Career.vue';
import Info from './components/Info.vue';

const routes = [
  { path: '/', component: Home, meta: {disableSwipeBack: true} },
  { path: '/scores:date?', name: 'scores', component: Scores, meta: {disableSwipeBack: true} },
  { path: '/standings', component: Standings, meta: {disableSwipeBack: true} },
  { path: '/leaders', component: Leaders, meta: {disableSwipeBack: true}, children: [
    {
      path: 'categories',
      name: 'leaders.categories',
      components: {'leaders-content': Categories},
    },
    {
      path: 'statistics',
      name: 'leaders.statistics',
      components: {'leaders-content': Statistics},
    },
  ]},
  { path: '/fantasy', component: Fantasy },
  { path: '/game/:id', name: 'game', component: Game, props: true },
  { path: '/team/:id', component: Team, props: true, children: [
    {
      path: 'schedule',
      name: 'team.schedule',
      components: {'team-content': Schedule},
      props: true
    },
    {
      path: 'roster',
      name: 'team.roster',
      components: {'team-content': Roster},
      props: true
    },
    {
      path: 'lineup',
      name: 'team.lineup',
      components: {'team-content': Lineup},
      props: true
    },
    {
      path: 'salarycap',
      name: 'team.salarycap',
      components: {'team-content': SalaryCap},
      props: true
    },
  ]},
  { path: '/player/:id', component: Player, props: true, children: [
    {
      path: 'season',
      name: 'player.season',
      components: {'player-content': Season},
      props: true
    },
    {
      path: 'career',
      name: 'player.career',
      components: {'player-content': Career},
      props: true
    },
    {
      path: 'info',
      name: 'player.info',
      components: {'player-content': Info},
      props: true
    },
  ]},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.use(store);

app.mount('#app');