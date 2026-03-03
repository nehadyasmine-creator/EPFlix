import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ToastService } from '../services/toast';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

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

  ngOnInit() {
    const savedStatus = sessionStorage.getItem('admin_access');
    if (savedStatus === 'true') {
      this.isLoggedInAdmin = true;
    }
  }

  onLogin() {
    this.loginError = null;
    if (this.saisieCode === this.secretCode) {
      this.toastService.show('Connexion Administrateur réussie !', { classname: 'bg-info text-white' });
      this.loading = true;
      sessionStorage.setItem('admin_access', 'true');
      this.isLoggedInAdmin = true;
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
  this.ligneChoisie = key;
  if (key === 'graphiques') {
    setTimeout(() => {
      this.renderGraphiqueVisiteurs();
      this.renderGraphiqueNotes();
      this.renderGraphiqueGenres(); 
    }, 0);
  }
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

    const labels = ['0-1', '1-2', '2-3', '3-4','4-5'];
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
}