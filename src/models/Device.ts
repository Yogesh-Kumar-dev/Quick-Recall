import { model, models, Schema } from 'mongoose';

// ==============================|| MODEL - DEVICE ||============================== //

export interface DeviceDoc {
  deviceId: string;
  fcmToken: string;
  enabled: boolean;
  userAgent?: string;
  timezone?: string;
  language?: string;
}

const deviceSchema = new Schema<DeviceDoc>(
  {
    deviceId: { type: String, required: true, unique: true },
    fcmToken: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    userAgent: String,
    timezone: String,
    language: String
  },
  { timestamps: true }
);

export default models.Device || model<DeviceDoc>('Device', deviceSchema);
