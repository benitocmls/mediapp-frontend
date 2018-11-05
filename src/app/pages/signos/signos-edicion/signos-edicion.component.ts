import { PacientesDialogComponent } from './../../paciente/pacientes-dialog/pacientes-dialog.component';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { SignosService } from './../../../_service/signos.service';
import { PacienteService } from './../../../_service/paciente.service';
// import { SignosDialogComponent } from './../signos-dialog/signos-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Signos } from './../../../_model/signos';
import { Paciente } from './../../../_model/paciente';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  signos: Signos;
  pacienteSeleccionado: Paciente;
  filteredOptions: Observable<any[]>;
  filteredOptionsMedico: Observable<any[]>;
  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();
  maxFecha: Date = new Date();
  pacientes: Paciente[] = [];
  id: number;
  idPacienteNuevo:number;
  edicion: boolean = false;
  paciente: Paciente;
  constructor(private route: ActivatedRoute, private builder: FormBuilder, private dialog: MatDialog, private pacienteService: PacienteService, private signosService: SignosService, public snackBar: MatSnackBar, public router: Router) {
    this.form = builder.group({
      'paciente': this.myControlPaciente,
      'idSignos': new FormControl(0),
      'fecha': new FormControl(),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });
  }
  ngOnInit() {
    this.pacienteService.pacienteCambio.subscribe(data => {
			this.listarPacientes();	
		});

    console.log("signos "+this.signos);
    if(this.signos==undefined)
    this.signos = new Signos();
    
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
      this.filteredOptions = this.myControlPaciente.valueChanges
        .pipe(
        startWith<string | Paciente>(''),
        map(value => typeof value === 'string' ? value : value.apellidos),
        map(name => name ? this.filter(name) : this.pacientes.slice())
        );
    });
  }
  initForm() {
    console.log("pintar Signos pulso "+this.signos.pulso);
    if (this.edicion) {
      //cargar la data del servicio en el form
      this.signosService.listarsignosPorId(this.id).subscribe(data => {
        this.myControlPaciente = new FormControl(data.paciente);
        if (data.fecha != null || data.fecha != undefined) {
          let localISOTime = (new Date(data.fecha)).toISOString();
          this.signos.fecha = localISOTime;
        }
        this.paciente = data.paciente;
        this.signos.idSignos = data.idSignos;
        //this.signos.paciente = data.paciente;
        this.signos.temperatura = data.temperatura;
        this.signos.pulso = data.pulso;
        this.signos.ritmoRespiratorio = data.ritmoRespiratorio;
        this.listarPacientes();


        this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
      });
    }else if(this.idPacienteNuevo!=undefined){
      console.log("pintar Signos");
      this.signosService.listarsignosPorId(this.idPacienteNuevo).subscribe(data => {
        this.myControlPaciente = new FormControl(data.paciente);
        if (data.fecha != null || data.fecha != undefined) {
          let localISOTime = (new Date(data.fecha)).toISOString();
          this.signos.fecha = localISOTime;
        }
        this.paciente = data.paciente;
        this.signos.paciente = data.paciente;
        this.signos.idSignos = this.form.value['idSignos'];
        this.signos.fecha = this.form.value['fecha'];
        this.signos.pulso = this.form.value['pulso'];
        this.signos.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
        this.signos.temperatura = this.form.value['temperatura']; 
        this.listarPacientes();
        console.log("pintar Signos");

        this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
      });
     
     
    }
  }




  displayFn(val: Paciente) {

    return val ? `${val.nombres} ${val.apellidos}` : val;
  }
  seleccionarPaciente(e: any) {
    //console.log(e);
    this.pacienteSeleccionado = e.option.value;
  }
  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }
  filter(val: any) {
    console.log("paciente " + this.pacientes);
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  operar() {
    this.signos.idSignos = this.form.value['idSignos'];

    this.signos.fecha = this.form.value['fecha'];
    this.signos.pulso = this.form.value['pulso'];
    this.signos.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    this.signos.temperatura = this.form.value['temperatura'];
    if (this.edicion) {
      if (this.pacienteSeleccionado == undefined) {
        this.signos.paciente = this.paciente;
      } else {
        this.signos.paciente = this.pacienteSeleccionado;
      }


      this.signosService.modificar(this.signos).subscribe(data => {
        this.signosService.listar().subscribe(signosLista => {
          this.signosService.signosCambio.next(signosLista);
          this.signosService.mensajeCambio.next('Se modificó');
        });
      });


    } else {
      this.signos.paciente = this.pacienteSeleccionado;
      this.signosService.registrar(this.signos).subscribe(data => {
        this.signosService.listar().subscribe(signosLista => {
          this.signosService.signosCambio.next(signosLista);
          this.signosService.mensajeCambio.next('Se registro');
        });




      });

    }
    this.router.navigate(['signos'])
  }


  limpiarControles() {
    this.listarPacientes();


    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
    this.pacienteSeleccionado = null;

  }
  openDialog() {
    if(this.pacienteSeleccionado==undefined){
      this.signos.paciente =this.paciente;
    }else{
      this.signos.paciente =this.pacienteSeleccionado;
    }
      
    this.signos.idSignos = this.form.value['idSignos'];
    this.signos.fecha = this.form.value['fecha'];
    this.signos.pulso = this.form.value['pulso'];
    this.signos.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    this.signos.temperatura = this.form.value['temperatura']; 
    console.log("temp "+this.signos.temperatura);
    const dialogRef = this.dialog.open(PacientesDialogComponent, {
      width: '250px',
      data: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result "+result);
       
      this.idPacienteNuevo=parseInt(result);
      this.listarPacientes();  
        
         
    });
  }
  
}
