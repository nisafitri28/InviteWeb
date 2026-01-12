
export type EventType = 'wedding' | 'birthday' | 'tahlilan' | 'umkm';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface Invitation {
  id: string;
  userId: string;
  eventType: EventType;
  eventName: string;
  organizerName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventMessage: string;
  photos: string[]; // Array of Base64 strings
  createdAt: string;
}

export interface RSVP {
  id: string;
  invitationId: string;
  guestName: string;
  guestEmail: string;
  status: 'hadir' | 'tidak';
  attendanceType?: 'sendiri' | 'pasangan';
  message?: string;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  currentView: 'landing' | 'login' | 'register' | 'dashboard' | 'create' | 'invite-view';
  activeInvitationId?: string;
}
