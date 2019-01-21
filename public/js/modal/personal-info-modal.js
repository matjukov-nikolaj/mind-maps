class PersonalInfo {
    constructor(api) {
        this.api = api;
        this.modalLoad = document.getElementById("modalPersonal");
        this.modalLoadFile = document.getElementById("modalPersonalInfo");
        this.openButton = document.getElementById("openProfile");
        this.closeButton = document.getElementById("closePersonal");
        this.modal = new Modal(this.modalLoad, this.modalLoadFile, this.openButton, this.closeButton);
        this._personalModalHandler();
    }

    _personalModalHandler() {
        api.loadData({}, url.USER_INFO, this._loadedUserInfo, this);
    }

    _loadedUserInfo(value, thisPtr) {
        if (value === "") {
            document.getElementById("personalInfo").style.display = "none";
            document.getElementById("personalForm").style.display = "block";
        } else {
            document.getElementById("personalInfo").style.display = "block";
            document.getElementById("personalForm").style.display = "none";
        }
    }

    // _saveMindMapHandler(name, thisPtr) {
    //     if (thisPtr.name === name) {
    //         thisPtr._changeMessageView('nameExist', 'block');
    //         return;
    //     }
    //     api.saveChanges(thisPtr._getDataObject(), url.SAVE, () => {}, thisPtr);
    //     thisPtr._changeMessageView('nameExist', 'none');
    //     thisPtr.modal.hideModal(thisPtr.modalLoad, thisPtr.modalLoadFile);
    //     window.location.reload();
    // }
    //
    // _changeMessageView(messageBlock, display) {
    //     if (messageBlock === 'nameExist')
    //     {
    //         document.getElementById("nameExist").style.display = display;
    //         return;
    //     }
    //     document.getElementById("emptyInput").style.display = display;
    // }
    //
    // _addLoadButtonClickHandler() {
    //     const loadButton = document.getElementById('loadButton');
    //     loadButton.onclick = () => {
    //         const input = document.getElementById("input_save");
    //         this.name = input.value.replace(new RegExp('[^а-яА-Яa-zA-Z0-9_-]', 'u'), '');
    //         const loadFileBlock = document.getElementById('files');
    //         if (loadFileBlock.files.length === 0) {
    //             return;
    //         }
    //         const loadFile = loadFileBlock.files[0];
    //         const fileData = new FileReader(loadFile);
    //         const file = fileData.readAsText(loadFile);
    //         this._onLoadData(fileData, this._saveData);
    //         input.value = '';
    //     }
    // }
    //
    // _saveData(tree, thisPtr) {
    //     const saver = new TreeSaver();
    //     const json = saver.save(tree);
    //     thisPtr.json = JSON.stringify(json);
    //     if (!thisPtr.name) {
    //         thisPtr._changeMessageView('emptyInput', 'block');
    //     }
    //     else
    //     {
    //         thisPtr._changeMessageView('emptyInput', 'none');
    //         api.saveChanges(thisPtr._getDataObject(), url.SAVE, thisPtr._saveMindMapHandler, thisPtr);
    //     }
    // }
    //
    // _onLoadData(file, handleAfterLoadedFile) {
    //     let thisPtr = this;
    //     file.onload = () => {
    //         try {
    //             const string = file.result;
    //             const json = JSON.parse(string);
    //             const loader = new TreeLoader();
    //             const loadedTree = loader.load(json);
    //             handleAfterLoadedFile(loadedTree, thisPtr);
    //         } catch (e) {
    //             alert("Invalid json.");
    //         }
    //     };
    // }
    //
    // _getDataObject() {
    //     return {
    //         data: {
    //             data: this.json,
    //             name: this.name
    //         }
    //     };
    // }
}
