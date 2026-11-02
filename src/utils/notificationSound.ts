/**
 * Plays a pleasant, two-tone notification chime using the browser Web Audio API.
 * Guaranteed to work offline and without any external audio asset dependencies.
 */
export function playNotificationSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First chime tone (high frequency, clear bell)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Second chime tone (harmonic resolution)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.12);
    gain2.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (err) {
    // Non-blocking fallback
    console.debug('Web Audio notification chime not supported or muted:', err);
  }
}

/**
 * Triggers a browser native Web Notification if permission is granted.
 */
export function dispatchBrowserNotification(title: string, body: string, icon = '/assets/aistudio/kss_best_logo_9d217f0f.png'): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon,
        badge: icon,
        tag: 'kellem-announcement',
        silent: false
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      playNotificationSound();
      return true;
    } catch (e) {
      console.warn('Native notification dispatch fallback:', e);
      playNotificationSound();
      return false;
    }
  }
  return false;
}
