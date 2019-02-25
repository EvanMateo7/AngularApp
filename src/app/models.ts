import { timestamp } from "rxjs/operators";

export interface Item {
    id?: string
    name:string,
    description: string,
    price:number,
    userId: string,
    thumbnailURL?: string
  }

export interface User {
    id: string, 
    name?: string,
    email: string,
    displayName?: string,
    photoURL?: string,
    age?: number
}

export interface ItemComment {
    id?: string,
    comment: string,
    userId: string,
    timestamp: number;
}