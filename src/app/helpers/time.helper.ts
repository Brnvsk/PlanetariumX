import { format } from "date-fns"

export const isEqualDates = (a: Date, b: Date) => {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate()
}

export const formatDate = (date: Date) => {
    return format(date, 'dd.MM.yy')
}