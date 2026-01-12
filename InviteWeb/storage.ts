
import { User, Invitation, RSVP } from './types';

const KEYS = {
  USERS: 'inviteweb_users',
  CURRENT_USER: 'inviteweb_current_user',
  INVITATIONS: 'inviteweb_invitations',
  RSVPS: 'inviteweb_rsvps'
};

export const storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(KEYS.USERS, JSON.stringify(users)),
  
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),
  
  getInvitations: (): Invitation[] => JSON.parse(localStorage.getItem(KEYS.INVITATIONS) || '[]'),
  saveInvitations: (invitations: Invitation[]) => localStorage.setItem(KEYS.INVITATIONS, JSON.stringify(invitations)),
  
  getRSVPs: (): RSVP[] => JSON.parse(localStorage.getItem(KEYS.RSVPS) || '[]'),
  saveRSVPs: (rsvps: RSVP[]) => localStorage.setItem(KEYS.RSVPS, JSON.stringify(rsvps)),

  // Helpers
  addInvitation: (inv: Invitation) => {
    const invs = storage.getInvitations();
    invs.push(inv);
    storage.saveInvitations(invs);
  },
  
  deleteInvitation: (id: string) => {
    const invs = storage.getInvitations().filter(i => i.id !== id);
    const rsvps = storage.getRSVPs().filter(r => r.invitationId !== id);
    storage.saveInvitations(invs);
    storage.saveRSVPs(rsvps);
  },

  addRSVP: (rsvp: RSVP) => {
    const rsvps = storage.getRSVPs();
    rsvps.push(rsvp);
    storage.saveRSVPs(rsvps);
  }
};

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}
