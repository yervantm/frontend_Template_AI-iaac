import parse from 'node-html-parser';

class Page {

    constructor() {

    }

    make() { }

    static load(content: string): Promise<any> {
        
        let root = document.querySelector("html")
        if (typeof (content) == "string" && root != null) {
            root.innerHTML = content;
        }

        return new Promise((res) => res(root));
    }
}

export {Page};