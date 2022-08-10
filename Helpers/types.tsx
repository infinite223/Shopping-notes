export type product = {
    name:string,
    category:string,
    shop:string
}

export type note = {
    title:string,
    date:Date,
    products:Array<product>
}