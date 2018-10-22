import { Paciente } from './paciente';
export class Signos {
    idSignos: number;
    fecha: string;
    temperatura: string;
    pulso: string;
    ritmoRespiratorio: string;    
    paciente: Paciente;
}