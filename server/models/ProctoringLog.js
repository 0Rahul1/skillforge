import mongoose from 'mongoose';

const proctoringLogSchema = new mongoose.Schema({
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  events: [{
    type: {
      type: String,
      enum: [
        'face_not_detected', 'multiple_faces', 'face_out_of_frame',
        'camera_blocked', 'looking_away', 'tab_switch', 'window_switch',
        'fullscreen_exit', 'browser_minimize', 'focus_lost',
        'right_click', 'copy_attempt', 'dev_tools_attempt',
        'audio_alert', 'screen_share_stopped', 'suspicious_activity',
        'session_start', 'session_end', 'warning_shown'
      ]
    },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    data: mongoose.Schema.Types.Mixed,
  }],

  // Summary counts
  tabSwitchCount: { type: Number, default: 0 },
  fullScreenExits: { type: Number, default: 0 },
  faceAlerts: { type: Number, default: 0 },
  audioAlerts: { type: Number, default: 0 },
  warningsShown: { type: Number, default: 0 },
  totalViolations: { type: Number, default: 0 },

  // Face detection state
  faceDetectionEnabled: { type: Boolean, default: false },
  cameraPermissionGranted: { type: Boolean, default: false },
  micPermissionGranted: { type: Boolean, default: false },

  // Computed integrity score (0-100)
  integrityScore: { type: Number, default: 100 },
  recommendation: { type: String, default: 'Clean' },
}, { timestamps: true });

export default mongoose.model('ProctoringLog', proctoringLogSchema);
