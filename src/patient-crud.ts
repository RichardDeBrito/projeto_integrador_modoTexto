import { Database } from "./database";
import { PatientModel, idPatientModel } from "./models/patientModel";
import { QueuePriority } from "./classes/queuePriority";
import { QueuePriorityHospital } from "./classes/queuePriorityHospital";
import { typeSex } from ".";

export type patientData = 'name' | 'dateOfBirth' | 'cpf' | 'sex' | 'phone' | 'susCard'  

export function patientCreate(name: string, dateOfBirth: string, cpf: string, sex: typeSex | undefined, phone: string, susCard: string): void {
    
    try {
        const sql = 'INSERT INTO Paciente (nome, datanasc, cpf, sexo, telefone, sus_card) VALUES (?,?,?,?,?,?)';
        Database.queryNone(sql, [name, dateOfBirth, cpf, sex, phone, susCard]);

        console.clear();

        console.log(`Paciente ${name} cadastrado com sucesso!`);

        console.log();
        
    } catch (error) {
        console.log(`Erro ao inserir paciente: ${error as Error}.message`);
    }
}

export function patientListObj(): PatientModel[] | undefined {
    try {
        const sql = 'SELECT * FROM Paciente'
        const data = Database.queryMany<PatientModel>(sql);
        
        return data;

    } catch (error){
        console.log(`Erro ao retornar lista de pacientes: ${error as Error}.message`);
    };
}

export function patientList(): void | undefined {
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
        console.log(`Erro ao listar paciente: ${error as Error}.message`);
        console.log();
    };
}

export function patientDelete(cpf: string) {
    try {
        // COMANDOS SQL
        const sqlSelectAll = 'SELECT  nome, datanasc, cpf, sexo, telefone, sus_card FROM Paciente';
        const sqlDropTable = 'DROP TABLE Paciente';
        const sqlDelete = 'DELETE FROM Paciente WHERE cpf = ?';
        const sqlCreateTable = 'CREATE TABLE IF NOT EXISTS "Paciente" ( "id_paciente"	INTEGER, "nome"	TEXT NOT NULL, "datanasc" TEXT NOT NULL, "cpf"	TEXT NOT NULL UNIQUE,"sexo"	char(2) NOT NULL, "telefone"	TEXT, "sus_card"	TEXT NOT NULL UNIQUE, PRIMARY KEY("id_paciente" AUTOINCREMENT))';
        const sqlInsertTable = 'INSERT INTO Paciente (nome, datanasc, cpf, sexo, telefone, sus_card) VALUES (?,?,?,?,?,?)'

        const deletePatient = patientID(cpf);
        
        if(deletePatient !== undefined) {
            Database.queryNone(sqlDelete, [cpf]);
            console.log(`Paciente com cpf ${cpf} foi removido com sucesso!`);
        };

        const patientTableData = Database.queryMany<PatientModel>(sqlSelectAll);
        Database.queryNone(sqlDropTable);
        Database.queryNone(sqlCreateTable);
        
        for(const patient of patientTableData) {
            Database.queryNone(sqlInsertTable, [patient.nome, patient.datanasc, patient.cpf, patient.sexo, patient.telefone, patient.sus_card])
        }

        console.log();
    } catch (error) {
        console.log(`Erro ao deletar paciente: ${error as Error}.message`);
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
        console.log(`Erro ao buscar id do paciente: ${error as Error}`);
        console.log();
    }
    
}

export function patientGiven(cpf: string) {
    try {
        const sql = `SELECT * FROM Paciente WHERE cpf = ?`;
        const data = Database.queryOne<PatientModel>(sql, [cpf]);

        if(data === undefined) throw new Error(`Paciente de cpf ${cpf} não foi encontrado.`);

        console.log(`Dados do paciente com cpf ${cpf}:`);
        console.log();
        console.log(`Nome: ${data.nome}`);
        console.log(`Data de nascimento: ${data.datanasc}:`);
        console.log(`CPF: ${data.cpf}`);
        console.log(`Sexo: ${data.sexo}`);
        console.log(`Telefone: ${data.telefone}`);
        console.log(`Cartão do SUS: ${data.sus_card}`);
        console.log();     

    } catch (error) {
        console.log(`Erro ao buscar dado do paciente: ${error as Error}`)
        console.log();
    }
}