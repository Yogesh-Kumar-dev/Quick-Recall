import { model, models, Schema, type Types } from 'mongoose';

// ==============================|| MODEL - NOTIFICATION (AUDIT LOG) ||============================== //

export interface NotificationDoc {
  deviceId: string;
  templateId: Types.ObjectId;
  title?: string;
  body?: string;
  status: 'sent' | 'failed';
  error?: string;
  sentAt: Date;
}

const notificationSchema = new Schema<NotificationDoc>({
  deviceId: { type: String, required: true },
  templateId: { type: Schema.Types.ObjectId, ref: 'NotificationTemplate', required: true },
  title: String,
  body: String,
  status: { type: String, enum: ['sent', 'failed'], required: true },
  error: String,
  sentAt: { type: Date, default: Date.now }
});

export default models.Notification || model<NotificationDoc>('Notification', notificationSchema);
