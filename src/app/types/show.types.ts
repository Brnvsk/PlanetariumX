
export interface IShow {
    id: number
    title: string
    descr: string
    tags: string
    posterSrc: string
    price: number
    // timeSlots: IShowTimeslot[]
}

export interface IShowTimeslot {
    id: number,
    showId: number,
    date: string,
    time: string,
    address: string
}