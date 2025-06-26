import { Database } from "./database";
import PromptSync from "prompt-sync";
import { patientGiven, patientCreate, patientDelete, patientList, patientID, patientListObj } from "./patient-crud";
import { QueuePriorityHospital, } from "./classes/queuePriorityHospital";
import { nurseID, nurseList, nurseListObj } from "./nurse-crud";
import { screeningCreate, screeningDelete, screeningList, screeningListObj, patientListScreening} from "./screening-crud";
import { getDateTime } from "./utils/dateTime";
import { CreateListPatient, CreateListNurse, CreateListScreening } from "./utils/setUpQueue";
import { PatientModel } from "./models/patientModel";
import { ScreeningModel } from "./models/screeningModel";
import { getMinutesBetweenDates } from "./utils/dateTime";

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
    
    option = parseInt(prompt('Escolha uma opção digitando um número:'))
    console.log();
    
    switch (option) {
        case 1:
            console.clear();
            const name = prompt(`Digite o nome do paciente: `);         
            const dateOfBirth = prompt(`Digite a data de nascimento do paciente: `);         
            const cpf = prompt(`Digite o CPF do paciente: `);         
            const sex = prompt(`Digite o sexo do paciente: `);         
            const phone = prompt(`Digite o telefone do paciente: `);         
            const susCard = prompt(`Digite o cartão do SUS do paciente: `);   
            console.log();      
            
            patientCreate(name,dateOfBirth, cpf, sex, phone, susCard);
            break;
        
        case 2:
            console.clear();
            patientList();
            const cpfRemove = prompt(`Digite o cpf do paciente que você deseja remover: `);
            console.log();
            patientDelete(cpfRemove);
            break;

        case 3:
            console.clear();
            patientList();
            const cpfPatient = prompt(`Digite qual o cpf do paciente: `);
            console.log();
            patientGiven(cpfPatient);
            break;

        case 4:
            console.clear();
            patientListScreening();
            let patientId: unknown;
            while(patientId === undefined) {
                const cpfPatient2 = prompt(`Digite o CPF do paciente que deseja efetuar a triagem: `);
                const idPatient = patientID(cpfPatient2);
                const sql = 'SELECT * FROM Triagem WHERE paciente_id=?'
                const patientInScreening = Database.queryOne<ScreeningModel>(sql, [idPatient]);
                if(patientInScreening?.paciente_id !== undefined) {
                    throw new Error(`O paciente de cpf ${cpfPatient2} já está na fila da triagem.`);
                }

                console.log();
                patientId = patientID(cpfPatient2);
            };

            nurseList();
            let nurseId: unknown;
            while(nurseId === undefined) {
                const nurseCoren = prompt(`Digite o coren do enfermeiro que está efetuando a triagem: `)
                console.log();
                nurseId = nurseID(nurseCoren);
            }
            
            const dateTimeScreening = getDateTime();

            console.log(`Preencha os dados da triagem do paciente: `)   
            
            console.log();

            const symptoms = prompt(`Sintomas: `);         
            const pressure = prompt(`Pressão arterial: `);         
            const temperature = Number(prompt(`Temperatura: `));         
            const heartFrequency = Number(prompt(`Frequência cardiaca: `));      
            console.log();
            console.log(`Classificações de prioridade:`);
            console.log();
            console.log(`0 - Vermelho(Emergência)`);   
            console.log(`1 - Laranja(Muito urgente)`);   
            console.log(`2 - Amarelo(Urgente)`);   
            console.log(`3 - Verde(Pouco urgente)`);   
            console.log(`4 - Azul(Não urgente)`); 
            console.log();  

            let patientPriority: number;

            while(true){
                patientPriority = Number(prompt(`Defina uma das opções: `));
                if (patientPriority >= 0 && patientPriority <= 4) break;
                console.log(`Número invalido.`);
            }
            console.log();

            screeningCreate(dateTimeScreening, symptoms, pressure, temperature, heartFrequency, patientId, nurseId, patientPriority)

            console.log(); 
            break;

        case 5:
            console.clear();
            patientList();
            let cpfRemoveScreening: string;
            let patientIdRemoveScreening: number | unknown;
            let breakCondition = true;

            while(breakCondition) {
                cpfRemoveScreening = prompt(`Digite o CPF do paciente que deseja deletar as triagens: `)
                patientIdRemoveScreening = patientID(cpfRemoveScreening);

                if (patientIdRemoveScreening !== undefined) {
                    breakCondition = false;
                }
                console.log();
            } 
            screeningDelete(patientIdRemoveScreening);
            break;

        case 6:
            console.clear();
            const screenings = screeningList();
            console.log(screenings);
            console.log();
            break;
        
        case 7:
            console.clear();
            const listPatient = patientListObj();
            const listNurse = nurseListObj();
            const listScreening = screeningListObj(); 
            const patients = CreateListPatient(listPatient);
            const nurses = CreateListNurse(listNurse);
            const screenigs = CreateListScreening(listScreening, patients, nurses);
            const queuePriorityHospital = new QueuePriorityHospital();

            for(let i = 0; i < screenigs.length; i++) {
                queuePriorityHospital.queueForTriage(screenigs[i]);
            }

            queuePriorityHospital.callNext();
            if(queuePriorityHospital.nextItem !== undefined) {
                console.log(`Paciente ${queuePriorityHospital.nextItem.patient.name}, Por favor dirigir-se a sala do médico.`);
            } else {
                console.log(`Não há mais pacientes na fila de espera.`);
            }

            console.log();
            break;

        case 8:
            console.clear();
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