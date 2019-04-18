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
        const lastPathComponent = path[path.length - 1];
        if (path[path.length - 2] === "mind_map") {
            const mindMapName = decodeURIComponent(lastPathComponent);
            const data = {
                name: mindMapName
            };
            api.loadData(data, url.VALUE, this._loadMindMapTree, this);
            return;
        }
        const timestamp = decodeURIComponent(lastPathComponent);
        const data = {
            timestamp: timestamp
        };
        api.loadData(data, url.TASK_MIND_MAP, this._loadMindMapTree, this);
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
