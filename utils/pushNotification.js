export const registerPushNotifications = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          });
        }
      });
    });
  }
};

export const showLocalNotification = (title, body, swRegistration) => {
  swRegistration.showNotification(title, {
    body,
    icon: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200]
  });
};