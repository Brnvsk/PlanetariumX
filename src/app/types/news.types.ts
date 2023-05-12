export interface INews {
    id: number,
    title: string,
    photo: string,
    text: string[],
    tags: INewsTag[]
}

export interface INewsTag {
    id: number,
    tag: string,
    name: string
}