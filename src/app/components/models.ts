
export interface Item {
    id?: string
    name:string,
    description: string,
    price:number,
    user?: User
  }

export interface User {
    id?: string, 
    name: string,
    age: number
}