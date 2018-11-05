


import { Signos } from './../../_model/signos';
import { SignosService } from './../../_service/signos.service';
import { MatTableDataSource, MatSnackBar, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  dataSource: MatTableDataSource<Signos>
  displayedColumns = ['idSignos', 'fecha', 'temperatura', 'acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;

  constructor(private signosService: SignosService, private snackBar: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit() {

    this.signosService.signosCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signosService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', { duration: 2000 });
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });*/

    this.signosService.listarPageable(0, 10).subscribe(data => {      
      console.log(data);
      let pacientes = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;
      this.dataSource = new MatTableDataSource(pacientes);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(idPaciente: number){
    this.signosService.eliminar(idPaciente).subscribe(data => {
      this.signosService.listar().subscribe(data => {
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next('Se eliminó');
      });      
    });
  }

  mostrarMas(e : any){
    console.log(e);
    this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
    let pacientes = JSON.parse(JSON.stringify(data)).content;
    this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

    this.dataSource= new MatTableDataSource(pacientes);
    this.dataSource.sort = this.sort;
    });
  }
 
  openDialog(signos: Signos){
    let med = signos != null ? signos : new Signos();
     
    this.dialog.open(SignosModalComponent, {
      width: '450px',
      disableClose: true,
      data: med
    })
  }
}
