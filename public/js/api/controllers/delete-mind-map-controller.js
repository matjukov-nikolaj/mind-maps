class DeleteMindMapController {

    constructor() {
        this.deletedIconsCounter = 0;
        this.deletedIconsLength = 0;
        this._deleteMindMapHandler();
    }

    _deleteMindMapHandler() {
        const deleteIcons = document.getElementsByClassName("delete_file");
        this.deletedIconsLength = deleteIcons.length;
        for (let i = 0; i < this.deletedIconsLength; ++i)
        {
            const deleteIcon = deleteIcons[i];
            this._deleteClickedFile(deleteIcon);
            if (this.deletedIconsCounter === deleteIcons.length) {
                window.location.reload();
                this.deletedIconsCounter = 0;
            }
        }
    }

    _deleteClickedFile(deleteIcon) {
        deleteIcon.onclick = () => {
            const deleteIconMainParent = deleteIcon.parentNode.parentNode;
            const mindMapName = deleteIconMainParent.children[1].firstChild.nextSibling.innerText;
            const data = {
                data: {
                    data: null,
                    name: mindMapName
                }
            };
            api.saveChanges(data, url.DELETE, () => {}, this);
            deleteIconMainParent.style.display = 'none';
            this.deletedIconsCounter++;
            if (this._checkForEmptyField()) {
                window.location.reload();
                this.deletedIconsCounter = 0;
                this.deletedIconsLength = 0;
            }
        };
    }

    _checkForEmptyField() {
        return this.deletedIconsCounter === this.deletedIconsLength;
    }
}
