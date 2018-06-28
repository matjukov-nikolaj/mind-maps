class DownloadController {
    constructor() {
        this.name = null;
        this._addDownloadButtonClickHandler();
    }

    _addDownloadButtonClickHandler() {
        const downloadButtons = document.getElementsByClassName("mind_map_download_icon");
        for (let i = 0; i < downloadButtons.length; ++i) {
            const downloadButton = downloadButtons[i];
            downloadButton.onclick = () => {
                const downloadButtonParent = downloadButton.parentNode;
                this.name = downloadButtonParent.firstChild.nextSibling.children[0].innerText;
                const data = {
                    name: this.name
                };
                api.loadData(data, url.VALUE, this._downloadMindMap, this);
            }
        }
    }

    _downloadMindMap(value, thisPtr) {
        const blob = new Blob([value], {type: 'application/json'});
        saveAs(blob, thisPtr.name + ".json");
    }
}

const downloadController = new DownloadController();