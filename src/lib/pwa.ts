// PWA utilities — service worker registration + notification permission

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    console.log("SW registered:", reg.scope);
    return reg;
  } catch (e) {
    console.error("SW registration failed:", e);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleDailyReminder() {
  if (!("serviceWorker" in navigator)) return;
  // Store reminder preference
  localStorage.setItem("gbr_reminder_enabled", "true");
  // Show a test notification
  if (Notification.permission === "granted") {
    new Notification("Get Board Ready 🏛️", {
      body: "Daily reminders enabled! We'll nudge you every day at 8 PM.",
      icon: "/favicon.svg"
    });
  }
}

export function showInstallPrompt(deferredPrompt: any) {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  return deferredPrompt.userChoice;
}
