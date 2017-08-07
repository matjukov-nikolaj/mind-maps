class ModalManager {
    constructor(tree) {
        this.tree = tree;
        this._saveButton = document.querySelector("#openDownload");
        this._saveButton.onclick = () => {
            this._showSave();
        };
        this._themeButton = document.querySelector("#openSelectTheme");
        this._themeButton.onclick = () => {
            this._showSelectTheme();
        };
        this._loadButton = document.querySelector("#openLoad");
        this._loadButton.onclick = () => {
            this._showLoadWindow();
        };

        this.onLoadTree = () => {};
    }

    _addClass(modalGeneral, modalPrivate) {
        modalGeneral.classList.add("js_open");
        modalPrivate.classList.add("js_modal_content");
    }

    _removeClass(modalGeneral, modalPrivate) {
        modalGeneral.classList.remove("js_open");
        modalPrivate.classList.remove("js_modal_content");
    }

    _showSave() {
        const modalSave = document.getElementById("modalSave");
        modalSave.focus();
        const modalInput = document.getElementById('modalInput');
        this._addClass(modalSave, modalInput);
        const modalClose = document.getElementById('closeSave');
        modalClose.onclick = () => {
            this._removeClass(modalSave, modalInput);
        };
        const saveButton = document.getElementById("saveButton");
        saveButton.onclick = () => {
            const inputSaver = document.getElementById("input_save");
            let inputValue = inputSaver.value;
            const saver = new TreeSaver();
            const json = saver.save(this.tree);
            const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});
            if (inputValue) {
                saveAs(blob, inputValue + ".json");
                inputSaver.value = '';
            } else {
                saveAs(blob, "mind-map.json");
            }
        }
    }

    _showSelectTheme() {
        const modalTheme = document.getElementById("modalTheme");
        modalTheme.focus();
        const modalContent = document.getElementById('modalContents');
        this._addClass(modalTheme, modalContent);
        const modalClose = document.getElementById('closeTheme');
        modalClose.onclick = () =>  {
            this._removeClass(modalTheme, modalContent);
        };
    };

    _showLoadWindow() {
        const modalLoad = document.getElementById("modalLoad");
        modalLoad.focus();
        const modalLoadFile = document.getElementById('modalLoadFile');
        this._addClass(modalLoad, modalLoadFile);
        const modalClose = document.getElementById('closeLoad');
        modalClose.onclick = () =>  {
            this._removeClass(modalLoad, modalLoadFile);
        };
        const loadButton = document.getElementById('loadButton');
        loadButton.onclick = () => {
            const loadFile = document.getElementById('files').files[0];
            const fileData = new FileReader(loadFile);
            const file = fileData.readAsText(loadFile);
            fileData.onload = () => {
                const string = fileData.result;
                const json = JSON.parse(string);
                const loader = new TreeLoader();
                const tree = loader.load(json);
                this.tree = tree;
                this.onLoadTree(tree);
                this._removeClass(modalLoad, modalLoadFile);
            };
        }
    };
}

