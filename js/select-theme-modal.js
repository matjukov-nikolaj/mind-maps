class SelectThemeModal {
    constructor(tree) {
        this.modalTheme = document.getElementById("modalTheme");
        this.modalTheme.focus();
        this.modalContent = document.getElementById("modalContents");
        this.openTheme = document.getElementById("openSelectTheme");
        this.closeTheme = document.getElementById("closeTheme");
        this._openSelectTheme();
    }

    _openSelectTheme() {
        const openSelectTheme = new Modal(this.modalTheme, this.modalContent, this.openTheme, this.closeTheme);
    };
}