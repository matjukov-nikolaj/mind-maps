class SaveChangesController {

    constructor(tree) {
        this.tree = tree;
        this._saveChangesHandler();
    }

    setTree(tree) {
        this.tree = tree;
    }

    _saveChangesHandler() {
        const save = document.getElementById("saveChanges");
        save.onclick = () => {
            if (this._isNewMindMap()) {
                return document.getElementById("openDownload").click();
            }
            const path = this._getMindMapPath();
            const mindMapName = path[path.length - 1];
            const saver = new TreeSaver();
            const json = saver.save(this.tree);
            const jsonStr = JSON.stringify(json);
            api.saveChanges(this._getDataObject(jsonStr, mindMapName), url.UPDATE, () => {}, this);
        }
    }

    _getDataObject(json, name) {
        return {
            data: {
                data: json,
                name: name
            }
        };
    }

    _getMindMapPath() {
        return location.pathname.split('/');
    }

    _isNewMindMap() {
        return this._getMindMapPath().length === 2;
    }

}