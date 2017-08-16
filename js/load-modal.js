class loadModal {
    constructor(tree) {
        this.tree = tree;
        this.modalLoad = document.getElementById("modalLoad");
        this.modalLoad.focus();
        this.modalLoadFile = document.getElementById("modalLoadFile");
        this.openButton = document.getElementById("openLoad");
        this.closeButton = document.getElementById("closeLoad");
        this.onLoadTree = () => {};
        this.openLoadWindow = new Modal(this.modalLoad, this.modalLoadFile, this.openButton, this.closeButton);
        this._processLoadFile();
    }

    _processLoadFile() {
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
                this.openLoadWindow.hideModal(this.modalLoad, this.modalLoadFile);
            };
        }
    }
}