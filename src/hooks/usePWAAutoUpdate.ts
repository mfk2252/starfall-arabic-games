import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Robust PWA background update hook with smart safety controls:
 * - Checks for service worker updates periodically (every 10 minutes) and upon app focus / online status.
 * - Defays reloading if the user is currently actively playing a game (inside /games/:gameId) to protect progress.
 * - Safely reloads using window.location.reload() only when safe and a new worker is waiting.
 */
export function usePWAAutoUpdate() {
  const location = useLocation();
  const isPlayingGameRef = useRef(false);
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);

  // Keep track whether user is currently in a game route
  useEffect(() => {
    isPlayingGameRef.current = location.pathname.startsWith('/games/') && location.pathname !== '/games';
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let refreshing = false;

    // Listen for controller change to reload page once the new SW takes over
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) return;

        // Check if there is already a waiting worker
        if (registration.waiting) {
          waitingWorkerRef.current = registration.waiting;
          tryApplyUpdate();
        }

        // Trigger check on server for new version
        await registration.update();

        if (registration.waiting) {
          waitingWorkerRef.current = registration.waiting;
          tryApplyUpdate();
        }
      } catch {
        // Network offline or failed check, ignore gracefully
      }
    };

    const tryApplyUpdate = () => {
      const worker = waitingWorkerRef.current;
      if (!worker) return;

      // If user is currently playing a game, wait until they exit to avoid disrupting progress
      if (isPlayingGameRef.current) {
        return;
      }

      // Safe to apply update
      worker.postMessage({ type: 'SKIP_WAITING' });
    };

    // Periodically check for updates every 10 minutes
    const intervalId = setInterval(checkForUpdates, 10 * 60 * 1000);

    // Check when app comes back to foreground (visibility change)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    // Check when network comes back online
    const handleOnline = () => {
      checkForUpdates();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    // Initial check after mount (delayed by 5s to prioritize initial render performance)
    const initialTimer = setTimeout(checkForUpdates, 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(initialTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Whenever location changes (e.g. user exits game back to games list), check if an update was pending
  useEffect(() => {
    if (!location.pathname.startsWith('/games/') || location.pathname === '/games') {
      if (waitingWorkerRef.current) {
        waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' });
      }
    }
  }, [location.pathname]);
}
