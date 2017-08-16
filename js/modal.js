class Modal {
    constructor(modalGeneral, modalPrivate, openButton, closeButton) {
        this.modalGeneral = modalGeneral;
        this.modalPrivate = modalPrivate;
        this.openButton = openButton;
        this.openButton.onclick = () => {
            this._showModal(this.modalGeneral, this.modalPrivate);
        };
        this.closeButton = closeButton;
    }

    _showModal(modalGeneral, modalPrivate) {
        modalGeneral.classList.add("open_modal_window");
        modalPrivate.classList.add("open_modal_content");
        this.closeButton.onclick = () => {
            this.hideModal(this.modalGeneral, this.modalPrivate);
        }
    }

    hideModal(modalGeneral, modalPrivate) {
        modalGeneral.classList.remove("open_modal_window");
        modalPrivate.classList.remove("open_modal_content");
    }
}