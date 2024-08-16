import UIElement from "./UIElement";
export default abstract class dbAdapter {
    dbLocation: any;
    constructor(location: any);
    abstract saveElement(element: UIElement): Promise<void>;
    abstract getElement(name: string): Promise<UIElement | null>;
}
