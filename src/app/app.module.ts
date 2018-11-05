import { NuevoPacienteComponent } from './pages/signos2/signos2-edicion/nuevo-paciente/nuevo-paciente.component';
import { Signos2EdicionComponent } from './pages/signos2/signos2-edicion/signos2-edicion.component';

import { ServerErrorsInterceptor } from './_shared/server-errors.interceptor';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MedicoComponent } from './pages/medico/medico.component';
import { DialogoComponent } from './pages/medico/dialogo/dialogo.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { EspecialComponent } from './pages/consulta/especial/especial.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { DialogoDetalleComponent } from './pages/buscar/dialogo-detalle/dialogo-detalle.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoginComponent } from './login/login.component';
import { Not403Component } from './pages/not403/not403.component';
import { RecuperarComponent } from './login/recuperar/recuperar.component';
import { TokenComponent } from './login/recuperar/token/token.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SignosComponent } from './pages/signos/signos.component';
import { Signos2Component } from './pages/signos2/signos2.component';

import { PacientesDialogComponent } from './pages/paciente/pacientes-dialog/pacientes-dialog.component';

import { SignosEdicionComponent } from './pages/signos/signos-edicion/signos-edicion.component';

@NgModule({
  declarations: [
    AppComponent,
    PacienteComponent,
    PacienteEdicionComponent,
    MedicoComponent,
    DialogoComponent,
  
    ExamenComponent,
    ExamenEdicionComponent,
    EspecialidadComponent,
    EspecialidadEdicionComponent,
    ConsultaComponent,
    EspecialComponent,
    BuscarComponent,
    DialogoDetalleComponent,
    ReporteComponent,
    LoginComponent,
    Not403Component,
    RecuperarComponent,
    TokenComponent,
    PerfilComponent,
    SignosComponent,    
    Signos2Component,
    Signos2EdicionComponent,
    NuevoPacienteComponent,
    PacientesDialogComponent
    
    
  ],
  entryComponents: [DialogoComponent, DialogoDetalleComponent,PacientesDialogComponent, Signos2EdicionComponent, NuevoPacienteComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PdfViewerModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ServerErrorsInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
