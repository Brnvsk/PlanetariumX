import { ISeatOptions } from "../main-page/components/booking-page/booking-page.component";
import { User } from "../shared/types/user.type";
import { IShow } from "./show.types";

// booking request
export interface IBookingCreate {
    date: string
    time: string
    address: string
    userId?: number
    show: IShow
    email?: string
    places: ISeatOptions[]
}

// booking record
export interface IBooking {
    address: string
    date: string
    time: string
    userId?: number
    showId: number
    email?: string
    places: ISeatOptions[]
}

// admin booking table
export interface IBookingTableRow {
    booking_id: number,
    user_email: string,
    email: string | null,
    show_id: number,
    session_id: number,
    title: string,
    date: string,
    time: string,
    address: string
    places: ISeatOptions[]
}