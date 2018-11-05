import { MatDialog, MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from './../../../_model/paciente';
import { SignosService } from './../../../_service/signos.service';
import { Signos } from './../../../_model/signos';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NuevoPacienteComponent } from './nuevo-paciente/nuevo-paciente.component';

@Component({
	selector: 'app-signos-edicion',
	templateUrl: './signos2-edicion.component.html',
	styleUrls: ['./signos2-edicion.component.css']
})
export class Signos2EdicionComponent implements OnInit {

	signos: Signos;
	form: FormGroup;
	myControlPaciente: FormControl = new FormControl();
	pacientes: Paciente[] = [];
	mensaje: string;
	filteredOptions: Observable<any[]>;
	pacienteSeleccionado: Paciente;
	fechaSeleccionada: Date = new Date();
	
	message: string = 'Snack Bar opened';
	actionButtonLabel: string = 'Aviso';
	action: boolean = true;
	setAutoHide: boolean = true;
	autoHide: number = 2000;
	horizontalPosition: MatSnackBarHorizontalPosition = 'right';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	@ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
	@ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;

	subscription: any;

	config = new MatSnackBarConfig();

	constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<Signos2EdicionComponent>, @Inject(MAT_DIALOG_DATA) public data: Signos, private pacienteService: PacienteService, private signosService: SignosService, public snackBar: MatSnackBar, private dialog: MatDialog) { 
		this.form = builder.group({
			'paciente': this.myControlPaciente,
			'idSigno': new FormControl(this.data.idSignos),
			'fecha': new FormControl(new Date(this.data.fecha)).value,
			'temperatura': new FormControl(this.data.temperatura),
			'pulso': new FormControl(this.data.pulso),
			'ritmo': new FormControl(this.data.ritmoRespiratorio)
		});

		this.config.verticalPosition = this.verticalPosition;
		this.config.horizontalPosition = this.horizontalPosition;
		this.config.duration = this.setAutoHide ? this.autoHide : 0;
	}

	ngOnInit() {
		this.pacienteService.pacienteCambio.subscribe(data => {
			this.listarPacientes();	
		});

		this.listarPacientes();

		this.signos = new Signos();
		this.signos.idSignos = this.data.idSignos;
		this.signos.paciente = this.data.paciente;
		this.signos.fecha = new FormControl(new Date(this.data.fecha)).value;
		this.signos.temperatura = this.data.temperatura;
		this.signos.pulso = this.data.pulso;
		this.signos.ritmoRespiratorio = this.data.ritmoRespiratorio;

		this.filteredOptions = this.myControlPaciente.valueChanges.pipe(startWith(''), map(val =>  this.filter(val)));
	}

	cancelar() {
		this.dialogRef.close();
	}
	 
	operar() {		
		if (this.signos != null && this.signos.idSignos > 0) {
			if (this.signos.paciente != null && this.signos.fecha != null && this.signos.temperatura != null && this.signos.pulso != null && this.signos.ritmoRespiratorio != null) {
				this.signos.paciente = this.pacienteSeleccionado ? this.pacienteSeleccionado : this.signos.paciente;
				this.signosService.modificar(this.signos).subscribe(data => {
					this.signosService.listar().subscribe(signosRx => {
						this.signosService.signosCambio.next(signosRx);
						this.signosService.mensajeCambio.next("Se modifico");
					});
				});
				this.dialogRef.close();
			} else {
				this.mensaje = `Debe agregar un paciente o fecha o temperatura o pulso o ritmo para actualizar`;
				// this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
				this.snackBar.open(this.mensaje, this.action ? this.actionButtonLabel : undefined, this.config);
			}
		} else {
			
			this.signos.paciente = this.pacienteSeleccionado ? this.pacienteSeleccionado : this.signos.paciente;
			console.log(this.signos.paciente);
			if (this.signos.paciente != null && this.signos.fecha != null && this.signos.temperatura != null && this.signos.pulso != null && this.signos.ritmoRespiratorio != null) {
				this.signosService.registrar(this.signos).subscribe(data => {        
					this.signosService.listar().subscribe(signosRx => {
						this.signosService.signosCambio.next(signosRx);
						this.signosService.mensajeCambio.next("Se registro");
					});        
				});
				this.dialogRef.close();
			} else {
				this.mensaje = `Debe agregar un paciente o fecha o temperatura o pulso o ritmo para registrar`;
				this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
			}
		}
	}

	filter(val: any) {
		this.myControlPaciente.setValue = this.trigger.activeOption.value;
		if (val != null && val.idPaciente > 0) {
			console.log('IF');
		  	return this.pacientes.filter(option =>
				option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni) ||(option.nombres.toLowerCase() + ' ' + option.apellidos.toLowerCase()).includes(val.nombres.toLowerCase() + ' ' + val.apellidos.toLowerCase()) || 				    (option.nombres.toLowerCase() + ' ').includes(val.nombres.toLowerCase() + ' '));
		} else {
			console.log('ELSE');
			if (typeof val === "object") {
				console.log('OBJECT');
				return this.pacientes.filter(option =>
					option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni) || (option.nombres.toLowerCase() + ' ' + option.apellidos.toLowerCase()).includes(val.nombres.toLowerCase() + ' ' + val.apellidos.toLowerCase()) || 
					(option.nombres.toLowerCase() + ' ').includes(val.nombres.toLowerCase() + ' '));
			} else {
				console.log('NO OBJECT');
				return this.pacientes.filter(option =>
					option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val) || 
					(option.nombres.toLowerCase() + ' ' + option.apellidos.toLowerCase()).includes(val.toLowerCase()) || 
				    	(option.nombres.toLowerCase() + ' ').includes(val.toLowerCase() + ' ')); 
			}
		}
	}

	displayFn(val: Paciente) {
		return val ? `${val.nombres} ${val.apellidos}` : val;
	}
	 
	listarPacientes() {
		this.pacienteService.listar().subscribe(data => {
		  	this.pacientes = data;
		});
	}

	seleccionarPaciente(e: any){console.log(e);		
		this.pacienteSeleccionado = e.option.value;
	}

	onClose() {
		this.dialogRef.close();
	}

	agregarPaciente() {
    		const dialogPaciente = this.dialog.open(NuevoPacienteComponent, {
      		width: "50%",
      		autoFocus: true,
      		// height: '370px',
      		disableClose: true
		});
		    
		dialogPaciente.afterClosed().subscribe(result => {
			// console.log(result);
			this.listarPacientes();
			this.signos.paciente = result;
		});
	}

	highlightFirstOption(event): void {
		console.log(this.trigger.activeOption.value);
		console.log(this.myControlPaciente.value);
		console.log(this.pacientes.indexOf(this.myControlPaciente.value));
		this.myControlPaciente.setValue = this.trigger.activeOption.value;
		if (event.key == "ArrowDown" || event.key == "ArrowUp") {
			return;
		}
		this.matAutocomplete._keyManager.setFirstItemActive();
		// this.seleccionarPaciente(event);
		// console.log('LO USA-2');
	}

	validateChoise() {
		console.log(this.trigger.activeOption.value);
		console.log(this.myControlPaciente.value);
		console.log(this.pacientes.indexOf(this.myControlPaciente.value));
	}
}