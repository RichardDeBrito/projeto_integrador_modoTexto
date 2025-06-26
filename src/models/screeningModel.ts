import { typePriority } from "../classes/queuePriority";

export type ScreeningModel = {
    id_triagem: number;
    data_hora_triagem: string;
    sintomas: string;
    pressao: string;
    temperatura: number;
    frequencia_cardiaca: number;
    paciente_id: number;
    enfermeiro_id: number;
    prioridade_id: typePriority;

}