/**
 * Active Speaker Detection Service
 * Uses Web Audio API to detect who is speaking in real-time
 * Dispatches 'active_speaker_changed' custom events
 */

class ActiveSpeakerDetector {
  constructor() {
    this.audioContext = null;
    this.analysers = new Map();      // Map<email, AnalyserNode>
    this.sources = new Map();        // Map<email, MediaStreamAudioSourceNode>
    this.animationFrame = null;
    this.currentSpeaker = null;
    this.silenceTimers = new Map();  // Map<email, timeoutId>
    this.onSpeakerChange = null;     // callback(email | null)

    // Thresholds
    this.SPEAKING_THRESHOLD = 20;    // RMS level to consider "speaking"
    this.SILENCE_DELAY_MS = 1500;    // ms of silence before clearing speaker
    this.POLL_INTERVAL_MS = 100;     // how often to check audio levels
  }

  /**
   * Initialize the AudioContext (must be called after user gesture)
   */
  init() {
    if (this.audioContext) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🎙 ActiveSpeakerDetector initialized');
    } catch (e) {
      console.warn('⚠️ Web Audio API not available:', e);
    }
  }

  /**
   * Add a stream to monitor for a participant
   * @param {string} email - participant email
   * @param {MediaStream} stream - their audio stream
   */
  addStream(email, stream) {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;
    if (this.analysers.has(email)) this.removeStream(email);

    try {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const source = this.audioContext.createMediaStreamSource(stream);
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      this.sources.set(email, source);
      this.analysers.set(email, analyser);

      console.log(`🎙 Monitoring audio for: ${email}`);

      // Start polling if not already running
      if (!this.animationFrame) {
        this._startPolling();
      }
    } catch (e) {
      console.warn(`⚠️ Failed to add audio stream for ${email}:`, e);
    }
  }

  /**
   * Remove a participant's stream from monitoring
   */
  removeStream(email) {
    const source = this.sources.get(email);
    if (source) {
      try { source.disconnect(); } catch (e) {}
      this.sources.delete(email);
    }
    this.analysers.delete(email);

    const timer = this.silenceTimers.get(email);
    if (timer) {
      clearTimeout(timer);
      this.silenceTimers.delete(email);
    }

    if (this.currentSpeaker === email) {
      this._setSpeaker(null);
    }
  }

  /**
   * Remove all streams and stop monitoring
   */
  removeAll() {
    this.sources.forEach((source) => {
      try { source.disconnect(); } catch (e) {}
    });
    this.sources.clear();
    this.analysers.clear();
    this.silenceTimers.forEach(clearTimeout);
    this.silenceTimers.clear();

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    this.currentSpeaker = null;
  }

  /**
   * Get current RMS level for a participant (0-100)
   */
  getLevel(email) {
    const analyser = this.analysers.get(email);
    if (!analyser) return 0;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    // Calculate RMS
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    return Math.sqrt(sum / data.length);
  }

  /**
   * Get audio levels for all monitored participants
   * Returns Map<email, level>
   */
  getAllLevels() {
    const levels = new Map();
    this.analysers.forEach((_, email) => {
      levels.set(email, this.getLevel(email));
    });
    return levels;
  }

  /**
   * Start the polling loop
   */
  _startPolling() {
    const poll = () => {
      this._detectSpeaker();
      this.animationFrame = setTimeout(poll, this.POLL_INTERVAL_MS);
    };
    this.animationFrame = setTimeout(poll, this.POLL_INTERVAL_MS);
  }

  /**
   * Detect who is speaking and update current speaker
   */
  _detectSpeaker() {
    if (this.analysers.size === 0) return;

    let maxLevel = 0;
    let loudestEmail = null;

    this.analysers.forEach((_, email) => {
      const level = this.getLevel(email);
      if (level > maxLevel) {
        maxLevel = level;
        loudestEmail = email;
      }
    });

    if (maxLevel > this.SPEAKING_THRESHOLD && loudestEmail) {
      // Someone is speaking
      if (this.currentSpeaker !== loudestEmail) {
        // Clear silence timer for new speaker
        const timer = this.silenceTimers.get(loudestEmail);
        if (timer) {
          clearTimeout(timer);
          this.silenceTimers.delete(loudestEmail);
        }
        this._setSpeaker(loudestEmail);
      }

      // Reset silence timer for current speaker
      const existing = this.silenceTimers.get(loudestEmail);
      if (existing) clearTimeout(existing);

      const silenceTimer = setTimeout(() => {
        if (this.currentSpeaker === loudestEmail) {
          this._setSpeaker(null);
        }
        this.silenceTimers.delete(loudestEmail);
      }, this.SILENCE_DELAY_MS);

      this.silenceTimers.set(loudestEmail, silenceTimer);
    }
  }

  /**
   * Update current speaker and fire callback/event
   */
  _setSpeaker(email) {
    if (this.currentSpeaker === email) return;
    this.currentSpeaker = email;

    if (this.onSpeakerChange) {
      this.onSpeakerChange(email);
    }

    window.dispatchEvent(new CustomEvent('active_speaker_changed', {
      detail: { email }
    }));
  }

  /**
   * Destroy and clean up
   */
  destroy() {
    this.removeAll();
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }
}

// Export singleton
export default new ActiveSpeakerDetector();
