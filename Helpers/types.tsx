export type product = {
    id:string,
    name:string,
    category:string,
    shop:string
}

export type note = {
    id:string,
    title:string,
    date:Date,
    products:Array<product>
}