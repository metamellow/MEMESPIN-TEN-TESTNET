class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles = {
      win: '/win.mp3',
      lose: '/lose.mp3',
      click: '/click.mp3',
      spin: '/waiting.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  play(soundName: 'win' | 'lose' | 'click' | 'spin') {
    if (this.isMuted) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      // Reset the audio to the beginning
      sound.currentTime = 0;
      
      // Play the sound
      sound.play().catch(error => {
        console.warn('Failed to play sound:', error);
      });
    }
  }

  mute() {
    this.isMuted = true;
  }

  unmute() {
    this.isMuted = false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  isSoundMuted() {
    return this.isMuted;
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();
