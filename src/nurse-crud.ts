import { Database } from "./database";
import { IdNurseModel, NurseModel } from "./models/nurseModel";

export function nurseID(coren: string): number | unknown {
    try {
        const sql = `SELECT id_enfermeiro FROM Enfermeiro WHERE coren=?`
        const idNurse = Database.queryOne<IdNurseModel>(sql, [coren])?.id_enfermeiro;
        if(idNurse === undefined) throw new Error(`Coren invalido.`)
        
        return idNurse;
        
    } catch (error) {
        console.log(`Erro ao buscar id do enfermeiro: ${error as Error}`);
        console.log();
    }
    
}

export function nurseListObj(): NurseModel[] | undefined {
    try {
        const sql = 'SELECT * FROM Enfermeiro'
        const data = Database.queryMany<NurseModel>(sql);
        return data;

    } catch (error){
        console.log(`Erro ao listar enfermeiros: ${error as Error}`);
        console.log();
    };
}

export function nurseList(): void {
    try {
        const sql = 'SELECT nome, coren FROM Enfermeiro'
        const data = Database.queryMany<NurseModel>(sql);

        console.log(`Enfermeiros cadastrados: `);
        console.log();

        for (const nurse of data) {
            console.log(`Nome: ${nurse.nome} coren: ${nurse.coren}`);
            console.log();
        }

    } catch (error){
        console.log(`Erro ao listar enfermeiros: ${error as Error}`);
        console.log();
    };
}