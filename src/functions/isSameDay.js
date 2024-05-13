export default function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
}

export function isDatetimePassed(date) {
    const datetime = new Date(date);
    const now = new Date();

    return datetime < now;
}