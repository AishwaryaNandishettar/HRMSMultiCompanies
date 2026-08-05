/**
 * LiveKit Service
 * Handles LiveKit room connections, token fetching, and participant management
 */

import { Room, RoomEvent, Track, ConnectionState, DataPacket_Kind } from 'livekit-client';
import axios from '../api/axios';


class LiveKitService {
  constructor() {
    this.room = null;
    this.localParticipant = null;
    this.remoteParticipants = new Map();
    this.callbacks = {};
  }

  /**
   * Fetch LiveKit access token from backend
   * @param {string} meetingId - The meeting/room ID
   * @param {string} displayName - Optional display name
   * @returns {Promise<{token: string, url: string}>}
   */
  async getToken(meetingId, displayName = '') {
    try {
      const response = await axios.get('/api/livekit/token', {
        params: { meetingId, displayName }
      });
      
      console.log('🎟️ LiveKit token received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get LiveKit token:', error);
      throw new Error('Failed to get LiveKit access token');
    }
  }

  /**
   * Connect to a LiveKit room
   * @param {string} meetingId - The meeting/room ID
   * @param {string} displayName - Optional display name
   * @param {Object} options - Connection options
   * @returns {Promise<Room>}
   */
  async connect(meetingId, displayName = '', options = {}) {
    try {
      // Get token from backend
      const { token, url } = await this.getToken(meetingId, displayName);

      // Create room instance
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: {
            width: 1280,
            height: 720,
            frameRate: 30,
          },
        },
        ...options,
      });

      // Setup event listeners
      this.setupRoomListeners();

      // Connect to room
      await this.room.connect(url, token);
      
      this.localParticipant = this.room.localParticipant;
      
      console.log('✅ Connected to LiveKit room:', meetingId);
      console.log('👤 Local participant:', this.localParticipant.identity);

      return this.room;
    } catch (error) {
      console.error('❌ Failed to connect to LiveKit room:', error);
      throw error;
    }
  }

  /**
   * Setup room event listeners
   */
  setupRoomListeners() {
    if (!this.room) return;
 this.room.removeAllListeners();
    // Participant connected
    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log('👤 Participant connected:', participant.identity);
      this.remoteParticipants.set(participant.identity, participant);
      this.callbacks.onParticipantConnected?.(participant);
    });

    // Participant disconnected
    this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log('👤 Participant disconnected:', participant.identity);
      this.remoteParticipants.delete(participant.identity);
      this.callbacks.onParticipantDisconnected?.(participant);
    });

    // Track subscribed (remote participant's track)
    this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      console.log('📺 Track subscribed:', track.kind, 'from', participant.identity);
      if (track.source === Track.Source.ScreenShare) {
  this.callbacks.onScreenShareStarted?.(participant);
}
      this.callbacks.onTrackSubscribed?.(track, publication, participant);
    });

    // Track unsubscribed
    this.room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      console.log('📤 Track unsubscribed:', track.kind, 'from', participant.identity);
      if (track.source === Track.Source.ScreenShare) {
  this.callbacks.onScreenShareStopped?.(participant);
}
      this.callbacks.onTrackUnsubscribed?.(track, publication, participant);
    });

    // Local track published
    this.room.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      console.log('📡 Local track published:', publication.kind);
      this.callbacks.onLocalTrackPublished?.(publication, participant);
    });

    // Active speakers changed
    this.room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
      console.log('🔊 Active speakers:', speakers.map(s => s.identity));
      this.callbacks.onActiveSpeakersChanged?.(speakers);
    });

    // Data received (for chat, hand raise, etc.)
    this.room.on(RoomEvent.DataReceived, (payload, participant, kind) => {
      try {
        const decoder = new TextDecoder();
        const data = JSON.parse(decoder.decode(payload));
        console.log('📨 Data received from', participant?.identity, ':', data);
        this.callbacks.onDataReceived?.(data, participant, kind);
      } catch (error) {
        console.error('❌ Failed to parse data:', error);
      }
    });

    // Connection quality changed
    this.room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      console.log('📶 Connection quality:', quality, 'for', participant?.identity);
      this.callbacks.onConnectionQualityChanged?.(quality, participant);
    });

    // Disconnected
    this.room.on(RoomEvent.Disconnected, (reason) => {
      console.log('🔌 Disconnected from room:', reason);
      this.callbacks.onDisconnected?.(reason);
    });

    // Reconnecting
    this.room.on(RoomEvent.Reconnecting, () => {
      console.log('🔄 Reconnecting to room...');
      this.callbacks.onReconnecting?.();
    });

    // Reconnected
    this.room.on(RoomEvent.Reconnected, () => {
      console.log('✅ Reconnected to room');
      this.callbacks.onReconnected?.();
    });
  }

  /**
   * Set callbacks for room events
   * @param {Object} callbacks - Event callbacks
   */
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Enable/disable local microphone
   * @param {boolean} enabled
   */
  async setMicrophoneEnabled(enabled) {
    if (!this.localParticipant) return;
    await this.localParticipant.setMicrophoneEnabled(enabled);
    console.log(`🎤 Microphone ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Enable/disable local camera
   * @param {boolean} enabled
   */
  async setCameraEnabled(enabled) {
    if (!this.localParticipant) return;
    await this.localParticipant.setCameraEnabled(enabled);
    console.log(`📹 Camera ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Start screen sharing
   * @returns {Promise<void>}
   */
  async startScreenShare() {
    if (!this.localParticipant) return;
    
    try {
      await this.localParticipant.setScreenShareEnabled(true);
      console.log('🖥️ Screen sharing started');
    } catch (error) {
      console.error('❌ Failed to start screen sharing:', error);
      throw error;
    }
  }

  /**
   * Stop screen sharing
   * @returns {Promise<void>}
   */
  async stopScreenShare() {
    if (!this.localParticipant) return;
    
    try {
      await this.localParticipant.setScreenShareEnabled(false);
      console.log('🖥️ Screen sharing stopped');
    } catch (error) {
      console.error('❌ Failed to stop screen sharing:', error);
      throw error;
    }
  }

  /**
   * Send data to all participants (for chat, hand raise, etc.)
   * @param {Object} data - Data to send
   * @param {string} kind - Data kind (reliable or lossy)
   */
  async sendData(data, kind = 'reliable') {
    if (!this.localParticipant) return;
    
    try {
      const encoder = new TextEncoder();
      const payload = encoder.encode(JSON.stringify(data));
     await this.localParticipant.publishData(
  payload,
  kind === 'lossy'
    ? DataPacket_Kind.LOSSY
    : DataPacket_Kind.RELIABLE
);
      console.log('📤 Data sent:', data);
    } catch (error) {
      console.error('❌ Failed to send data:', error);
      throw error;
    }
  }

  /**
   * Get all remote participants
   * @returns {Array}
   */
  getRemoteParticipants() {
    if (!this.room) return [];
    return Array.from(this.room.remoteParticipants.values());
  }

  /**
   * Get local participant
   * @returns {LocalParticipant}
   */
  getLocalParticipant() {
    return this.localParticipant;
  }

  /**
   * Get room instance
   * @returns {Room}
   */
  getRoom() {
    return this.room;
  }

  /**
   * Disconnect from room
   */
  async disconnect() {
    if (!this.room) return;
    
    try {
      this.room.localParticipant?.tracks.forEach((publication) => {
  publication.track?.stop();
});
      await this.room.disconnect();
      this.room = null;
      this.localParticipant = null;
      this.remoteParticipants.clear();
      console.log('👋 Disconnected from LiveKit room');
    } catch (error) {
      console.error('❌ Failed to disconnect:', error);
    }
  }

  /**
   * Check if connected to a room
   * @returns {boolean}
   */
  isConnected() {
   return this.room?.state === ConnectionState.Connected;
  }

  /**
   * Get connection state
   * @returns {string}
   */
  getConnectionState() {
    return this.room?.state || 'disconnected';
  }
}

// Export singleton instance
const livekitService = new LiveKitService();
export default livekitService;
