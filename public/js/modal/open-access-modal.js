class OpenAccess {

    constructor() {
        this.modalLoad = document.getElementById("modalOpenAccess");
        this.modalLoadFile = document.getElementById("modalOpenAccessContainer");
        this.openButton = document.getElementById("openAccess");
        this.closeButton = document.getElementById("closeOpenAccess");
        this.modal = new Modal(this.modalLoad, this.modalLoadFile, this.openButton, this.closeButton);
        this._modalHandler();
    }

    _modalHandler() {
        const openAccessButton = document.getElementById("openAccessButton");
        openAccessButton.onclick = () => {
            const task = document.getElementById("open_access_task_name");
            const user = document.getElementById("open_access_user_name");
            if (task.value === "" || user.value === "") {
                alert("Fill all fields.");
            } else {
                document.getElementById("open_access_task_id").value = task.value;
                document.getElementById("open_access_user_id").value = user.value;
                document.getElementById("submitOpenAccessButton").click();
            }
        };
        this._addMouseClickListener();
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
                if (nameAttribute !== 'access') {
                    return;
                }
                const data = {
                    id: attribute,
                };
                api.saveChanges(data, url.DELETE_ACCESS, () => {}, thisPtr);
                const mainParent = thisPtr.target.parentNode.parentNode;
                thisPtr.target.parentNode.parentNode.removeChild(thisPtr.target.parentNode);
                if (mainParent.children.length === 0) {
                    mainParent.parentNode.parentNode.removeChild(mainParent.parentNode);
                    window.location.reload();
                }
            }
        }, false);
    }
}