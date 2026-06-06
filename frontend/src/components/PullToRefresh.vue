<template>
    <div class="ptr-wrapper">

        <!-- Indicator (static, controlled visibility) -->
        <div
            class="ptr-indicator"
            :style="{
                opacity: indicatorOpacity,
                transform: `translate(-50%, ${indicatorY}px)`
            }"
        >
            <div class="spinner"></div>
            <div class="ptr-text">
                {{ pullDistance > threshold ? 'Release to refresh' : 'Pull to refresh' }}
            </div>
        </div>
    
        <slot />
    </div>
</template>

<script>
export default {
    name: 'PullToRefresh',
    emits: ['refresh'],

    props: {
        scrollSelector: {
        type: String,
        required: true
        }
    },

    data() {
        return {
            startY: 0,
            pulling: false,
            pullDistance: 0,
            el: null,
            isRefreshing: false,
            triggeredHaptic: false,

            threshold: 70,
            maxPull: 140
        };
    },

    computed: {
        indicatorOpacity() {
            return Math.min(this.pullDistance / this.threshold, 1);
        },

        indicatorY() {
        // keeps it JUST above the scroll container
        return 30;
    }
    },

    methods: {
        getScrollEl() {
            return document.querySelector(this.scrollSelector);
        },

        // iOS-style elastic curve
        applyResistance(diff) {
            const resistance = 0.52;
            return this.maxPull * (1 - Math.exp(-diff * resistance / this.maxPull));
        },

        setTransform(y) {
            if (!this.el) return;

            this.el.style.transform = `translateY(${y}px)`;
            this.el.style.transition = 'none';
        },

        resetTransform() {
            if (!this.el) return;

            this.el.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
            this.el.style.transform = 'translateY(0px)';
        },

        onTouchStart(e) {
            const el = this.getScrollEl();
            if (!el) return;

            // only trigger if touch starts inside scroll area
            if (!el.contains(e.target)) return;

            // must be at top
            if (el.scrollTop > 0) return;

            this.el = el;
            this.startY = e.touches[0].clientY;
            this.pulling = true;
            this.pullDistance = 0;
            this.triggeredHaptic = false;
        },

        onTouchMove(e) {
            if (!this.pulling || !this.el || this.isRefreshing) return;

            const y = e.touches[0].clientY;
            let diff = y - this.startY;

            // only downward pull at top
            if (diff > 0 && this.el.scrollTop === 0) {
                const eased = this.applyResistance(diff);
                this.pullDistance = Math.min(eased, this.maxPull);

                this.setTransform(this.pullDistance);

                // haptic feedback at threshold
                if (this.pullDistance > this.threshold && !this.triggeredHaptic) {
                    this.triggeredHaptic = true;

                    if (navigator.vibrate) {
                        navigator.vibrate(12);
                    }
                }

                e.preventDefault();
            }
        },

        async onTouchEnd() {
            if (!this.pulling || !this.el) return;

            this.pulling = false;

            if (this.pullDistance > this.threshold) {
                this.isRefreshing = true;

                // lock slightly pulled state before refresh
                this.el.style.transition = 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)';
                this.el.style.transform = 'translateY(50px)';

                await this.$emit('refresh');

                this.isRefreshing = false;
            }

            this.resetTransform();
            this.pullDistance = 0;
        }
    },

    mounted() {
        document.addEventListener('touchstart', this.onTouchStart, {
            passive: false
        });
        document.addEventListener('touchmove', this.onTouchMove, {
        passive: false
        });
        document.addEventListener('touchend', this.onTouchEnd);
    },

    beforeUnmount() {
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
    }
};
</script>

<style scoped>
.ptr-wrapper {
  position: relative;
}

/* pinned to container top */
.ptr-wrapper {
  position: relative;
}

/* anchored just above scroll area */
.ptr-indicator {
  position: absolute;
  left: 50%;
  top: 0;

  transform: translate(-50%, -20px); /* 👈 key fix */

  display: flex;
  flex-direction: column;
  align-items: center;

  pointer-events: none;

  opacity: 0; /* hidden by default */
  transition: opacity 0.15s ease;
}

/* spinner */
.spinner {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top: 2px solid var(--main-color);
  animation: spin 0.8s linear infinite;
}

.ptr-text {
  font-size: 11px;
  margin-top: 6px;
  color: white;
  opacity: 0.85;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>