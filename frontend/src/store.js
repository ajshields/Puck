import { createStore } from 'vuex';

export default createStore({
  state: {
    accessToken: null,
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
  actions: {
    async exchangeCodeForToken({ commit }, payload) {
      console.log('trying it here');
      console.log('Payload for token exchange:', payload);
      try {
        const response = await fetch('/yahoo/oauth2/get_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(payload),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error: ${errorData.error_description}`);
        }
        const data = await response.json();
        console.log('Token response:', data);
        return data;
      } catch (error) {
        console.error('Error exchanging code for token:', error);
        throw error;
      }
    },
  },
});