<template>
  <router-view />
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue';
import { createGesture } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { useRoute } from 'vue-router';

export default {
  name: 'App',

  setup() {
    const router = useRouter();
    const route = useRoute();
    let gesture = null;

    onMounted(() => {
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

    return {};
  }
};
</script>

<style>
</style>