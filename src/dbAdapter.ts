import UIElement from "./UIElement"

export default abstract class dbAdapter{
    dbLocation : any
    constructor(location : any){
        this.dbLocation = location
    }
    abstract saveElement(element : UIElement) : Promise<void>
    abstract getElement(name : string) : Promise<UIElement | null>
}