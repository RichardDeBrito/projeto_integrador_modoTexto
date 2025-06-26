import { Database } from "./database";
import PromptSync from "prompt-sync";
import { patientGiven, patientCreate, patientDelete, patientList, callNextPatient } from "./patient-crud";
import {deleteFromScreening,printScreening, patientScreening} from "./screening-crud";

const dbFilename = './src/database.db'
Database.connect(dbFilename);
const prompt = PromptSync();

let loopCondition: boolean;
loopCondition = true;

while(loopCondition) {
    let option: number;
    console.log();
    console.log( "-".repeat(48));
    console.log(' Sistema de Gerenciamento de Fila de Prioridade');
    console.log( "-".repeat(48));
    console.log();
    
    console.log(`1 - Cadastrar pacientes:`);
    console.log(`2 - Remover pacientes por CPF:`);
    console.log(`3 - Buscar dados do paciente por CPF:`);
    console.log(`4 - Triar pacientes:`);
    console.log(`5 - Apagar triagem do paciente por CPF:`);
    console.log(`6 - Apresentar triagens cadastradas:`);
    console.log(`7 - Chamar o próximo paciente da fila:`);
    console.log(`8 - Verificar pacientes cadastrados:`);
    console.log(`0 - Sair do programa:`);
    
    console.log();
    
    option = parseInt(prompt('Escolha uma opção digitando um número: '));
    console.log();
    
    switch (option) {
        case 1:
            patientCreate();
            break;
        
        case 2:
            patientDelete();
            break;

        case 3:
            patientGiven();
            break;

        case 4:
            patientScreening();
            break;

        case 5:
            deleteFromScreening();
            break;

        case 6:
            printScreening();
            break;
        
        case 7:
            callNextPatient();
            break;

        case 8:
            patientList();
            break;

        case 0:
            console.clear();
            Database.disconnect();
            loopCondition = false;

        default:
            break;
    }
}