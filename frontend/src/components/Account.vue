<template>
    <div class="account-settings-options">
        <Button class="account-button" icon="pi pi-user" aria-label="User" @click="openAccountModel()"/>
    </div>

    <div class="login-modal" v-if="showLogIn" @click="showLogIn=false">
        <div class="login-modal-content" @click.stop>
            <span class="login-close" @click="showLogIn=false">&times;</span>
        </div>
    </div>

    <div class="account-modal" v-if="showAccountSettings" @click="showAccountSettings=false">
        <div class="account-modal-content" @click.stop>
            <span class="account-close" @click="showAccountSettings=false">&times;</span>
        </div>
    </div>
</template>

<script>
import PanelMenu from 'primevue/panelmenu';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import 'primevue/resources/primevue.min.css'; // PrimeVue CSS
import 'primeicons/primeicons.css'; // PrimeIcons CSS
import '@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';

export default {
  name: 'Account',
  components: {
      PanelMenu,
      Menubar,
      Button
  },
  data() {
    return {
        isLoggedIn: false,
        showLogIn: false,
        showAccountSettings: false
    };
  },
  methods: {
    openAccountModel() {
        if(this.isLoggedIn)
            this.showAccountSettings = true;
        else
            this.showLogIn = true;
    }
  }
};
</script>

<style>
.account-button {
    color: var(--main-color);
    background: none;
    border: none;
    height: 20px;
    font-size: 15px;
    margin-top: 3px;
    cursor: pointer;
}

.account-button:hover {
    background-color: var(--hover-dark-color);
    border-radius: 8px;
    transition: background-color 0.8s ease;
}

.account-settings-options {
  width: 3%;
}

.login-modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0px;
  width: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.login-modal-content {
  margin: 15% auto;
  padding: 20px;
}

.login-close {
    color: white;
    font-size: x-large;
    cursor: pointer;
}

.account-modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0px;
  width: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.account-modal-content {
  margin: 15% auto;
  padding: 20px;
}

.account-close {
    color: white;
    font-size: x-large;
    cursor: pointer;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
.account-button:hover {
    background-color: var(--color-background);
    border-radius: 0px;
}
  .account-settings-options {
    margin-left: 0%;
    margin-right: 3%;
  }
}
</style>