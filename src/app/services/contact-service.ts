import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export type CreateContactPayload = Omit<Contact, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly storageKey = 'epflix_contacts';

  private readAll(): Contact[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as Contact[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveAll(contacts: Contact[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }

  getContacts(): Observable<Contact[]> {
    const contacts = this.readAll().sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return of(contacts);
  }

  createContact(payload: CreateContactPayload): Observable<Contact> {
    const contacts = this.readAll();
    const nextId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id || 0)) + 1 : 1;

    const created: Contact = {
      id: nextId,
      ...payload,
    };

    contacts.unshift(created);
    this.saveAll(contacts);

    return of(created);
  }

  markAsRead(id: number): Observable<Contact> {
    const contacts = this.readAll();
    const index = contacts.findIndex(c => c.id === id);

    if (index >= 0) {
      contacts[index] = { ...contacts[index], read: true };
      this.saveAll(contacts);
      return of(contacts[index]);
    }

    return of({
      id,
      name: '',
      email: '',
      subject: '',
      message: '',
      createdAt: new Date().toISOString(),
      read: true,
    });
  }

  deleteContact(id: number): Observable<void> {
    const contacts = this.readAll().filter(c => c.id !== id);
    this.saveAll(contacts);
    return of(void 0);
  }
}
