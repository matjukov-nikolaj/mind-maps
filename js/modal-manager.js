class ModalManager {
    constructor(tree) {
        this.tree = tree;

        this._saveButton = document.querySelector("#open_download");
        this._saveButton.onclick = () => {
            this.showSave();
        };

        this._themeButton = document.querySelector("#open_select_theme");
        this._themeButton.onclick = () => {
            this.showSelectTheme();
        };

        this._loadButton = document.querySelector("#open_load");
        this._loadButton.onclick = () => {
            this.showLoadWindow();
        };
    }

    showSave() {
        const modalSave = document.getElementById("modal_save");
        modalSave.focus();
        const modalInput = document.getElementById('modal_input');
        modalSave.classList.add("js_open");
        modalInput.classList.add("js_modal_content");
        const modalClose = document.getElementById('close_save');
        modalClose.onclick = function () {
            modalSave.classList.remove("js_open");
            modalInput.classList.remove("js_modal_content");

        };
        const saveButton = document.getElementById("save_button");
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
        const modalTheme = document.getElementById("modal_theme");
        modalTheme.focus();
        const modalContent = document.getElementById('modal_contents');
        modalTheme.classList.add("js_open");
        modalContent.classList.add("js_modal_content");
        const modalClose = document.getElementById('close_theme');
        modalClose.onclick = function () {
            modalTheme.classList.remove("js_open");
            modalContent.classList.remove("js_modal_content");
        };
    };

    showLoadWindow() {
        const modalLoad = document.getElementById("modal_load");
        modalLoad.focus();
        const modalLoadFile = document.getElementById('modal_load_file');
        modalLoad.classList.add("js_open");
        modalLoadFile.classList.add("js_modal_content");
        const modalClose = document.getElementById('close_load');
        modalClose.onclick = function () {
            modalLoad.classList.remove("js_open");
            modalLoadFile.classList.remove("js_modal_content");
        };

        const loadButton = document.getElementById('load_button');
        loadButton.onclick = () => {
            const loadFile = document.getElementById('files').files[0];
            const fileData = new FileReader(loadFile);
            const file = fileData.readAsText(loadFile);
            console.log(fileData);
        }
    };

}

