
export interface IShow {
    id: number
    title: string
    descr: string
    tags: string
    poster_src: string
    price: number
    // timeSlots: IShowTimeslot[]
}

export interface IShowSession {
    id: number,
    showId: number,
    date: string,
    time: string,
    address: string
    showTitle?: string
}