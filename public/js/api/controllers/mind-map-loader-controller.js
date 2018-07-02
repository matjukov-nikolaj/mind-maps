class MindMapLoaderController {
    constructor(tree) {
        this.tree = tree;
        this._mindMapLoaderHandler();
        this.onLoadTree = () => {};
    }

    _mindMapLoaderHandler() {
        const path = this._getMindMapPath();
        if (path.length === 2) {
            return;
        }
        const mindMapName = decodeURIComponent(path[path.length - 1]);
        const data = {
            name: mindMapName
        };
        api.loadData(data, url.VALUE, this._loadMindMapTree, this);
    }

    _getMindMapPath() {
        return location.pathname.split('/');
    }

    _loadMindMapTree(data, thisPtr) {
        try {
            const loader = new TreeLoader();
            const json = JSON.parse(data);
            const tree = loader.load(json);
            thisPtr.tree = tree;
            thisPtr.onLoadTree(tree);
        } catch (e) {
            alert("Invalid json!");
        }
    }
}
