class LoadModal {
    constructor() {
        this.json = null;
        this.name = name;
        this.modalLoad = document.getElementById("modalLoad");
        this.modalLoadFile = document.getElementById("modalLoadFile");
        this.openButton = document.getElementById("openLoad");
        this.closeButton = document.getElementById("closeLoad");
        this.modal = new Modal(this.modalLoad, this.modalLoadFile, this.openButton, this.closeButton);
        this._addLoadButtonClickHandler();
        this.loadedTree = null;
    }

    _saveMindMapHandler(name, thisPtr) {
        if (thisPtr.name === name) {
            thisPtr._changeMessageView('nameExist', 'block');
            return;
        }
        api.saveChanges(thisPtr._getDataObject(), url.SAVE, () => {}, thisPtr);
        thisPtr._changeMessageView('nameExist', 'none');
        thisPtr.modal.hideModal(thisPtr.modalLoad, thisPtr.modalLoadFile);
        window.location.reload();
    }

    _changeMessageView(messageBlock, display) {
        if (messageBlock === 'nameExist')
        {
            document.getElementById("nameExist").style.display = display;
            return;
        }
        document.getElementById("emptyInput").style.display = display;
    }

    _addLoadButtonClickHandler() {
        const loadButton = document.getElementById('loadButton');
        loadButton.onclick = () => {
            const input = document.getElementById("input_save");
            this.name = input.value.replace(new RegExp('[^а-яА-Яa-zA-Z0-9_-]', 'u'), '');
            const loadFile = document.getElementById('files').files[0];
            const fileData = new FileReader(loadFile);
            const file = fileData.readAsText(loadFile);
            this._onLoadData(fileData, this._saveData);
            input.value = '';
        }
    }

    _saveData(tree, thisPtr) {
        const saver = new TreeSaver();
        const json = saver.save(tree);
        thisPtr.json = JSON.stringify(json);
        if (!thisPtr.name) {
            thisPtr._changeMessageView('emptyInput', 'block');
        }
        else
        {
            thisPtr._changeMessageView('emptyInput', 'none');
            api.saveChanges(thisPtr._getDataObject(), url.SAVE, thisPtr._saveMindMapHandler, thisPtr);
        }
    }

    _onLoadData(file, handleAfterLoadedFile) {
        let thisPtr = this;
        file.onload = () => {
            try {
                const string = file.result;
                const json = JSON.parse(string);
                const loader = new TreeLoader();
                const loadedTree = loader.load(json);
                handleAfterLoadedFile(loadedTree, thisPtr);
            } catch (e) {
                alert("Invalid json.");
            }
        };
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
