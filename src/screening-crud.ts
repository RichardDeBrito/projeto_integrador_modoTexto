import { Database } from "./database";
import { PatientModel } from "./models/patientModel";
import { ScreeningModel } from "./models/screeningModel";

export function screeningCreate(dateTimeScreening: string, symptoms: string, pressure: string, temperature: number, heartFrequency: number, patientId: number | unknown, nurseId: number | unknown, priorityId: number): void {
    
    try {
        const sql = 'INSERT INTO Triagem (data_hora_triagem, sintomas, pressao, temperatura, frequencia_cardiaca, paciente_id, enfermeiro_id, prioridade_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        Database.queryNone(sql, [dateTimeScreening, symptoms, pressure, temperature, heartFrequency, patientId, nurseId, priorityId]);

        console.log(`Triagem efetuada com sucesso!`)
        console.log();
        
    } catch (error) {
        console.log(`Erro ao inserir paciente: ${error as Error}.message`);
    }
}

export function screeningList(): object | undefined {
    try {
        const sql = 'SELECT T.data_hora_triagem, T.sintomas, T.temperatura, T.frequencia_cardiaca, P.nome AS nome_paciente, E.nome AS nome_enfermeiro, Pri.cor AS cor_prioridade FROM Triagem AS T JOIN Paciente AS P ON T.paciente_id = P.id_paciente JOIN Enfermeiro AS E ON E.id_enfermeiro = enfermeiro_id JOIN Prioridade AS Pri ON T.prioridade_id = Pri.id_prioridade'
        const data = Database.queryMany<ScreeningModel>(sql);

        return data;

    } catch (error){
         console.log(`Erro ao listar triagens: ${error as Error}.message`);
    }
};

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

        console.log(`As triagens do paciente foram apagadas com sucesso.`)
        console.log();
    } catch (error) {
        console.log(`Erro ao deletar paciente: ${error as Error}.message`);
        console.log();
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