export class DOMHelpers {
    static asHTMLElement(element: Element | null | undefined): HTMLElement {
        if (!element) throw "Error: element is null or undefined!"
        if (!(element instanceof HTMLElement))
            throw "Error: element is no HTMLElement"
        return element
    }

    static asHTMLSelectElement(
        element: Element | RadioNodeList | null | undefined
    ): HTMLSelectElement {
        if (!element) throw "Error: element is null or undefined!"
        if (!(element instanceof HTMLSelectElement))
            throw "Error: element is no HTMLSelectElement"
        return element
    }

    static asHTMLFormElement(
        element: Element | RadioNodeList | null | undefined
    ): HTMLFormElement {
        if (!element) throw "Error: element is null or undefined!"
        if (!(element instanceof HTMLFormElement))
            throw "Error: element is no HTMLFormElement"
        return element
    }

    static asHTMLTableElement(
        element: Element | null | undefined
    ): HTMLTableElement {
        if (!element) throw "Error: element is null or undefined!"
        if (!(element instanceof HTMLTableElement))
            throw "Error: element is no HTMLTableElement"
        return element
    }
}
