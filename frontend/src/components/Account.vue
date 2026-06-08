<template>
    <div class="account-settings-options">
        <Button class="account-button" icon="pi pi-user" aria-label="User" @click="openAccountModel()"/>
    </div>

    <div class="account-modal" v-if="showLogIn" @click="showLogIn=false">
        <div class="account-modal-content" @click.stop>
            <span class="account-close" @click="showLogIn=false">&times;</span>
            <div class="account-login-modal-content">
              <h1 class="account-modal-header">Sign In</h1>
              <div class="account-login-fields">
                <IconField class="account-modal-inputtext">
                  <InputIcon class="pi pi-user" />
                  <InputText v-model="email" placeholder="Email" />
                </IconField>
                <IconField class="account-modal-inputtext">
                  <InputIcon class="pi pi-lock" />
                  <InputText v-model="password" placeholder="Password" />
                </IconField>
              </div>
              <Button class="account-login-button" label="Sign In" @click="logIn()"/>
              <div class="account-forgot-password-section"><span class="account-modal-redirect-link" @click="resetPassword()">Forgot Password?</span></div>
              <div class="account-create-account-section"><span>Don't have an account? <span class="account-modal-redirect-link" @click="signUp()">Create one here</span></span></div>
            </div>
        </div>
    </div>

    <div class="account-modal" v-if="showAccountSettings" @click="showAccountSettings=false">
        <div class="account-modal-content" @click.stop>
            <span class="account-close" @click="showAccountSettings=false">&times;</span>
            <h1 class="account-modal-header">LOGGED IN</h1>
            <Button class="account-logout-button" label="Sign Out" @click="logOut()"/>
        </div>
    </div>
</template>

<script>
import PanelMenu from 'primevue/panelmenu';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import 'primevue/resources/primevue.min.css'; // PrimeVue CSS
import 'primeicons/primeicons.css'; // PrimeIcons CSS
import '@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'Account',
  components: {
      PanelMenu,
      Menubar,
      Button,
      InputText,
      IconField,
      InputIcon
  },
  data() {
    return {
        isLoggedIn: false,
        showLogIn: false,
        showAccountSettings: false,
        email: "",
        password: ""
    };
  },
  methods: {
    async logIn() {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      });
    
      const data = await response.json();
      if (response.ok) {
        const auth = useAuthStore();
        auth.login(data.token, data.user);
        this.showLogIn = false;
        this.showAccountSettings = true;
      } else {
        console.error(data.error || "Login failed");
      }
    },
    logOut() {
      const auth = useAuthStore();
      auth.logout();
      this.showAccountSettings = false;
    },
    openAccountModel() {
      const auth = useAuthStore();
      if(auth.isLoggedIn)
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

.account-modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: -375px;
  width: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.account-modal-content {
  margin: 30% auto;
  padding: 20px;
  width: 35%;
}

.account-close {
    color: white;
    font-size: x-large;
    cursor: pointer;
}

.account-login-fields {
  padding-bottom: 20px;
}

.account-login-button {
  height: 40px;
  font-size: large;
  color: white;
  background-color: var(--hover-color);
  border: none;
  border-radius: 10px;
}

.account-login-button:hover {
  cursor: pointer;
  background-color: var(--hover-dark-color);
  transition: background-color 0.4s ease;
}

.account-logout-button {
  height: 32px;
  font-size: large;
  color: white;
  background-color: var(--hover-color);
  border: none;
  border-radius: 10px;
}

.account-logout-button:hover {
  cursor: pointer;
  background-color: var(--hover-dark-color);
  transition: background-color 0.4s ease;
}

.account-login-modal-content {
  display: flex;
  flex-direction: column;
}

.account-modal-header {
  display: flex;
  justify-content: center;
}

.account-modal-inputtext {
  padding: 10px 10px 3px 5px;
  font-size: large;
  border-bottom: 1px solid #cccccc63;
}

.account-modal-content .p-inputtext {
  background: none;
  border: none;
  color: white;
  margin-left: 10px;
  font-size: 18px !important;
}

.account-forgot-password-section {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #cccccc63;
}

.account-create-account-section {
  padding-top: 15px;
}

.account-modal-redirect-link {
  color: var(--link-color);
  cursor: pointer;
}

/* Mobile Device Styling */
@media (max-width: 640px) {
  .account-button:hover {
      background-color: var(--color-background);
      border-radius: 0px;
  }
  .account-modal {
    top: -65px;
  }
  .account-modal-content {
    margin: 48% auto;
    width: 85%;
  }
  .account-settings-options {
    margin-left: 0%;
    margin-right: 3%;
  }
}
</style>