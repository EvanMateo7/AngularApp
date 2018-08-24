
export interface Item {
    id?: string
    name:string,
    description: string,
    price:number,
    userId: string,
    imageURL?: string
  }

export interface User {
    id: string, 
    name?: string,
    email: string,
    displayName?: string,
    photoURL?: string,
    age?: number
}