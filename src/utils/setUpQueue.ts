import { Database } from "../database";
import { QueuePriorityHospital } from "../classes/queuePriorityHospital";
import { Patient } from "../classes/patient";
import { Nurse } from "../classes/nurse";
import { Screening } from "../classes/screening";
import { PatientModel } from "../models/patientModel"; 
import { ScreeningModel } from "../models/screeningModel";
import { NurseModel } from "../models/nurseModel";
import { ConvertDateTime } from "./convertDateTime";

export function CreateListPatient(arrayPatientObj: PatientModel[] | undefined): Patient[] {
    const listPatient: Patient[] = [];
    let newPatient: Patient;

    if(arrayPatientObj === undefined) {
        throw new Error(`Undefined.`);
    } else {
        for(const patientObj of arrayPatientObj) {  
        newPatient = new Patient(patientObj.id_paciente, patientObj.nome, patientObj.datanasc, patientObj.cpf, patientObj.sexo, patientObj.telefone, patientObj.sus_card);

        listPatient.push(newPatient);
    }

    return listPatient;

    }
}

export function CreateListNurse(arrayNurseObj: NurseModel[] | undefined): Nurse[] {
    const listNurse: Nurse[] = [];
    let newNurse: Nurse;

    if(arrayNurseObj === undefined) {
        throw new Error(`Undefined`);
    } else {
        for(const nurseObj of arrayNurseObj) {  
        newNurse = new Nurse(nurseObj.id_enfermeiro, nurseObj.nome, nurseObj.coren);

        listNurse.push(newNurse);
        }

        return listNurse;
    }
}

export function CreateListScreening(arrayObjScreening: ScreeningModel[] | undefined, arrayPatient: Patient[], arrayNurse: Nurse[]): Screening[] {
    const listScreening: Screening[] = [];
    let newScreening: Screening;

    if(arrayObjScreening === undefined) {
        throw new Error(`Undefined`);
    } else {
        for(const screeningObj of arrayObjScreening) {
            newScreening = new Screening(ConvertDateTime(screeningObj.data_hora_triagem), screeningObj.sintomas, screeningObj.pressao, screeningObj.temperatura, screeningObj.frequencia_cardiaca, arrayPatient[screeningObj.paciente_id - 1], arrayNurse[screeningObj.enfermeiro_id - 1], screeningObj.prioridade_id);

            listScreening.push(newScreening);
        }

        return listScreening;
    }
}


// export function SetUpQueue(screeningList: Screening[]): void {
    
// }