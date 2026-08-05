import React, { useState, useEffect, useRef } from 'react';
import '@livekit/components-styles';
import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useRoomContext,
  useLocalParticipant,
  useParticipants
} from '@livekit/components-react';

import { RoomEvent, Track } from 'livekit-client';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Hand,
  MessageCircle,
  Settings,
  Users,
  MoreVertical,
  Maximize2,
  Minimize2,
  Monitor,
  MonitorOff,
  AlertCircle,
} from 'lucide-react';
import './AdvancedCallScreen.css';
import livekitService from '../../../Services/livekitService';
import CallDiagnostics from './CallDiagnostics';


/**
 * Advanced Call Screen Component with LiveKit Integration
 * Features:
 * - Multiple participant video grid (LiveKit powered)
 * - Hand raising system
 * - Screen sharing
 * - In-call chat
 * - Participant management
 * - Call recording
 * - Call statistics
 * - Active speaker detection
 */
const AdvancedCallScreen = ({
  meetingId,
  localUser,
  targetUser,
  onEndCall,
  type = 'video',
  isIncoming = false,
  onAccept,
  onReject,
}) => {
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [livekitFailed, setLivekitFailed] = useState(false);
  const [useBasicMode, setUseBasicMode] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'voice');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Device selection states
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [speakerDevices, setSpeakerDevices] = useState([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedSpeakerDevice, setSelectedSpeakerDevice] = useState('');

  const containerRef = useRef(null);
  const callTimerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef(new Map());

 useEffect(() => {
  let attachedTrack = null;

  const setupLocalVideo = async () => {
    if (!room || !localVideoRef.current) return;

    const videoTrackPublication = Array.from(
      room.localParticipant.videoTracks.values()
    )[0];

    if (videoTrackPublication?.track) {
      attachedTrack = videoTrackPublication.track;
      attachedTrack.attach(localVideoRef.current);
    }
  };

  setupLocalVideo();

  return () => {
    if (attachedTrack && localVideoRef.current) {
      attachedTrack.detach(localVideoRef.current);
    }
  };
}, [room]);

  // Call timer
  useEffect(() => {
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(callTimerRef.current);
  }, []);

  // Enumerate available devices
  useEffect(() => {
    const enumerateDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
        
        setAudioDevices(audioInputs);
        setVideoDevices(videoInputs);
        setSpeakerDevices(audioOutputs);
        
        // Set default devices
        if (audioInputs.length > 0 && !selectedAudioDevice) {
          setSelectedAudioDevice(audioInputs[0].deviceId);
        }
        if (videoInputs.length > 0 && !selectedVideoDevice) {
          setSelectedVideoDevice(videoInputs[0].deviceId);
        }
        if (audioOutputs.length > 0 && !selectedSpeakerDevice) {
          setSelectedSpeakerDevice(audioOutputs[0].deviceId);
        }
        
        console.log('🎤 Available devices:', {
          audio: audioInputs.length,
          video: videoInputs.length,
          speakers: audioOutputs.length
        });
      } catch (error) {
        console.error('❌ Failed to enumerate devices:', error);
      }
    };

    enumerateDevices();
    
    // Listen for device changes
    navigator.mediaDevices?.addEventListener('devicechange', enumerateDevices);
    
    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', enumerateDevices);
    };
  }, [selectedAudioDevice, selectedVideoDevice, selectedSpeakerDevice]);

  // Initialize LiveKit connection
  useEffect(() => {
    // Show call screen immediately, then try LiveKit in background
    const timer = setTimeout(() => {
      setConnecting(false);
    }, 1000); // Show connecting screen for 1 second

    const initializeLiveKit = async () => {
      try {
        console.log('🚀 Initializing LiveKit for meeting:', meetingId);
        
        // Connect to LiveKit room
        const connectedRoom = await livekitService.connect(
          meetingId,
          localUser?.name || localUser?.email || 'User'
        );
        
        setRoom(connectedRoom);
        await connectedRoom.localParticipant.enableCameraAndMicrophone();
        
        // Setup callbacks
        livekitService.setCallbacks({
          onParticipantConnected: (participant) => {
            console.log('👤 Participant connected:', participant.identity);
            setParticipants(prev => [...prev, {
              id: participant.identity,
              name: participant.name || participant.identity,
              identity: participant.identity,
              muted: !participant.isMicrophoneEnabled,
              videoOff: !participant.isCameraEnabled,
              handRaised: false,
              isScreenSharing: false
            }]);
          },
          
          onParticipantDisconnected: (participant) => {
            console.log('👤 Participant disconnected:', participant.identity);
            setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
          },
          
          onTrackSubscribed: (track, publication, participant) => {
            console.log('📺 Track subscribed:', track.kind, 'from', participant.identity);
            
           if (track.kind === 'video' || track.source === Track.Source.ScreenShare) {
              const videoElement = remoteVideosRef.current.get(participant.identity);
              if (videoElement) {
                track.attach(videoElement);
              }
            }
          },
          
          onDataReceived: (data, participant) => {
            console.log('📨 Data received:', data, 'from', participant?.identity);
            
            switch (data.type) {
              case 'chat':
                setMessages(prev => [...prev, {
                  id: Date.now(),
                  sender: participant?.name || participant?.identity || 'Unknown',
                  text: data.message,
                  timestamp: new Date(),
                }]);
                break;
                
              case 'hand_raise':
                setParticipants(prev => prev.map(p => 
                  p.identity === participant?.identity
                    ? { ...p, handRaised: data.raised }
                    : p
                ));
                break;
            }
          },
          
          onActiveSpeakersChanged: (speakers) => {
            if (speakers.length > 0) {
              setActiveSpeaker(speakers[0].identity);
            } else {
              setActiveSpeaker(null);
            }
          },
          
          onDisconnected: (reason) => {
            console.log('🔌 Disconnected from room:', reason);
            onEndCall?.();
          }
        });
        
        console.log('✅ LiveKit initialized successfully');
        
      } catch (err) {
        console.error('❌ Failed to initialize LiveKit:', err);
        setLivekitFailed(true);
        setUseBasicMode(true);
        // Don't set error - just fall back to basic mode
        console.log('🔄 Falling back to basic calling mode');
      }
    };

    if (meetingId && !useBasicMode) {
      // Try LiveKit in background after showing call screen
      setTimeout(() => {
        initializeLiveKit();
      }, 500);
    }

   return () => {
  clearTimeout(timer);
};
  }, [meetingId, localUser, useBasicMode]);

  // Format call duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle audio device change
  const handleAudioDeviceChange = async (deviceId) => {
    try {
      console.log('🎤 Switching audio device to:', deviceId);
      setSelectedAudioDevice(deviceId);
      
      // Get new audio stream with selected device
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
        video: false
      });
      
      const newAudioTrack = newStream.getAudioTracks()[0];
      
      // Replace audio track in peer connection
      if (livekitService.room) {
        await livekitService.setMicrophoneEnabled(false);
        
        // Find and replace the audio sender
        const senders = livekitService.room.localParticipant.audioTracks;
        for (const [, publication] of senders) {
          const track = publication.track;
          if (track) {
            await track.replaceTrack(newAudioTrack);
          }
        }
        
        await livekitService.setMicrophoneEnabled(!isMuted);
      }
      
      console.log('✅ Audio device switched successfully');
    } catch (error) {
      console.error('❌ Failed to switch audio device:', error);
      alert('Failed to switch microphone. Please try again.');
    }
  };

  // Handle video device change
  const handleVideoDeviceChange = async (deviceId) => {
    try {
      console.log('📹 Switching video device to:', deviceId);
      setSelectedVideoDevice(deviceId);
      
      // Get new video stream with selected device
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { deviceId: { exact: deviceId } }
      });
      
      const newVideoTrack = newStream.getVideoTracks()[0];
      
      // Replace video track in peer connection
      if (livekitService.room) {
        const wasVideoOff = isVideoOff;
        await livekitService.setCameraEnabled(false);
        
        // Find and replace the video sender
        const senders = livekitService.room.localParticipant.videoTracks;
        for (const [, publication] of senders) {
          const track = publication.track;
          if (track) {
            await track.replaceTrack(newVideoTrack);
          }
        }
        
        // Update local video preview
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = new MediaStream([newVideoTrack]);
        }
        
        await livekitService.setCameraEnabled(!wasVideoOff);
      }
      
      console.log('✅ Video device switched successfully');
    } catch (error) {
      console.error('❌ Failed to switch video device:', error);
      alert('Failed to switch camera. Please try again.');
    }
  };

  // Handle speaker device change
  const handleSpeakerDeviceChange = async (deviceId) => {
    try {
      console.log('🔊 Switching speaker device to:', deviceId);
      setSelectedSpeakerDevice(deviceId);
      
      // Set sink ID for all remote video elements
      const videoElements = document.querySelectorAll('.video-participant video');
      for (const videoElement of videoElements) {
        if (typeof videoElement.setSinkId === 'function') {
          await videoElement.setSinkId(deviceId);
        }
      }
      
      console.log('✅ Speaker device switched successfully');
    } catch (error) {
      console.error('❌ Failed to switch speaker device:', error);
      alert('Failed to switch speaker. Please try again.');
    }
  };

  // Handle microphone toggle
  const handleMicToggle = async () => {
    try {
      await livekitService.setMicrophoneEnabled(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('❌ Failed to toggle microphone:', error);
    }
  };

  // Handle camera toggle
  const handleCameraToggle = async () => {
    try {
      await livekitService.setCameraEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    } catch (error) {
      console.error('❌ Failed to toggle camera:', error);
    }
  };

  // Handle screen sharing
  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        console.log('🖥️ Starting screen share...');
        await livekitService.startScreenShare();
        setIsScreenSharing(true);
      } else {
        console.log('🖥️ Stopping screen share...');
        await livekitService.stopScreenShare();
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('❌ Screen share error:', error);
      alert('Failed to share screen. Please try again.');
    }
  };

  // Handle hand raise
  const handleHandRaise = async () => {
    try {
      const newState = !handRaised;
      setHandRaised(newState);
      
      // Send hand raise signal to all participants
      await livekitService.sendData({
        type: 'hand_raise',
        raised: newState,
        timestamp: Date.now()
      });
      
      console.log(`✋ Hand ${newState ? 'raised' : 'lowered'}`);
    } catch (error) {
      console.error('❌ Failed to raise hand:', error);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      try {
        const newMessage = {
          id: Date.now(),
          sender: localUser?.name || 'You',
          text: messageInput,
          timestamp: new Date(),
        };
        
        // Add to local messages
        setMessages(prev => [...prev, newMessage]);
        
        // Send to all participants via LiveKit data channel
        await livekitService.sendData({
          type: 'chat',
          message: messageInput,
          timestamp: Date.now()
        });
        
        setMessageInput('');
      } catch (error) {
        console.error('❌ Failed to send message:', error);
      }
    }
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
  document.exitFullscreen();
}
      setIsFullscreen(false);
    }
  };

  // Handle end call
  const handleEndCall = async () => {
    try {
      await livekitService.disconnect();
      onEndCall?.();
    } catch (error) {
      console.error('❌ Failed to end call:', error);
      onEndCall?.();
    }
  };

  // Participant grid layout
  const getGridLayout = () => {
    const count = participants.length + 1; // +1 for local user
    if (count === 1) return 'grid-1';
    if (count === 2) return 'grid-2';
    if (count <= 4) return 'grid-4';
    if (count <= 9) return 'grid-9';
    return 'grid-many';
  };

  if (connecting) {
    return (
      <div className="advanced-call-screen">
        <div className="call-connecting">
          <div className="connecting-avatar">
            <div className="avatar-placeholder">
              {(targetUser?.name || targetUser?.email || 'U').charAt(0)?.toUpperCase()}
            </div>
          </div>
          <h2>
            {isIncoming 
              ? `Incoming call from ${targetUser?.name || targetUser?.email}` 
              : `Calling ${targetUser?.name || targetUser?.email}...`
            }
          </h2>
          <div className="connecting-spinner">
            <div className="spinner"></div>
          </div>
          <p>{isIncoming ? 'Incoming call' : 'Connecting...'}</p>
          
          {/* Call Controls during connection */}
          <div className="connecting-controls">
            {isIncoming ? (
              <>
                <button 
                  className="control-btn accept-call"
                  onClick={onAccept}
                  title="Accept call"
                >
                  <Phone size={20} />
                </button>
                <button 
                  className="control-btn end-call"
                  onClick={onReject}
                  title="Reject call"
                >
                  <Phone size={20} />
                </button>
              </>
            ) : (
              <button 
                className="control-btn end-call"
                onClick={onEndCall}
                title="End call"
              >
                <Phone size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="advanced-call-screen error">
          <div className="error-message">
            <AlertCircle size={48} style={{ color: '#ff6b6b', marginBottom: '16px' }} />
            <p>❌ {error}</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                onClick={() => setShowDiagnostics(true)}
                style={{
                  backgroundColor: '#4a9eff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🔍 Run Diagnostics
              </button>
              <button 
                onClick={() => setUseBasicMode(true)}
                style={{
                  backgroundColor: '#ff9800',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🔄 Use Basic Mode
              </button>
              <button onClick={onEndCall}>Close</button>
            </div>
          </div>
        </div>
        {showDiagnostics && (
          <CallDiagnostics onClose={() => setShowDiagnostics(false)} />
        )}
      </>
    );
  }

  return (
    <div className="advanced-call-screen" ref={containerRef}>
      {/* Main body: video grid + optional right side panel */}
      <div className="advanced-call-body">
        {/* Main Video Grid */}
        <div className={`video-grid ${getGridLayout()}`}>
          {/* Local User */}
          <div className="video-participant local-participant">
            <div className="video-placeholder">
              {isVideoOff ? (
                <div className="video-off-indicator">
                  <VideoOff size={48} />
                  <p>{localUser?.name || 'You'}</p>
                </div>
              ) : (
                <video ref={localVideoRef} autoPlay muted playsInline />
              )}
            </div>
            <div className="participant-info">
              <span className="participant-name">{localUser?.name || 'You'}</span>
              {isMuted && <MicOff size={16} className="muted-indicator" />}
              {handRaised && <Hand size={16} className="hand-raised-indicator" />}
            </div>
          </div>

          {/* Remote Participants */}
          {participants.map((participant) => (
            <div
              key={participant.identity}
              className={`video-participant ${activeSpeaker === participant.identity ? 'active' : ''}`}
            >
              <div className="video-placeholder">
                {participant.videoOff ? (
                  <div className="video-off-indicator">
                    <VideoOff size={48} />
                    <p>{participant.name}</p>
                  </div>
                ) : (
                  <video
                    ref={el => { if (el) remoteVideosRef.current.set(participant.identity, el); }}
                    autoPlay
                    playsInline
                  />
                )}
              </div>
              <div className="participant-info">
                <span className="participant-name">{participant.name}</span>
                <div className="participant-status">
                  {participant.muted && <MicOff size={14} />}
                  {participant.handRaised && <Hand size={14} className="hand-raised" />}
                  {participant.isScreenSharing && <Monitor size={14} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right side panel — Chat, Participants, or Settings */}
        {(showChat || showParticipants || showSettings) && (
          <div className="advanced-side-panel">
            {/* Chat Panel */}
            {showChat && (
              <div className="chat-panel">
                <div className="chat-header">
                  <h3>In-call messages</h3>
                  <button onClick={() => setShowChat(false)}>×</button>
                </div>
                <div className="chat-messages">
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#9aa0a6', padding: '32px 16px', fontSize: 13 }}>
                      <p>No messages yet</p>
                      <p style={{ fontSize: 12, marginTop: 4 }}>Send a message to everyone in the call</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-message ${msg.sender === (localUser?.name || 'You') ? 'own-message' : 'other-message'}`}
                    >
                      {msg.sender !== (localUser?.name || 'You') && (
                        <strong>{msg.sender}</strong>
                      )}
                      <p>{msg.text}</p>
                      <small>{msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Send a message to everyone"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    autoFocus
                  />
                  <button onClick={handleSendMessage}>➤</button>
                </div>
              </div>
            )}

            {/* Participants Panel */}
            {showParticipants && !showChat && (
              <div className="participants-panel">
                <div className="panel-header">
                  <h3>Participants ({participants.length + 1})</h3>
                  <button onClick={() => setShowParticipants(false)}>×</button>
                </div>
                <div className="participants-list">
                  <div className="participant-item local">
                    <span>{localUser?.name || 'You'} (You)</span>
                    <span className="badge">Host</span>
                  </div>
                  {participants.map((participant) => (
                    <div key={participant.id} className="participant-item">
                      <div className="participant-details">
                        <span>{participant.name}</span>
                        <div className="participant-indicators">
                          {participant.muted && <span className="indicator">Muted</span>}
                          {participant.handRaised && <span className="indicator hand">Hand Raised</span>}
                          {participant.isScreenSharing && <span className="indicator">Sharing</span>}
                        </div>
                      </div>
                      <button className="more-btn"><MoreVertical size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && !showChat && !showParticipants && (
              <div className="settings-panel">
                <div className="panel-header">
                  <h3>Settings</h3>
                  <button onClick={() => setShowSettings(false)}>×</button>
                </div>
                <div className="settings-content">
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" checked={isRecording} onChange={(e) => setIsRecording(e.target.checked)} />
                      Record Call
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Audio Input</label>
                    <select value={selectedAudioDevice} onChange={(e) => handleAudioDeviceChange(e.target.value)}>
                      {audioDevices.length === 0 ? <option>No microphones found</option> : audioDevices.map(d => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone ${d.deviceId.slice(0, 6)}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Video Input</label>
                    <select value={selectedVideoDevice} onChange={(e) => handleVideoDeviceChange(e.target.value)}>
                      {videoDevices.length === 0 ? <option>No cameras found</option> : videoDevices.map(d => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 6)}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Speaker Output</label>
                    <select value={selectedSpeakerDevice} onChange={(e) => handleSpeakerDeviceChange(e.target.value)}>
                      {speakerDevices.length === 0 ? <option>Default Speaker</option> : speakerDevices.map(d => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || `Speaker ${d.deviceId.slice(0, 6)}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="control-bar">
        <div className="call-info">
          <span className="call-duration">{formatDuration(callDuration)}</span>
          <span className="participant-count">{participants.length + 1} participant{participants.length !== 0 ? 's' : ''}</span>
          {livekitFailed && (
            <span className="mode-indicator basic-mode" title="Using basic calling mode - LiveKit unavailable">
              ⚙️ Basic Mode
            </span>
          )}
          {!livekitFailed && room && (
            <span className="mode-indicator advanced-mode" title="Using advanced calling mode with LiveKit">
              🚀 Advanced Mode
            </span>
          )}
        </div>

        <div className="controls">
          {/* Mute/Unmute */}
          <button
            className={`control-btn ${isMuted ? 'active' : ''}`}
            onClick={handleMicToggle}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Video On/Off */}
          {type === 'video' && (
            <button
              className={`control-btn ${isVideoOff ? 'active' : ''}`}
              onClick={handleCameraToggle}
              title={isVideoOff ? 'Turn on video' : 'Turn off video'}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          )}

          {/* Screen Share */}
          <button
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={handleScreenShare}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
          </button>

          {/* Hand Raise */}
          <button
            className={`control-btn ${handRaised ? 'active' : ''}`}
            onClick={handleHandRaise}
            title={handRaised ? 'Lower hand' : 'Raise hand'}
          >
            <Hand size={20} />
          </button>

          {/* Chat */}
          <button
            className={`control-btn ${showChat ? 'active' : ''}`}
            onClick={() => setShowChat(!showChat)}
            title="Chat"
          >
            <MessageCircle size={20} />
            {messages.length > 0 && <span className="badge">{messages.length}</span>}
          </button>

          {/* Participants */}
          <button
            className={`control-btn ${showParticipants ? 'active' : ''}`}
            onClick={() => setShowParticipants(!showParticipants)}
            title="Participants"
          >
            <Users size={20} />
            <span className="badge">{participants.length + 1}</span>
          </button>

          {/* Settings */}
          <button
            className={`control-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Fullscreen */}
          <button
            className="control-btn"
            onClick={handleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* End Call */}
          <button
            className="control-btn end-call"
            onClick={handleEndCall}
            title="End call"
          >
            <Phone size={20} />
          </button>
        </div>

        <div className="call-status">
          {isRecording && <span className="recording-indicator">● Recording</span>}
        </div>
      </div>
    </div>
  );
};

/**
 * Inner component that uses LiveKit hooks (must be inside LiveKitRoom)
 */
const CallRoomContent = ({ 
  meetingId, 
  onEndCall, 
  localUserName,
  type 
}) => {
  const room = useRoomContext();
 const { localParticipant } = useLocalParticipant();
 
 
  const tracks = useTracks(
  [
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: true },
  ],
  { onlySubscribed: false }
);
   const allParticipants = useParticipants();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'voice');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participantStates, setParticipantStates] = useState(new Map());

  const containerRef = useRef(null);
  const callTimerRef = useRef(null);

  // Call timer
  useEffect(() => {
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(callTimerRef.current);
  }, []);

  // Listen for data messages (chat, hand raise, etc.)
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload, participant) => {
      try {
        const decoder = new TextDecoder();
        const data = JSON.parse(decoder.decode(payload));
        
        console.log('📨 Data received:', data, 'from', participant?.identity);

        switch (data.type) {
          case 'chat':
            setMessages(prev => [...prev, {
              id: Date.now(),
              sender: participant?.name || participant?.identity || 'Unknown',
              text: data.message,
              timestamp: new Date(),
            }]);
            break;
            
          case 'hand_raise':
            setParticipantStates(prev => {
              const next = new Map(prev);
              if (!participant) return;

next.set(participant.identity, {
                ...next.get(participant.identity),
                handRaised: data.raised
              });
              return next;
            });
            break;
            
          default:
            console.log('Unknown data type:', data.type);
        }
      } catch (error) {
        console.error('❌ Failed to parse data:', error);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  // Listen for active speakers
  useEffect(() => {
    if (!room) return;

    const handleActiveSpeakersChanged = (speakers) => {
      if (speakers.length > 0) {
        setActiveSpeaker(speakers[0].identity);
      } else {
        setActiveSpeaker(null);
      }
    };

    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);

    return () => {
      room.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);
    };
  }, [room]);

  // Format call duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle microphone toggle
  const handleMicToggle = async () => {
    try {
      await livekitService.setMicrophoneEnabled(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('❌ Failed to toggle microphone:', error);
    }
  };

  // Handle camera toggle
  const handleCameraToggle = async () => {
    try {
      await livekitService.setCameraEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    } catch (error) {
      console.error('❌ Failed to toggle camera:', error);
    }
  };

  // Handle screen sharing
  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        console.log('🖥️ Starting screen share...');
        await livekitService.startScreenShare();
        setIsScreenSharing(true);
      } else {
        console.log('🖥️ Stopping screen share...');
        await livekitService.stopScreenShare();
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('❌ Screen share error:', error);
      alert('Failed to share screen. Please try again.');
    }
  };

  // Handle hand raise
  const handleHandRaise = async () => {
    try {
      const newState = !handRaised;
      setHandRaised(newState);
      
      // Send hand raise signal to all participants
      await livekitService.sendData({
        type: 'hand_raise',
        raised: newState,
        timestamp: Date.now()
      });
      
      console.log(`✋ Hand ${newState ? 'raised' : 'lowered'}`);
    } catch (error) {
      console.error('❌ Failed to raise hand:', error);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      try {
        const newMessage = {
          id: Date.now(),
          sender: localUserName || 'You',
          text: messageInput,
          timestamp: new Date(),
        };
        
        // Add to local messages
        setMessages(prev => [...prev, newMessage]);
        
        // Send to all participants via LiveKit data channel
        await livekitService.sendData({
          type: 'chat',
          message: messageInput,
          timestamp: Date.now()
        });
        
        setMessageInput('');
      } catch (error) {
        console.error('❌ Failed to send message:', error);
      }
    }
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
  containerRef.current.requestFullscreen();
}
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
  document.exitFullscreen();
}
      setIsFullscreen(false);
    }
  };

  // Handle end call
  const handleEndCall = async () => {
    try {
      await livekitService.disconnect();
      onEndCall?.();
    } catch (error) {
      console.error('❌ Failed to end call:', error);
      onEndCall?.();
    }
  };

  // Participant grid layout
  const getGridLayout = () => {
    const count = allParticipants.length;
    if (count === 1) return 'grid-1';
    if (count === 2) return 'grid-2';
    if (count <= 4) return 'grid-4';
    if (count <= 9) return 'grid-9';
    return 'grid-many';
  };

  return (
    <div className="advanced-call-screen" ref={containerRef}>
      {/* Main Video Grid */}
      <div className={`video-grid ${getGridLayout()}`}>
        <GridLayout tracks={tracks}>
          <ParticipantTile />
        </GridLayout>
      </div>

      {/* Audio Renderer (handles all audio automatically) */}
      <RoomAudioRenderer />

      {/* Control Bar */}
      <div className="control-bar">
        <div className="call-info">
          <span className="call-duration">{formatDuration(callDuration)}</span>
          <span className="participant-count">{allParticipants.length} participant{allParticipants.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="controls">
          {/* Mute/Unmute */}
          <button
            className={`control-btn ${isMuted ? 'active' : ''}`}
            onClick={handleMicToggle}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Video On/Off */}
          {type === 'video' && (
            <button
              className={`control-btn ${isVideoOff ? 'active' : ''}`}
              onClick={handleCameraToggle}
              title={isVideoOff ? 'Turn on video' : 'Turn off video'}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          )}

          {/* Screen Share */}
          <button
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={handleScreenShare}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
          </button>

          {/* Hand Raise */}
          <button
            className={`control-btn ${handRaised ? 'active' : ''}`}
            onClick={handleHandRaise}
            title={handRaised ? 'Lower hand' : 'Raise hand'}
          >
            <Hand size={20} />
          </button>

          {/* Chat */}
          <button
            className={`control-btn ${showChat ? 'active' : ''}`}
            onClick={() => setShowChat(!showChat)}
            title="Chat"
          >
            <MessageCircle size={20} />
            {messages.length > 0 && <span className="badge">{messages.length}</span>}
          </button>

          {/* Participants */}
          <button
            className={`control-btn ${showParticipants ? 'active' : ''}`}
            onClick={() => setShowParticipants(!showParticipants)}
            title="Participants"
          >
            <Users size={20} />
            <span className="badge">{allParticipants.length}</span>
          </button>

          {/* Settings */}
          <button
            className={`control-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Fullscreen */}
          <button
            className="control-btn"
            onClick={handleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* End Call */}
          <button
            className="control-btn end-call"
            onClick={handleEndCall}
            title="End call"
          >
            <Phone size={20} />
          </button>
        </div>

        <div className="call-status">
          {isRecording && <span className="recording-indicator">● Recording</span>}
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="chat-panel">
          <div className="chat-header">
            <h3>Chat</h3>
            <button onClick={() => setShowChat(false)}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className="chat-message">
                <strong>{msg.sender}</strong>
                <p>{msg.text}</p>
                <small>{msg.timestamp.toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}

      {/* Participants Panel */}
      {showParticipants && (
        <div className="participants-panel">
          <div className="panel-header">
            <h3>Participants ({allParticipants.length})</h3>
            <button onClick={() => setShowParticipants(false)}>×</button>
          </div>
          <div className="participants-list">
            {allParticipants.map((participant) => {
              const isLocal = participant === localParticipant;
              const state = participantStates.get(participant.identity) || {};
              
              return (
                <div key={participant.identity} className={`participant-item ${isLocal ? 'local' : ''}`}>
                  <div className="participant-details">
                    <span>{participant.name || participant.identity} {isLocal && '(You)'}</span>
                    <div className="participant-indicators">
                      {participant.isMicrophoneEnabled === false && <span className="indicator">Muted</span>}
                      {state.handRaised && <span className="indicator hand">Hand Raised</span>}
                      {participant.isScreenSharing && <span className="indicator">Sharing</span>}
                    </div>
                  </div>
                  {!isLocal && (
                    <button className="more-btn">
                      <MoreVertical size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <div className="panel-header">
            <h3>Settings</h3>
            <button onClick={() => setShowSettings(false)}>×</button>
          </div>
          <div className="settings-content">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={isRecording}
                  onChange={(e) => setIsRecording(e.target.checked)}
                />
                Record Call
              </label>
            </div>
            <div className="setting-item">
              <label>Audio Input</label>
              <select>
                <option>Default Microphone</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Video Input</label>
              <select>
                <option>Default Camera</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Speaker Output</label>
              <select>
                <option>Default Speaker</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedCallScreen;