import { Database } from "./database";
import { PatientModel } from "./models/patientModel";
import { patientID } from "./patient-crud";
import { ScreeningModel } from "./models/screeningModel";
import { nurseID, nurseList } from "./nurse-crud";
import PromptSync from "prompt-sync";
import { getDateTime } from "./utils/dateTime";

const prompt = PromptSync();

export function screeningCreate(dateTimeScreening: string, symptoms: string, pressure: string, temperature: number, heartFrequency: number, patientId: number | unknown, nurseId: number | unknown, priorityId: number): void {
    
    try {
        const sql = 'INSERT INTO Triagem (data_hora_triagem, sintomas, pressao, temperatura, frequencia_cardiaca, paciente_id, enfermeiro_id, prioridade_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        Database.queryNone(sql, [dateTimeScreening, symptoms, pressure, temperature, heartFrequency, patientId, nurseId, priorityId]);

        console.clear();

        console.log(`Triagem efetuada com sucesso!`)
        console.log();
        
    } catch (error) {
        console.log(`Erro ao inserir paciente: ${error as Error}.message`);
    }
}

export function screeningList(): ScreeningModel[] | undefined {
    try {
        const sql = 'SELECT T.data_hora_triagem, T.sintomas, T.temperatura, T.frequencia_cardiaca, P.nome AS nome_paciente, E.nome AS nome_enfermeiro, Pri.cor AS cor_prioridade FROM Triagem AS T JOIN Paciente AS P ON T.paciente_id = P.id_paciente JOIN Enfermeiro AS E ON E.id_enfermeiro = enfermeiro_id JOIN Prioridade AS Pri ON T.prioridade_id = Pri.id_prioridade'
        const data = Database.queryMany<ScreeningModel>(sql);

        return data;

    } catch (error){
         console.log(`Erro ao listar triagens: ${error as Error}.message`);
    }
};

export function printScreening(): void {
    console.clear();
    const screenings = screeningList();
    if(screenings?.length === 0) {
        console.log(`Não há triagens cadastradas.`) 
    } else {
        if(screenings === undefined) throw new Error('Erro ao listar triagens.');
        for(const screening of screenings) {
            console.log(screening);
        };
        console.log();
    }
}

export function screeningListObj(): ScreeningModel[] | undefined {
    try {
        const sql = 'SELECT * FROM Triagem'
        const data = Database.queryMany<ScreeningModel>(sql);

        return data;

    } catch (error){
         console.log(`Erro ao listar triagens: ${error as Error}.message`);
    }
};

export function screeningDelete(patientId: unknown) {
    try { 
        const sql = 'DELETE FROM Triagem WHERE paciente_id = ?';
        Database.queryNone(sql, [patientId]); 

        console.clear();
        console.log(`Paciente removido da fila de triagem.`);
        console.log();
    } catch (error) {
        console.log(`Erro ao deletar paciente: ${error as Error}.message`);
        console.log();
    }
}

export function patientScreening() {
    try {
        console.clear();
        patientListScreening();
        let patientId: unknown;
        while(patientId === undefined) {
            let cpfPatient = prompt(`Digite o CPF do paciente que deseja efetuar a triagem: `);
            let idPatient = patientID(cpfPatient);
            const sql = 'SELECT * FROM Triagem WHERE paciente_id=?'
            const patientInScreening = Database.queryOne<ScreeningModel>(sql, [idPatient]);
            if(patientInScreening?.paciente_id !== undefined) {
                throw new Error(`O paciente de cpf ${cpfPatient} já está na fila da triagem.`);
            }
        
            console.log();
            patientId = patientID(cpfPatient);
        };
        
        console.clear();
        nurseList();
        let nurseId: unknown;
        while(nurseId === undefined) {
            let nurseCoren = prompt(`Digite o coren do enfermeiro que está efetuando a triagem: `).toUpperCase();
            if(nurseCoren === null) {
            };
            console.log();
            nurseId = nurseID(nurseCoren);
        }
                    
        const dateTimeScreening = getDateTime();
        console.clear();
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
    } catch(error) {
        console.error(`Falha ao tentar listar pacientes em triagem: ${error as Error}.message`);
    }
}

export function patientListScreening() {
    try {
        const sql = 'SELECT P.nome, P.cpf FROM Paciente AS P LEFT JOIN Triagem AS T ON P.id_paciente = T.paciente_id WHERE T.paciente_id IS NULL';
        const patientsScreening = Database.queryMany<PatientModel>(sql);

        console.log('Pacientes que ainda não efetuaram triagem: ')
        console.log();

        for(const patient of patientsScreening) {
            console.log(`Nome: ${patient.nome} CPF: ${patient.cpf}`);
            console.log();
        }
    } catch(error) {
        console.error(`Falha ao tentar listar pacientes em triagem: ${error as Error}.message`);
    }
}

export function patientListNotScreening(): PatientModel[] | undefined {
    const sql = 'SELECT P.nome, P.cpf FROM Paciente AS P INNER JOIN Triagem AS T ON P.id_paciente = T.paciente_id';
    const patientsInScreening = Database.queryMany<PatientModel>(sql);
    
    if (patientsInScreening.length === 0) {
        return undefined;
    } else {
        return patientsInScreening;
    }
}

export function deleteFromScreening(): void {
    console.clear(); 
    const patientsInScreening = patientListNotScreening();
                
    if (!patientsInScreening) {
        console.log('Não há pacientes na fila de triagem.');
        console.log();
        return;
    }
    
    console.log('Pacientes na fila de triagem:');
    console.log();
    if (patientsInScreening === undefined) throw new Error(`Valor indefinido`);
    for (const patient of patientsInScreening) {
        console.log(`Nome: ${patient.nome} CPF: ${patient.cpf}`);
        console.log();
    }
    
    while (true) {
        const cpfRemoveScreening = prompt(`Digite o CPF do paciente que deseja deletar a triagem: `);
        const patientIdRemoveScreening = patientID(cpfRemoveScreening);
    
        if (patientIdRemoveScreening !== undefined) {
            screeningDelete(patientIdRemoveScreening);
            break;
        } else {
            console.log('CPF inválido. Tente novamente.');
            console.log();
        }
    }
}