<template>
    <div class="settings-options">
        <Menubar :model="settingsItems" class="settings" />
    </div>
    <div v-if="showColorPicker" class="theme-picker">
        <!-- <ColorPicker v-model="selectedColour"/> -->
        <span class="color-close" @click="showColorPicker=false">&times;</span>
        <color-picker v-bind="color" @input="onInput" style="width:200px;height:200px"></color-picker>
    </div>
</template>

<script>
import PanelMenu from 'primevue/panelmenu';
import Menubar from 'primevue/menubar';
import 'primevue/resources/primevue.min.css'; // PrimeVue CSS
import 'primeicons/primeicons.css'; // PrimeIcons CSS
import { reactive } from 'vue';
import ColorPicker from '@radial-color-picker/vue-color-picker';
import '@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';

export default {
  name: 'Settings',
  components: {
      PanelMenu,
      Menubar,
      ColorPicker,
  },
  data() {
    return {
        color: { hue: 0, saturation: 100, luminosity: 50, alpha: 1 },
        showColorPicker: false,
        settingsItems: [
            {
                label: '',
                icon: 'pi pi-fw pi-bars',
                items: [
                    {
                      label: ' SCORES',
                      icon: 'pi pi-fw pi-desktop',
                      command: () => this.navigateTo('/scores')
                    },
                    {
                      label: ' NEWS',
                      icon: 'pi pi-fw pi-book',
                      command: () => this.navigateTo('/news')
                    },
                    {
                      label: ' STANDINGS',
                      icon: 'pi pi-fw pi-list',
                      command: () => this.navigateTo('/standings')
                    },
                    {
                      label: ' LEADERS',
                      icon: 'pi pi-fw pi-users',
                      command: () => this.navigateTo('/leaders/categories')
                    },
                    /*{
                      label: ' FANTASY',
                      icon: 'pi pi-fw pi-list',
                      command: () => this.navigateTo('/fantasy')
                    },*/
                    {
                      label: ' THEMES',
                      icon: 'pi pi-fw pi-palette',
                      items: [
                        {label: 'DEFAULT', command: () => this.changeColourScheme('default')},
                        /*{label: 'GREEN', command: () => this.changeColourScheme('green')},
                        {label: 'BLUE', command: () => this.changeColourScheme('blue')},*/
                        {label: 'SELECT', command: () => (this.showColorPicker=true)},
                      ]
                    },
                ],
            },
        ]
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    onInput(hue) {
      this.color.hue = hue;
      this.changeColourScheme(this.hslToHex(this.color.hue, this.color.saturation, this.color.luminosity));
    },
    changeColourScheme(theme) {
      // Update the value of the CSS custom property
      switch(theme) {
        case 'default':
            document.documentElement.style.setProperty('--link-color', '#00F2FF');
            document.documentElement.style.setProperty('--main-color', '#00F2FF');
            document.documentElement.style.setProperty('--hover-color', '#00F2FF94');
            document.documentElement.style.setProperty('--hover-dark-color', '#00F2FF3D');
            break;
        case 'green':
            document.documentElement.style.setProperty('--link-color', '#00bd7e');
            document.documentElement.style.setProperty('--main-color', '#01c58a');
            document.documentElement.style.setProperty('--hover-color', '#01c58a94');
            document.documentElement.style.setProperty('--hover-dark-color', '#43e96e3d');
            break;
        case 'blue':
            document.documentElement.style.setProperty('--link-color', '#0093d9');
            document.documentElement.style.setProperty('--main-color', '#00adff');
            document.documentElement.style.setProperty('--hover-color', '#00adff94');
            document.documentElement.style.setProperty('--hover-dark-color', '#0093d966');
            break;
        default:
            document.documentElement.style.setProperty('--link-color', theme);
            document.documentElement.style.setProperty('--main-color', theme);
            document.documentElement.style.setProperty('--hover-color', `${theme}94`);
            document.documentElement.style.setProperty('--hover-dark-color', `${theme}3d`);
            break;
      }
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
  }
};
</script>

<style>
.settings-options {
  width: 3%;
}

.settings-options .p-submenu-list {
    width: 10%;
    position: absolute;
    z-index: 1;
    margin-left: -8%;
  }

.settings-options .p-icon {
  display: none;
}

.settings {
  cursor: pointer;
}

.p-submenu-list {
  background-color: #333;
  border-radius: 10px;
  padding: 5px;
  width: 103%;
}

.p-menubar-button {
  display: none;
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
  .settings-options {
    margin-left: 0%;
    margin-right: 3%;
  }
  .settings-options .p-submenu-list {
    width: auto;
    margin-left: -29%;
    z-index: 1;
  }
}
</style>