import { USER_NAME,ROL_NAME,TOKEN_NAME } from './../../_shared/var.constant';
import { Component, OnInit } from '@angular/core';
import * as decode from 'jwt-decode';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  username: string;
  roles: string[];
  constructor() {
    
   }

  ngOnInit() {
    this.username=sessionStorage.getItem(USER_NAME);
    let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
    const decodedToken = decode(tk.access_token);    
    
    this.roles=decodedToken.authorities;
  }

}
