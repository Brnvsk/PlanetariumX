import { ISeatOptions } from "../main-page/components/booking-page/booking-page.component";

const svgNS = 'http://www.w3.org/2000/svg'
const seatPathStr = `<path d="M0 4C0 2.89543 0.89543 2 2 2H4C5.10457 2 6 2.89543 6 4V14C6 15.1046 6.89543 16 8 16H22C23.1046 16 24 15.1046 24 14V4C24 2.89543 24.8954 2 26 2H28C29.1046 2 30 2.89543 30 4V17C30 19.7614 27.7614 22 25 22H5C2.23858 22 0 19.7614 0 17V4Z" /><path d="M7 3C7 1.34315 8.34315 0 10 0H20C21.6569 0 23 1.34315 23 3V14C23 14.5523 22.5523 15 22 15H8C7.44772 15 7 14.5523 7 14V3Z" />`


const setup = function (numOfSeats: number, radius: number, angles: number[], side: 'left' | 'right', row: number, booked: ISeatOptions[], direction: number) {
    const canvasWidth = 800
    const canvasHeight = 600

    const seats = [];
    
    for (let i = 1; i <= numOfSeats; i++) {
        const seat = document.createElementNS(svgNS, 'g')
        seat.innerHTML = seatPathStr
        seat.dataset['side'] = side;
        seat.dataset['row'] = row.toString();
        seat.dataset['place'] = `${i}`;
        seat.classList.add('seat-item');
        // seat.id = 'seat-' + i;
        seat.setAttribute('viewBox', '0 0 30 30');
        seat.setAttribute('cursor', 'pointer');
        const posx = Math.round(radius * (Math.cos(angles[i])));
        const posy = Math.round(radius * (Math.sin(angles[i])));
        const centerX = canvasWidth / 2
        const centerY = canvasHeight / 2
        const xPos = (centerX - posx * direction)
        const yPos = (centerY - posy)

        seat.style.pointerEvents = 'bounding-box'
        seat.setAttribute('transform', `translate(${xPos}, ${yPos}) scale(${direction}, 1) rotate(${90})`)
        const fill = booked.findIndex(book => book.place == i && book.side == side && book.row == row) === -1 ? '#fff' : '#333'
        seat.setAttribute('fill', fill)
        seats.push(seat);
    }

    return seats
};

const generate = function(side: 'left' | 'right', row: number, numOfSeats: number, radius: number, booked: ISeatOptions[], direction = 1) {
    // const k = 360 / (numOfSeats + 1);
    const k = 160 / (numOfSeats + 1);
    const offset = Math.PI / 180 * 80

    const angles = []
    for (let i = 0; i <= numOfSeats; i++) {
        angles.push(Math.PI / 180 * i * k - offset);
    }
    return setup(numOfSeats, radius, angles, side, row, booked, direction)
}

const initialRadius = 300
const innerCircleKoeff = 0.7
const middleCircleKoeff = 0.85
const outerCircleKoeff = 1


function getSeatsMap(bookedPlaces: ISeatOptions[]) {
    console.log(bookedPlaces);
    
    const left1 = generate('left', 3, 17, initialRadius * outerCircleKoeff, bookedPlaces);
    const left2 = generate('left', 2, 15, initialRadius * middleCircleKoeff, bookedPlaces);
    const left3 = generate('left', 1, 11, initialRadius * innerCircleKoeff, bookedPlaces);
    const right1 = generate('right', 3, 17, initialRadius * outerCircleKoeff, bookedPlaces, -1);
    const right2 = generate('right', 2, 15, initialRadius * middleCircleKoeff, bookedPlaces, -1);
    const right3 = generate('right', 1, 11, initialRadius * innerCircleKoeff, bookedPlaces, -1);

    // export const seatsConfig = generateSeatsConfig()
    const seatsMap1 = [
        ...left1, ...left2, ...left3, ...right1, ...right2, ...right3
    ];

    return seatsMap1
}

export { getSeatsMap }