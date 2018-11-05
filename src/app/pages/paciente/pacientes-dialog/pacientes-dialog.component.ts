import { PacienteService } from './../../../_service/paciente.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Paciente } from './../../../_model/paciente';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-pacientes-dialog',
  templateUrl: './pacientes-dialog.component.html',
  styleUrls: ['./pacientes-dialog.component.css']
})
export class PacientesDialogComponent implements OnInit {
  paciente: Paciente;
  form: FormGroup;
  constructor(public dialogPaciente: MatDialogRef<PacientesDialogComponent>,public router: Router,@Inject(MAT_DIALOG_DATA) public data: boolean, private route: ActivatedRoute,private pacienteService: PacienteService) {
    this.paciente = new Paciente();
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombres' : new FormControl(''),
      'apellidos' : new FormControl(''),
      'dni' : new FormControl(''),
      'direccion' : new FormControl(''),
      'telefono' : new FormControl('')
    });
   }

  ngOnInit() {
    //this.medico = this.data;
    
     
  }
  operar(){
    let idSignos: number;
    let myData : any;
    this.paciente.idPaciente = this.form.value['id'];
    this.paciente.nombres = this.form.value['nombres'];
    this.paciente.apellidos = this.form.value['apellidos'];
    this.paciente.dni = this.form.value['dni'];
    this.paciente.direccion = this.form.value['direccion'];
    this.paciente.telefono = this.form.value['telefono'];
    this.pacienteService.registrar(this.paciente).subscribe(data => {
      myData=data;
      console.log("data "+myData.code);
            this.pacienteService.listar().subscribe(pacientes =>{
              this.pacienteService.pacienteCambio.next(pacientes);
            });
        
        this.pacienteService.mensajeCambio.next('Se registró');
        this.router.navigate(['signos/nuevo']);
        this.dialogPaciente.close(myData.code);
    });
  }
  cancelar(){
    this.dialogPaciente.close();
  }
}
