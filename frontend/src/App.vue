<template>
  <router-view/>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createGesture } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

export default {
  name: 'App',

  setup() {
    const router = useRouter();
    const route = useRoute();

    const auth = useAuthStore();
    const prefs = usePreferencesStore();
    const appReady = ref(false);
    let gesture = null;

    onMounted(async () => {
      //load preferences
      await prefs.init();
      //apply theme globally
      prefs.applyTheme?.();
      // allow on real mobile OR dev mobile viewport
      const isNative = Capacitor.isNativePlatform();
      const isMobileBrowser = window.innerWidth <= 768;

      if (!isNative && !isMobileBrowser) return;

      gesture = createGesture({
        el: document.body,
        gestureName: 'swipe-back',
        direction: 'x',
        gesturePriority: 100,
        threshold: 10,

        // ONLY allow true left-edge swipe
        canStart: (ev) => {
          if (route.meta?.disableSwipeBack) return false;
          return ev.startX <= 25;
        },

        onEnd: (ev) => {
          const isHorizontal =
            Math.abs(ev.deltaX) > Math.abs(ev.deltaY);

          const swipedFarEnough = ev.deltaX > 120;

          if (isHorizontal && swipedFarEnough) {
            if (window.history.length > 1) {
              router.back();
            }
          }
        }
      });

      gesture.enable();
    });

    onBeforeUnmount(() => {
      if (gesture) {
        gesture.destroy?.();
        gesture = null;
      }
    });

    return {appReady};
  }
};
</script>

<style>
</style>