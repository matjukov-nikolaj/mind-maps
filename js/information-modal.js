class InformationModal {
    constructor(tree) {
        this.modalInformation = document.getElementById("modalInformation");
        this.modalInformation.focus();
        this.modalContent = document.getElementById("modalContents");
        this.openInformation = document.getElementById("openInformation");
        this.closeInformation = document.getElementById("closeInformation");
        this._addOpenThemeButtonClickHandler();
    }

    _addOpenThemeButtonClickHandler() {
        const openSelectTheme = new Modal(this.modalInformation, this.modalContent, this.openInformation, this.closeInformation);
    };
}