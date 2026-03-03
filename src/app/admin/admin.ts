import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../services/toast';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


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

  isLoggedInAdmin: boolean = false;


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

  ligneChoisie : string ='';

  setContenu(key:string){
      this.ligneChoisie = key;
    }
  

  


}
