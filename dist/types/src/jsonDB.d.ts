import dbAdapter from "./dbAdapter";
import UIElement from "./UIElement";
export default class jsonDB extends dbAdapter {
    constructor(location?: string);
    private readDbFile;
    private writeDbFile;
    saveElement(element: UIElement): Promise<void>;
    getElement(name: string): Promise<UIElement | null>;
}
