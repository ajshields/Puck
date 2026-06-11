<template>
    <div class="options-menu">
        <Button icon="pi pi-bars" class="options-button" @click="toggleMenu" aria-haspopup="true" aria-controls="overlay_menu"/>
        <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true"
    />
    </div>
</template>

<script>
import PanelMenu from 'primevue/panelmenu';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { reactive } from 'vue';

export default {
  name: 'Options',
  components: {
      PanelMenu,
      Menu,
      Button,
  },
  data() {
    return {
      menu: null,
      menuItems: [
          {
              label: '',
              icon: 'pi pi-fw pi-bars',
              items: [
                  {
                    label: ' SCORES',
                    //icon: 'pi pi-fw pi-desktop',
                    command: () => this.navigateTo('/scores')
                  },
                  {
                    label: ' NEWS',
                    //icon: 'pi pi-fw pi-book',
                    command: () => this.navigateTo('/news')
                  },
                  {
                    label: ' STANDINGS',
                    //icon: 'pi pi-fw pi-list',
                    command: () => this.navigateTo('/standings')
                  },
                  {
                    label: ' LEADERS',
                    //icon: 'pi pi-fw pi-users',
                    command: () => this.navigateTo('/leaders/categories')
                  },
                  /*{
                    label: ' FANTASY',
                    icon: 'pi pi-fw pi-list',
                    command: () => this.navigateTo('/fantasy')
                  },*/
                  /*{
                    label: ' THEMES',
                    //icon: 'pi pi-fw pi-palette',
                    items: [
                      {label: 'DEFAULT', command: () => this.changeColourScheme('default')},
                      {label: 'SELECT', command: () => (this.showColorPicker=true)},
                    ]
                  },*/
              ],
          },
      ]
    };
  },
  methods: {
    toggleMenu(event) {
      this.$refs.menu.toggle(event);
    },
    navigateTo(route) {
      this.$router.push(route);
    },
  }
};
</script>

<style>
.p-menu .p-submenu-header {
  display: none !important;
}

.p-menu .p-menuitem {
  padding: 5px;
}

.p-menu .p-menuitem-text {
  color: var(--link-color);
}

.options-button {
  background: transparent;
  border: none;
  color: var(--link-color);
  width: 34px;
}

.theme-picker {
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 1;
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

/* Mobile Device Styling */
@media (max-width: 640px) {
}
</style>