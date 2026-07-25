import { model, models, Schema } from 'mongoose';

// ==============================|| MODEL - NOTIFICATION TEMPLATE ||============================== //

export interface NotificationTemplateDoc {
  title: string;
  body: string;
  active: boolean;
}

const notificationTemplateSchema = new Schema<NotificationTemplateDoc>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default models.NotificationTemplate || model<NotificationTemplateDoc>('NotificationTemplate', notificationTemplateSchema);
