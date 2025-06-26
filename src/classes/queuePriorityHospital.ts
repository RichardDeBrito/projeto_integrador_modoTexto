import { QueuePriority } from "./queuePriority";
import { Patient } from "./patient";
import { Screening } from "./screening";
import { Database } from "../database";
import { getMinutesBetweenDates } from "../utils/dateTime";

export class QueuePriorityHospital extends QueuePriority<Screening> {
    public callNext(): Patient | string {
        this.dequeue();
        if(this.nextItem === undefined) {
            return "Fila vazia.";
        }

        try {
            const sql = 'DELETE FROM Triagem WHERE paciente_id = ?'
            Database.queryNone(sql, [this.nextItem.patient.id]);
            return this.nextItem.patient;
        } catch (error) {
            console.error(`Erro ao remover triagem: ${error}`);
            return "Erro ao processar paciente";
        }
    }

    public queueForTriage(screening: Screening): void {
        if(this.timeOut(screening) === true) {
            this.enqueue(screening, 0);
        } else {
            this.enqueue(screening, screening.classification);
        }
            
    }

    public timeOut(screening: Screening) :boolean {
        const waitingTime = getMinutesBetweenDates(new Date, screening.screeningDateTime);

        switch (screening.classification) {
            case 0:
                if(waitingTime > 0){
                    return true;
                } else {
                    return false;
                };
                
            case 1:
                if(waitingTime > 10){
                    return true;
                } else {
                    return false;
                };
            
            case 2:
                if(waitingTime > 60){
                    return true;
                } else {
                    return false;
                };
            
            case 3:
                if(waitingTime > 120){
                    return true;
                } else {
                    return false;
                };
            
            case 4:
                if(waitingTime > 240){
                    return true;
                } else {
                    return false;
                };
            
            default:
                return false;
        }
    }
}