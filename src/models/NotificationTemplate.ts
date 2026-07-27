import { model, models, Schema } from 'mongoose';

// ==============================|| MODEL - NOTIFICATION TEMPLATE ||============================== //

export interface NotificationTemplateDoc {
  title: string;
  body: string;
  active: boolean;
  lastSentAt: Date | null;
}

const notificationTemplateSchema = new Schema<NotificationTemplateDoc>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    active: { type: Boolean, default: true },
    // Round-robin cursor: cron always picks the active template with the oldest (or unset)
    // lastSentAt, so every template cycles through once before any repeat.
    lastSentAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default models.NotificationTemplate || model<NotificationTemplateDoc>('NotificationTemplate', notificationTemplateSchema);
