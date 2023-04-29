import { ISeatOptions } from "../main-page/components/booking-page/booking-page.component"

export const createSeatFromDataset = (dataset: DOMStringMap): ISeatOptions | null => {
    const { side, row, place } = dataset as {
        side: 'left' | 'right',
        row: string,
        place: string
    }
    if (!side || !row || !place) {
        return null;
    }
    const seatItem = {
        side,
        row: Number(row),
        place: Number(place),      
    }
    return seatItem
}