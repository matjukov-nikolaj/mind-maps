class DeleteMindMapController {

    constructor() {
        this._deleteMindMapHandler();
    }

    _deleteMindMapHandler() {
        const deleteIcons = document.getElementsByClassName("delete_file");
        for (let i = 0; i < deleteIcons.length; ++i)
        {
            const deleteIcon = deleteIcons[i];
            this._deleteClickedFile(deleteIcon);
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
        }
    }
}

const api = new MindMapApi();
const deleter = new DeleteMindMapController();