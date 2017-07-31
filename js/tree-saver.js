class TreeSaver {
    save(tree) {
        const json = {};
        json[config.ROOT_KEY] = this.saveNode(tree.root);
        return json;
    }

    saveNode(node) {
        const json = {};
        json[config.TITLE_KEY] = node.title;

        const children = [];
        for (const child of node.children) {
            children.push(this.saveNode(child));
        }
        json[config.CHILDREN_KEY] = children;
        return json;
    }
}