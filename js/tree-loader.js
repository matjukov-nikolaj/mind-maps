class TreeLoader {
    load(json) {
        const jsonRoot = json[globalConfig.ROOT_KEY];
        const tree = new Tree(jsonRoot[globalConfig.TITLE_KEY]);
        tree.root = this.loadNode(jsonRoot);
        return tree;
    }

    loadNode(nodeJson) {
        const node = new Node(nodeJson[globalConfig.TITLE_KEY]);
        const children = nodeJson[globalConfig.CHILDREN_KEY];
        for (const child of children) {
            const childNode = this.loadNode(child);
            node.appendChild(childNode);
        }
        return node;
    }
}