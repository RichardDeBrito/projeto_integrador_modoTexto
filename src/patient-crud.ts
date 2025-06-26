import { Database } from "./database";
import { PatientModel, idPatientModel } from "./models/patientModel";
import { QueuePriorityHospital } from "./classes/queuePriorityHospital";
import PromptSync from "prompt-sync";
import { nurseListObj } from "./nurse-crud";
import { screeningListObj } from "./screening-crud";
import { CreateListNurse, CreateListPatient, CreateListScreening } from "./utils/setUpQueue";

export type patientData = 'name' | 'dateOfBirth' | 'cpf' | 'sex' | 'phone' | 'susCard';

const prompt = PromptSync();

export function callNextPatient() :void {
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
}

export function patientCreate(): void {
    console.clear();
    console.log();
    console.log( "-".repeat(22));
    console.log(' Cadastro de pcientes');
    console.log( "-".repeat(22));
    console.log();

    try {
        const name = prompt(`Digite o nome do paciente: `);         
        const dateOfBirth = prompt(`Digite a data de nascimento do paciente: `);         
        const cpf = prompt(`Digite o CPF do paciente: `);  
        
        let sex: string | null = null;

        while(true) {
            console.log();
            console.log('Digite um desses valores:');
            console.log();
            console.log(`M - masculino F - feminino`);
            console.log();
            const valueSex = prompt(`Sexo do paciente: `);
            if(valueSex === null) continue;
            
            const upperValueSex = valueSex.toUpperCase();
            if(upperValueSex === 'M' || upperValueSex === 'F') {
                sex = upperValueSex;
                break;
        }
            
            console.log();
            console.log('Valor invalido, digite M ou F');
            console.log();
        }
        
        const phone = prompt(`Digite o telefone do paciente: `);         
        const susCard = prompt(`Digite o cartão do SUS do paciente: `);   
        console.log();    

        const sql = 'INSERT INTO Paciente (nome, datanasc, cpf, sexo, telefone, sus_card) VALUES (?,?,?,?,?,?)';
        Database.queryNone(sql, [name, dateOfBirth, cpf, sex, phone, susCard]);

        console.clear();
        console.log(`Paciente ${name} cadastrado com sucesso!`);
        console.log();
        
    } catch (error) {
        console.error(`Erro ao inserir paciente: ${(error as Error).message}`);
    }
}

export function patientListObj(): PatientModel[] | undefined {
    try {
        const sql = 'SELECT * FROM Paciente'
        const data = Database.queryMany<PatientModel>(sql);
        
        return data;

    } catch (error){
        console.error(`Erro ao retornar lista de pacientes: ${error as Error}.message`);
    };
}

export function patientList(): void | undefined {
    console.clear();
    try {
        const sql = 'SELECT nome, datanasc, cpf, sexo, telefone, sus_card FROM Paciente'
        const data = Database.queryMany<PatientModel>(sql);

        if(data.length === 0) {
            console.log(`Não há pacientes cadastrados no sistema.`);
            } else {
                console.log(`Pacientes cadastrados: `);
                console.log();

            for (const patient of data) {
                console.log(`Nome: ${patient.nome} CPF: ${patient.cpf}`);
                console.log();
            }
        }

    } catch (error){
        console.error(`Erro ao listar paciente: ${error as Error}.message`);
        console.log();
    };
}

export function patientDelete() {
    try {
        console.clear();
        patientList();
        const cpfRemove = prompt(`Digite o cpf do paciente que você deseja remover: `);
        console.log();

        // COMANDOS SQL
        const sqlSelectAll = 'SELECT  nome, datanasc, cpf, sexo, telefone, sus_card FROM Paciente';
        const sqlDropTable = 'DROP TABLE Paciente';
        const sqlDelete = 'DELETE FROM Paciente WHERE cpf = ?';
        const sqlCreateTable = 'CREATE TABLE IF NOT EXISTS "Paciente" ( "id_paciente"	INTEGER, "nome"	TEXT NOT NULL, "datanasc" TEXT NOT NULL, "cpf"	TEXT NOT NULL UNIQUE,"sexo"	char(2) NOT NULL, "telefone"	TEXT, "sus_card"	TEXT NOT NULL UNIQUE, PRIMARY KEY("id_paciente" AUTOINCREMENT))';
        const sqlInsertTable = 'INSERT INTO Paciente (nome, datanasc, cpf, sexo, telefone, sus_card) VALUES (?,?,?,?,?,?)'

        const deletePatient = patientID(cpfRemove);
        
        if(deletePatient !== undefined) {
            Database.queryNone(sqlDelete, [cpfRemove]);
            console.clear();
            console.log(`Paciente com cpf ${cpfRemove} foi removido com sucesso!`);
        };

        const patientTableData = Database.queryMany<PatientModel>(sqlSelectAll);
        Database.queryNone(sqlDropTable);
        Database.queryNone(sqlCreateTable);
        
        for(const patient of patientTableData) {
            Database.queryNone(sqlInsertTable, [patient.nome, patient.datanasc, patient.cpf, patient.sexo, patient.telefone, patient.sus_card])
        }

        console.log();
    } catch (error) {
        console.error(`Erro ao deletar paciente: ${error as Error}.message`);
        console.log();
    }
}

export function patientID(cpf: string): number | unknown {
    try {
        const sql = `SELECT id_paciente FROM Paciente WHERE cpf=?`
        const idPatient = Database.queryOne<idPatientModel>(sql, [cpf])?.id_paciente;

        if (idPatient === undefined) throw new Error(`CPF invalido.`)
        
        return idPatient;

    } catch (error) {
        console.error(`Erro ao buscar id do paciente: ${error as Error}`);
        console.log();
    }
    
}

export function patientGiven() {
    console.clear();
    patientList();
    console.log();

    try {
        const cpfPatient = prompt(`Digite qual o cpf do paciente: `);
        const sql = `SELECT * FROM Paciente WHERE cpf = ?`;
        const data = Database.queryOne<PatientModel>(sql, [cpfPatient]);

        if(data === undefined) throw new Error(`Paciente de cpf ${cpfPatient} não foi encontrado.`);

        console.clear();
        console.log(`Dados do paciente com cpf ${cpfPatient}:`);
        console.log();
        console.log(`Nome: ${data.nome}`);
        console.log(`Data de nascimento: ${data.datanasc}:`);
        console.log(`CPF: ${data.cpf}`);
        console.log(`Sexo: ${data.sexo}`);
        console.log(`Telefone: ${data.telefone}`);
        console.log(`Cartão do SUS: ${data.sus_card}`);
        console.log();     

    } catch (error) {
        console.error(`Erro ao buscar dado do paciente: ${error as Error}`)
        console.log();
    }
}