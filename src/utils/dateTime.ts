export function getDateTime() : string {
    const now = new Date();

    const dateBrasilia = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo"})
    );
    
    const year = dateBrasilia.getFullYear();
    const mounth = String(dateBrasilia.getMonth() + 1).padStart(2, "0");
    const day = String(dateBrasilia.getDate()).padStart(2, "0");
    const hour = String(dateBrasilia.getHours()).padStart(2, "0");
    const minute = String(dateBrasilia.getMinutes()).padStart(2, "0");
    const second = String(dateBrasilia.getSeconds()).padStart(2, "0");

    return `${year}-${mounth}-${day} ${hour}:${minute}:${second}`;
}

export function getMinutesBetweenDates(date1: Date, date2: Date):number {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());

    const diffInMinutes = diffInMs / (1000 * 60);

    return diffInMinutes;
}