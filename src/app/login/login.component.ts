import { AngularFireAuth } from '@angular/fire/auth';
import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { ToastrService } from 'ngx-toastr';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  show: boolean = false;

  password() {
    this.show = !this.show;
  }

  constructor(private afAuth: AngularFireAuth,
    private FirebaseService: FirebaseService, private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();

    setTimeout(() => {
      this.spinnerService.hide();
    }, 2000);
  }


  signIn(f) {
    if (f.value.email != "admin@gmail.com") {
      this.toastr.warning('ليس لديك صلاحية الدخول ', 'خطأ');
    } else {
      this.spinnerService.show();
      this.FirebaseService.login(f.value.email, f.value.password).then((user) => {
        this.storage.set(STORAGE_KEY, this.afAuth.auth.currentUser);
        this.router.navigate(['dashboard']);
      }, (err) => {
        this.spinnerService.hide();
        this.toastr.warning('البريد الالكتروني او كلمة المرور غير صحيحة', 'خطأ');
      });
    }
  }
}
