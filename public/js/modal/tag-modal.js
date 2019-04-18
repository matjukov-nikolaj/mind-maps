class TagModal {

    constructor() {
        this.modalWidnow = document.getElementById("modalTag");
        this.modalContainer = document.getElementById("modalTagContainer");
        this.openModal = document.getElementById("openTag");
        this.closeModal = document.getElementById("closeTag");
        this.modal = new Modal(this.modalWidnow, this.modalContainer, this.openModal, this.closeModal);
        this._nameHandler();
        this._addMouseClickListener();
    }

    _nameHandler() {
        const saveButton = document.getElementById("saveTagButton");
        saveButton.onclick = () => {
            let inputSaver = document.getElementById("tag_name");
            const name = inputSaver.value.replace(new RegExp('[^а-яА-Яa-zA-Z0-9_-]', 'u'), "");
            const data = {
                name: name
            };
            api.loadData(data, "/check_tag_name", this._checkNameResponseHandler, this);
        }
    }

    _checkNameResponseHandler(data, thisPtr) {
        if (data === "") {
            document.getElementById("saveTagButtonSubmit").click();
        } else {
            alert("This tag name already exist");
        }
    }

    _addMouseClickListener() {
        let thisPtr = this;
        document.addEventListener('click', function (e) {
            e = e || window.event;
            thisPtr.target = e.target || e.srcElement;
            const attribute = thisPtr.target.getAttribute("data-id");
            if (attribute === null) {
                return;
            } else {
                const nameAttribute = thisPtr.target.getAttribute("name");
                if (nameAttribute === 'tag') {
                    const data = {
                        id: attribute,
                    };
                    api.saveChanges(data, "/delete_tag", () => {}, thisPtr);
                    const mainParent = thisPtr.target.parentNode.parentNode;
                    thisPtr.target.parentNode.parentNode.removeChild(thisPtr.target.parentNode);
                    if (mainParent.children.length === 0) {
                        mainParent.parentNode.parentNode.removeChild(mainParent.parentNode);
                        window.location.reload();
                    }
                }
            }
        }, false);
    }

}