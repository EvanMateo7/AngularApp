
export interface Item {
    id?: string
    name:string,
    description: string,
    userID: string,
    thumbnailURL?: string
  }

export interface User {
    id: string, 
    name?: string,
    email: string,
    displayName?: string,
    photoURL?: string,
    roles?: string[]
}

export interface ItemComment {
    id?: string,
    comment: string,
    userID: string,
    timestamp: number;
}

export enum Roles {
  ADMIN = "ADMIN",
  USER = "USER"
}
