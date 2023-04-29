export interface Ticket {
  name: string,
  discription: string,
  picture: string,
  price: number,
  date?: DATE[]
}


export interface DATE {
  item: Date
}

export interface BookedTicket {
  day: string,
  hour: string,
  name: string,
  positions: number[]
}

