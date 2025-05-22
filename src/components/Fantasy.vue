<template>
    <Layout>
      <!-- Content specific to the respective page -->
      <h2>{{ pageTitle }} Page Content</h2>
    </Layout>
    <div><ProgressSpinner v-if="isAuthenticating && !isLoading" /></div>

    <div class=auth-section>
      <!-- <button v-if="!isAuthenticating && !isAuthenticated" class="auth-button" @click="authenticate">yahoo!fantasy</button> -->
      <img v-if="!isAuthenticating && !isAuthenticated" class="sign-in" src="@/assets/yahoo_fantasy.png" alt="SignIn" @click="authenticate"/>
      <button v-if="isAuthenticated" class="sign-out" @click="signOut">Sign Out</button>
      <button v-if="isAuthenticated" @click="fetchLeagues">Test fetch leagues api call</button>
    </div>
  
    <!-- Display error if any -->
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
</template>
    
<script>
    import ProgressSpinner from './ProgressSpinner.vue';
    import Layout from '@/components/Layout.vue';
    import { generatePKCECodes } from '../pkce';
    import { mapActions } from 'vuex';

    export default {
        name: 'Fantasy',
        components: {
          ProgressSpinner,
          Layout,
        },
        data() {
          return {
            isLoading: false,
            pageTitle: 'Fantasy',
            isAuthenticating: false,
            error: null,
          };
        },
        async created() {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          const state = urlParams.get('state');
          const storedState = localStorage.getItem('oauth_state');

          // console.log('URL Params:', { code, state });
          // console.log('Stored State:', storedState);

          if (code && state && state === storedState) {
            this.isAuthenticating = true;
            const codeVerifier = localStorage.getItem('code_verifier');
            if (codeVerifier) {
              await this.exchangeCodeForToken(code, codeVerifier);
              localStorage.removeItem('code_verifier');  // Clean up
              localStorage.removeItem('oauth_state');    // Clean up
            }
          } else if (state && state !== storedState) {
            // console.error('State mismatch. Possible CSRF attack.');
            localStorage.removeItem('code_verifier');
            localStorage.removeItem('oauth_state');
          }
        },
        computed: {
          isAuthenticated() {
            return !!localStorage.getItem('yahooAccessToken');
          }
        },
        methods: {
            ...mapActions(['exchangeCodeForToken']),
            async authenticate() {
              const clientId = 'dj0yJmk9OTNYYWcwTU9yaFhUJmQ9WVdrOVVtTktPRmRyU0hrbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTY3';
              const redirectUri = 'https://ef10-142-115-59-165.ngrok-free.app/fantasy';
              const { codeVerifier, codeChallenge } = await generatePKCECodes();
              const state = this.generateState();
            
              localStorage.setItem('code_verifier', codeVerifier);
              localStorage.setItem('oauth_state', state);
            
              const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=fspt-w&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;
            
              // console.log('Redirecting to:', authUrl);
              window.location.href = authUrl;
            },
            async exchangeCodeForToken(code, codeVerifier) {
              const payload = {
                client_id: 'dj0yJmk9OTNYYWcwTU9yaFhUJmQ9WVdrOVVtTktPRmRyU0hrbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTY3',
                //client_secret: 'RcJ8WkHy',
                redirect_uri: 'https://ef10-142-115-59-165.ngrok-free.app/fantasy',
                code,
                code_verifier: codeVerifier,
                grant_type: 'authorization_code',
              };
              // console.log('Exchanging code for token with payload:', payload);
            
              try {
                const tokenResponse = await this.$store.dispatch('exchangeCodeForToken', payload);
                // console.log('Token Response:', tokenResponse);
                          
                if (tokenResponse.access_token) {
                  localStorage.setItem('yahooAccessToken', tokenResponse.access_token);
                  this.isAuthenticating = false;
                  this.$router.push('/');
                  //this.fetchLeagues();
                } else {
                  throw new Error('No access token in response');
                }
              } catch (error) {
                // console.error('Error during token exchange:', error);
                this.error = 'An error occurred while exchanging the code for a token. Please try again.';
                this.isAuthenticating = false;
              }
            },
            signOut() {
              // Clear the access token and any other related data
              localStorage.removeItem('yahooAccessToken');
              // Optionally clear other related data
              localStorage.removeItem('code_verifier');
              localStorage.removeItem('oauth_state');
              window.location.reload();
            },
            generateState() {
              return Array.from(window.crypto.getRandomValues(new Uint8Array(16)), dec => ('0' + dec.toString(16)).substr(-2)).join('');
            },
            async fetchLeagues() {
              this.isLoading = true;
              try {
                const response = await fetch(`https://fantasysports.yahooapis.com/fantasy/v2/league/league_ids?year=2024`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('yahooAccessToken')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  mode: 'cors',
                });
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
              
                const data = await response.json();
                console.log(data);
                this.isLoading = false;
              } catch (error) {
                console.error('Error fetching fantasy leagues:', error);
                alert('Error fetching user fantasy leagues. See console for details.');
              }
            },
        },
    };
</script>
    
<style>
.auth-section {
  display: flex;
  justify-content: center;
}
.sign-in {
  width: 15%;
  cursor: pointer;
}
.sign-out {
  color: white;
  transition: 0.4s;
  padding: 3px;
  cursor: pointer;
  background: linear-gradient(15deg, #6001d2, transparent);
  border: none;
  border-radius: 10px;
}
</style>