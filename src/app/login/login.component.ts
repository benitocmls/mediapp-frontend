import { MenuService } from './../_service/menu.service';
import { Router } from '@angular/router';
import { TOKEN_NAME,USER_NAME,ROL_NAME } from './../_shared/var.constant';
import { Component, OnInit } from '@angular/core';
import '../login-animation.js';
import { LoginService } from '../_service/login.service.js';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string = "";
  error: string = "";

  constructor(private loginService: LoginService, private menuService: MenuService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

  iniciarSesion() {
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      //console.log(data);
      if (data) {
        let token = JSON.stringify(data);
        sessionStorage.setItem(TOKEN_NAME, token);
         


        let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
        const decodedToken = decode(tk.access_token);
        sessionStorage.setItem(USER_NAME, decodedToken.user_name);       
         
        this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
          this.menuService.menuCambio.next(data);
        });

        this.router.navigate(['paciente']);
      }
    });
  }

}
