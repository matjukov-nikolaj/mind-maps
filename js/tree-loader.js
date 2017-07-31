class TreeLoader {
    load(json) {
        const jsonRoot = json[config.ROOT_KEY];
        const tree = new Tree(jsonRoot[config.TITLE_KEY]);
        tree.root = this.loadNode(jsonRoot);
        return tree;
    }

    loadNode(nodeJson) {
        const node = new Node(nodeJson[config.TITLE_KEY]);
        const children = nodeJson[config.CHILDREN_KEY];
        for (const child of children) {
            const childNode = this.loadNode(child);
            childNode.parent = node;
        }
        return node;
    }
}