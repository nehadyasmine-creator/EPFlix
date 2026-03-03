import { Component, OnInit, signal, inject , DestroyRef} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../services/toast';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../services/auth-service';
import { User } from '../models/users';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-admin',
  imports: [RouterLink, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {

  loading: boolean = false;
  loginError: string | null = null;

  secretCode: string = "EPFlix2026";
  saisieCode: string = "";

  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isLoggedInAdmin: boolean = false;

  private authService = inject(AuthService);

  users = signal<User[]>([]);
  isLoadingUsers = signal<boolean>(false);

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
      //  setTimeout(
      // this.loading = true,
      //1500
      //  )
      this.loading = true;
      sessionStorage.setItem('admin_access', 'true');
      this.isLoggedInAdmin = true;

    } else {
      this.toastService.show("Code d'accès erroné.", { classname: 'bg-danger text-white' });
      this.loginError = "erreur de connexion";
      this.loading = false;
      return;
    }

  }

  adminLogOut() {
    sessionStorage.removeItem('admin_access');
    this.isLoggedInAdmin = false;

    this.router.navigate(['/admin']);
  }

  ligneChoisie: string = '';

  setContenu(key: string) {
    this.ligneChoisie = key;
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

clickMethod(id: number, firstname:string, lastname:string) {
  if(confirm("Etes-vous sûr de vouloir supprimer "+firstname+" "+lastname+" ?")) {
    this.deleteUser(id);
  }
}


}
