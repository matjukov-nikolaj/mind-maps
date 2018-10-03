class TaskConverter {
    constructor(tree) {
        this.tree = tree;
        this.json = null;
        this.name = null;
        this._addSaveButtonClickHandler();
    }

    setTree(tree) {
        this.tree = tree;
    }

    _saveMindMapHandler(name, thisPtr) {
        if (thisPtr.name === name) {
            api.saveChanges(thisPtr._getDataObject(), url.UPDATE, () => {}, thisPtr);
        }
        alert("Conversion successful");
    }

    _addSaveButtonClickHandler() {
        const saveButton = document.getElementById("convertTask");
        saveButton.onclick = () => {
            let rootName = document.getElementById("rootName");
            this.name = rootName.textContent.replace(new RegExp('[^а-яА-Яa-zA-Z0-9_-]', 'u'), "");
            const path = location.pathname.split('/');
            this.name += path[path.length - 1];
            const saver = new TreeSaver();
            const json = saver.save(this.tree);
            this.json = JSON.stringify(json);
            api.saveChanges(this._getDataObject(), url.SAVE, this._saveMindMapHandler, this);
        }
    }

    _getDataObject() {
        return {
            data: {
                data: this.json,
                name: this.name
            }
        };
    }
}