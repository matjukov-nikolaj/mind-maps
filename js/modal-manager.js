class ModalManager {
    constructor(tree) {
        this.tree = tree;
        this._saveButton = document.querySelector("#openDownload");
        this._saveButton.onclick = () => {
            this.showSave();
        };
        this._themeButton = document.querySelector("#openSelectTheme");
        this._themeButton.onclick = () => {
            this.showSelectTheme();
        };
        this._loadButton = document.querySelector("#openLoad");
        this._loadButton.onclick = () => {
            this.showLoadWindow();
        };

        this.onLoadTree = () => {};
    }

    showSave() {
        const modalSave = document.getElementById("modalSave");
        modalSave.focus();
        const modalInput = document.getElementById('modalInput');
        modalSave.classList.add("js_open");
        modalInput.classList.add("js_modal_content");
        const modalClose = document.getElementById('closeSave');
        modalClose.onclick = function () {
            modalSave.classList.remove("js_open");
            modalInput.classList.remove("js_modal_content");

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

    showSelectTheme() {
        const modalTheme = document.getElementById("modalTheme");
        modalTheme.focus();
        const modalContent = document.getElementById('modalContents');
        modalTheme.classList.add("js_open");
        modalContent.classList.add("js_modal_content");
        const modalClose = document.getElementById('closeTheme');
        modalClose.onclick = function () {
            modalTheme.classList.remove("js_open");
            modalContent.classList.remove("js_modal_content");
        };
    };

    showLoadWindow() {
        const modalLoad = document.getElementById("modalLoad");
        modalLoad.focus();
        const modalLoadFile = document.getElementById('modalLoadFile');
        modalLoad.classList.add("js_open");
        modalLoadFile.classList.add("js_modal_content");
        const modalClose = document.getElementById('closeLoad');
        modalClose.onclick = function () {
            modalLoad.classList.remove("js_open");
            modalLoadFile.classList.remove("js_modal_content");
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
                modalLoad.classList.remove("js_open");
                modalLoadFile.classList.remove("js_modal_content");
            };
        }
    };
}

