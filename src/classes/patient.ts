export class Patient {
    constructor(
        public id: number,
        public name: string,
        public dateOfBirth: string,
        public cpf: string,
        public sex: string,
        public phone: string,
        public susCard: string
    ) {}
}