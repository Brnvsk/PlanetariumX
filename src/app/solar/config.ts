import { Mesh } from "three"

export interface SolarPlanet {
    id: string,
    name: string,
    _name: string,
    yRot: number,
    zRot?: number,
    xRot?: number,
    text: string,
    radius?: number,
    mesh?: Mesh
}

export const SSConfig: {
    items: SolarPlanet[],
    rotationSpeed: number,
    rotSpeedMultiplier: number,
} = {
    items: [
        {
            id: '1',
            name: 'Mercury',
            _name: 'Mercury',
            yRot: -3,
            text: 'Описание планеты Меркурий',
            radius: 5,
        },
        {
            id: '2',
            name: 'Венера',
            _name: 'Venus',
            yRot: -2.4,
            text: 'Описание планеты Венера',
        },
        {
            id: '3',
            name: 'Earth',
            _name: 'Earth',
            yRot: -2,
            text: 'Описание планеты Земля',
        },
        {
            id: '4',
            name: 'Mars',
            _name: 'Mars',
            yRot: 1.5,
            text: 'Описание планеты Марс',
        },
        {
            id: '6',
            name: 'Jupiter',
            _name: 'Jupiter',
            yRot: -1.4,
            text: 'Описание планеты Юпитер',
        },
        {
            id: '7',
            name: 'Saturn',
            _name: 'Saturn',
            yRot: 1.3,
            text: 'Описание планеты Сатурн',
        },
        {
            id: '9',
            name: 'Uran',
            _name: 'Uran',
            yRot: -1,
            text: 'Описание планеты Уран',
        },
        {
            id: '10',
            name: 'Нептун',
            _name: 'Neptune',
            yRot: 1,
            text: 'Описание планеты Нептун',
        },
        {
            id: '11',
            name: 'Sun',
            _name: 'sun',
            yRot: 0,
            zRot: .5,
            text: 'Описание Солнца',
        },
        {
            id: '12',
            name: 'Moon',
            _name: 'moon',
            yRot: -1,
            text: 'Описание Луны',
        },
    ],
    rotationSpeed: 0.001,
    rotSpeedMultiplier: 0.002,
}