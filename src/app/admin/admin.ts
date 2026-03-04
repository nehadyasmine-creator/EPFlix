import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { ToastService } from '../services/toast';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { User } from '../models/users';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ContactService, Contact } from '../services/contact-service';


Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  loading: boolean = false;
  loginError: string | null = null;
  secretCode: string = "EPFlix2026";
  saisieCode: string = "";
  isLoggedInAdmin: boolean = false;
  ligneChoisie: string = '';

  chartVisiteurs: any;
  chartNotes: any;
  chartGenres: any;

  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private authService = inject(AuthService);
  private contactService = inject(ContactService);

  users = signal<User[]>([]);
  isLoadingUsers = signal<boolean>(false);
  contacts = signal<Contact[]>([]);

  ngOnInit() {
    const savedStatus = sessionStorage.getItem('admin_access');
    if (savedStatus === 'true') {
      this.isLoggedInAdmin = true;
      this.setContenu('remontees');
    }
  }

  onLogin() {
    this.loginError = null;
    if (this.saisieCode === this.secretCode) {
      this.toastService.show('Connexion Administrateur réussie !', { classname: 'bg-info text-white' });
      //  setTimeout(
      // this.loading = true,
      //1500
      //  )
      this.loading = true;
      sessionStorage.setItem('admin_access', 'true');
      this.isLoggedInAdmin = true;
      this.setContenu('remontees');
    } else {
      this.toastService.show("Code d'accès erroné.", { classname: 'bg-danger text-white' });
      this.loginError = "erreur de connexion";
      this.loading = false;
    }
  }

  adminLogOut() {
    sessionStorage.removeItem('admin_access');
    this.isLoggedInAdmin = false;

    this.router.navigate(['/admin']);
  }
  setContenu(key: string) {
    const normalizedKey = this.normalizeTabKey(key);
    this.ligneChoisie = normalizedKey;
    if (normalizedKey === 'remontees') {
      this.loadContacts();
    }
    if (normalizedKey === 'graphiques') {
      setTimeout(() => {
        this.renderGraphiqueVisiteurs();
        this.renderGraphiqueNotes();
        this.renderGraphiqueGenres();
      }, 0);
    }
  }

  private normalizeTabKey(key: string): string {
    if (key === 'remontées' || key === 'remontees') {
      return 'remontees';
    }
    return key;
  }

  isRemonteesTab(): boolean {
    return this.ligneChoisie === 'remontees';
  }

  formatContactDate(value: string): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  private renderGraphiqueVisiteurs() {
    const ctx = document.getElementById('canvasVisiteurs') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartVisiteurs) this.chartVisiteurs.destroy();

    const labels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('fr-FR', { weekday: 'short' });
    });

    const dataPoints = Array.from({ length: 7 }, () => Math.floor(Math.random() * 21));

    this.chartVisiteurs = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Visiteurs (7 derniers jours)',
          data: dataPoints,
          borderColor: '#f27a63',
          backgroundColor: 'rgba(242, 122, 99, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 20 } }
      }
    });
  }
  private renderGraphiqueNotes() {
    const ctx = document.getElementById('canvasNotes') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartNotes) this.chartNotes.destroy();

    const labels = ['0-1', '1-2', '2-3', '3-4', '4-5'];
    const dataFilms = labels.map((_, i) => {
      return (i * 3) + Math.floor(Math.random() * 6);
    });

    this.chartNotes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de films par note',
          data: dataFilms,
          backgroundColor: '#f27a63',
          hoverBackgroundColor: '#f27a63',
          borderColor: '#f27a63',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
          }
        },
        plugins: {
          legend: { display: true, position: 'bottom' }
        }
      }
    });
  }

  loadAllUsers() {
    this.isLoadingUsers.set(true);
    this.authService.getAllUsers()
      .pipe(finalize(() => this.isLoadingUsers.set(false)))
      .subscribe({
        next: (data) => this.users.set(data),
        error: () => this.toastService.show("Erreur de chargement", { classname: 'bg-danger text-white' })
      });
  }
  deleteUser(id: number): void {
    this.authService.deleteUser(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() =>
      this.users.update(current => current.filter(user => user.id !== id))
    );
  }

  clickMethod(id: number, firstname: string, lastname: string) {
    if (confirm("Etes-vous sûr de vouloir supprimer le compte utilisateur de " + firstname + " " + lastname + " ?")) {
      this.deleteUser(id);
    }
  }



  private renderGraphiqueGenres() {
    const ctx = document.getElementById('canvasGenres') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartGenres) this.chartGenres.destroy();

    const dataGenres = {
      labels: ['Action', 'Comédie', 'Drame', 'Horreur', 'Sci-Fi'],
      datasets: [{
        label: 'Nombre de films',
        data: [45, 25, 60, 15, 30],
        backgroundColor: [
          '#f27a63',
          '#4e73df',
          '#1cc88a',
          '#36b9cc',
          '#f6c23e'
        ],
        hoverOffset: 10
      }]
    };

    this.chartGenres = new Chart(ctx, {
      type: 'doughnut',
      data: dataGenres,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Répartition par Genre'
          }
        }
      }
    });
  }

  loadContacts() {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        const sorted = (data || []).sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        });
        this.contacts.set(sorted);
      },
      error: () => {
        this.toastService.show('Erreur de chargement des remontées', { classname: 'bg-danger text-white' });
      }
    });
  }

  markContactAsRead(contact: Contact) {
    this.contactService.markAsRead(contact.id).subscribe({
      next: () => {
        this.contacts.update(list => list.map(c => c.id === contact.id ? { ...c, read: true } : c));
      },
      error: () => {
        this.toastService.show('Impossible de marquer comme lu', { classname: 'bg-danger text-white' });
      }
    });
  }

  removeContact(contact: Contact) {
    this.contactService.deleteContact(contact.id).subscribe({
      next: () => {
        this.contacts.update(list => list.filter(c => c.id !== contact.id));
        this.toastService.show('Message supprimé', { classname: 'bg-success text-white' });
      },
      error: () => {
        this.toastService.show('Impossible de supprimer le message', { classname: 'bg-danger text-white' });
      }
    });
  }
}