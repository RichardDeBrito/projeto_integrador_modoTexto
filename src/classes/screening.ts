import { Patient } from "./patient.js";
import { Nurse } from "./nurse.js";
import { typePriority } from "./queuePriority.js";

export class Screening {
    constructor(
        readonly screeningDateTime: Date,
        readonly symptoms: string,
        readonly bloodPresure: string,
        readonly temperature: number,
        readonly heartRate: number,
        public readonly patient: Patient,
        readonly nurse: Nurse,
        readonly classification: typePriority
    ){}
}   