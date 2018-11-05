import { Signos2EdicionComponent } from './signos2-edicion/signos2-edicion.component';
import { SignosService } from './../../_service/signos.service';
import { Signos } from './../../_model/signos';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signos',
  templateUrl: './signos2.component.html',
  styleUrls: ['./signos2.component.css']
})
export class Signos2Component implements OnInit {

  displayedColumns = ['idSignos', 'nombres', 'fecha', 'temperatura', 'pulso', 'ritmo', 'acciones'];
  dataSource: MatTableDataSource<Signos>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private signosService: SignosService, private dialog: MatDialog, private snackBar : MatSnackBar) { }

  ngOnInit() {
    this.signosService.signosCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signosService.mensajeCambio.subscribe(data => {      
      this.snackBar.open(data, 'Aviso', { duration: 2000 });
    });

    this.signosService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(signos: Signos){
    let med = signos != null ? signos : new Signos();
    // console.log(med.fecha);
    this.dialog.open(Signos2EdicionComponent, {
      width: "50%",
      autoFocus: true,
      // height: '370px',
      disableClose: true,
      data: med
    })
  }

  eliminar(signos: Signos){
    this.signosService.eliminar(signos.idSignos).subscribe( data => {
      this.signosService.listar().subscribe(signosX => {
        this.signosService.signosCambio.next(signosX);
        this.signosService.mensajeCambio.next("Se elimino");
      });
    });
  }

}