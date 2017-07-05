class Node {
    constructor(title) {
        this.title = title;
        this.children = [];
        this.parent = null;
    }

    addChild(nodeTitle) {
        if (this.children.length >= 10)
        {
            return;
        }
        const node = new Node(nodeTitle);
        node.parent = this;
        const pushed = this.children.push(node);
        return this.children[pushed - 1];
    }
}

class Tree {
    constructor(rootTitle){
        this.root = new Node(rootTitle);
    }
}