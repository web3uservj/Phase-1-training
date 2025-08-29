import { Author } from "./Author.interface"
export interface NewBook{
    newBookId:number
    title:string
    price:number
    authorId:string
    author:Author
}