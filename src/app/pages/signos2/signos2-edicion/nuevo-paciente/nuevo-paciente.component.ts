import { MatSnackBar } from '@angular/material';
import { PacienteService } from './../../../../_service/paciente.service';
import { Paciente } from './../../../../_model/paciente';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-nuevo-paciente',
	templateUrl: './nuevo-paciente.component.html',
	styleUrls: ['./nuevo-paciente.component.css']
})
export class NuevoPacienteComponent implements OnInit { 
	
	paciente: Paciente;

	constructor(private dialogRef: MatDialogRef<NuevoPacienteComponent>, @Inject(MAT_DIALOG_DATA) public data: Paciente, private pacienteService: PacienteService, public snackBar: MatSnackBar) {	}

	ngOnInit() {
		this.paciente = new Paciente();
	}

	onClose() {
		this.dialogRef.close();
	}

	operar() {
		if (this.paciente != null) {
			this.pacienteService.registrar(this.paciente).subscribe(data => {
				this.pacienteService.listar().subscribe(pacientes => {
					this.pacienteService.pacienteCambio.next(pacientes);
					this.pacienteService.mensajeCambio.next('Se registró');
				});
				// console.log(this.paciente.nombres);
				// this.onClose();
				this.dialogRef.close(this.paciente);
			});
		}		
	}
}