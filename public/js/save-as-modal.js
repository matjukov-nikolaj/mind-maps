class SaveAsModal {
    constructor(tree) {
        this.tree = tree;
        this.json = null;
        this.name = null;
        this.modalSave = document.getElementById("modalSave");
        this.modalInput = document.getElementById("modalInput");
        this.closeSave = document.getElementById("closeSave");
        this.openSave = document.getElementById("openDownload");
        this.modal = new Modal(this.modalSave, this.modalInput, this.openSave, this.closeSave);
        this._addSaveButtonClickHandler();
    }

    setTree(tree) {
        this.tree = tree;
    }

    _saveMindMapHandler(name, thisPtr) {
        if (thisPtr.name === name) {
            thisPtr._changeMessageView('nameExist', 'block');
            return;
        }
        api.saveChanges(thisPtr._getDataObject(), url.SAVE, () => {}, thisPtr);
        if (thisPtr._getMindMapPath().length === 2) {
            document.location.href = url.DEFAULT + '/mind_map/' + thisPtr.name;
        }
        thisPtr._changeMessageView('nameExist', 'none');
        thisPtr.modal.hideModal(thisPtr.modalSave, thisPtr.modalInput);
    }

    _changeMessageView(messageBlock, display) {
        if (messageBlock === 'nameExist')
        {
            document.getElementById("nameExist").style.display = display;
            return;
        }
        document.getElementById("emptyInput").style.display = display;
    }

    _addSaveButtonClickHandler() {
        const saveButton = document.getElementById("saveButton");
        saveButton.onclick = () => {
            let inputSaver = document.getElementById("input_save");
            this.name = inputSaver.value;
            const saver = new TreeSaver();
            const json = saver.save(this.tree);
            this.json = JSON.stringify(json);
            if (!this.name) {
                this._changeMessageView('emptyInput', 'block');
            }
            else
            {
                this._changeMessageView('emptyInput', 'none');
                api.saveChanges(this._getDataObject(), url.SAVE, this._saveMindMapHandler, this);
            }
            inputSaver.value = '';
        }
    }

    _getMindMapPath() {
        return location.pathname.split('/');
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