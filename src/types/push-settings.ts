// ==============================|| TYPES - PUSH NOTIFICATION SETTINGS ||============================== //

export interface PushSettings {
  deviceId: string;
  enabled: boolean;
  fcmToken?: string;
  updatedAt: number;
}
