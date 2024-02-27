export default function isSameDay(d1, d2) {
    console.log('date1', d1)
    console.log('date2', d2)


    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
}