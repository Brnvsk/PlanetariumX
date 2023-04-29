import { ISeatOptions } from "../main-page/components/booking-page/booking-page.component";
import { User } from "../shared/types/user.type";
import { IShow } from "./show.types";

export interface IBookingInfo {
    date: string
    time: string
    userId?: number
    show: IShow
    email?: string
    places: ISeatOptions[]
}

export interface IBooking {
    date: string
    time: string
    userId?: number
    showId: number
    email?: string
    places: string
}