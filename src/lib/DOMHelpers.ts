export class DOMHelpers {
    static asHTMLElement(
        element: Element | RadioNodeList | null | undefined
    ): HTMLElement {
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
        element: Element | RadioNodeList | null | undefined
    ): HTMLTableElement {
        if (!element) throw "Error: element is null or undefined!"
        if (!(element instanceof HTMLTableElement))
            throw "Error: element is no HTMLTableElement"
        return element
    }

    static asHTMLTableRowElement(
        element: Element | RadioNodeList | null | undefined
    ): HTMLTableRowElement {
        if (!element) throw "Error: element is null or undefined!"
        if (!(element instanceof HTMLTableRowElement))
            throw "Error: element is no HTMLTableRowElement"
        return element
    }

    static asHTMLInputElement(
        element: Element | RadioNodeList | null | undefined
    ): HTMLInputElement {
        if (!element) throw "Error: element is null or undefined!"
        if (!(element instanceof HTMLInputElement))
            throw "Error: element is no HTMLInputElement"
        return element
    }
}
