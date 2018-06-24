import { User } from '../models/user';

export interface Item {
    id?: string
    name:string,
    price:number,
    user: User
  }