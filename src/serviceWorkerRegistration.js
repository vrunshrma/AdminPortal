// serviceWorkerRegistration.js

export function register() {
  if ('serviceWorker' in navigator) {
    if (process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register(`${process.env.PUBLIC_URL}/custom-sw.js`) // ✅ yahan custom-sw.js use ho raha hai
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration);

            // Optional: listen for updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      console.log('🔄 New content is available; please refresh.');
                    } else {
                      console.log('🎉 Content cached for offline use.');
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
          });
      });
    }
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('❌ Service Worker unregister failed:', error);
      });
  }
}
