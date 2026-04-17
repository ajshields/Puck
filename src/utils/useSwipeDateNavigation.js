export function attachSwipeDateNavigation(el, options) {
    const { onSwipeLeft, onSwipeRight, threshold = 50 } = options;

    let startX = 0;
    let startY = 0;
    let isTracking = false;

    const onTouchStart = (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isTracking = true;
    };

    const onTouchMove = (e) => {
        if (!isTracking) return;
        // optional: could cancel vertical scroll detection here
    };

    const onTouchEnd = (e) => {
        if (!isTracking) return;
        isTracking = false;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        // ignore mostly-vertical gestures (important so it doesn't fight scroll)
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;

        if (Math.abs(deltaX) < threshold) return;

        if (deltaX > 0) {
            onSwipeRight?.();
        } else {
            onSwipeLeft?.();
        }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    // cleanup function (important for Vue)
    return () => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
    };
}