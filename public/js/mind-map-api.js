class MindMapApi {

    saveChanges(data, url, handleResponse, object) {
        this._sendAjaxRequest(data, url, handleResponse, object);
    }

    loadData(data, url, handleResponse, object) {
        this._sendAjaxRequest(data, url, handleResponse, object);
    }

    _ajaxWasBeenCompleted(handleResponse, response, object) {
        if (response.readyState === 4) {
            const data = response.responseText;
            handleResponse(data, object);
        }
    }

    _sendAjaxRequest(data, url, handleResponse, object) {
        let thisPtr = this;
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: url,
            data: data,
            complete: function (response) {
                thisPtr._ajaxWasBeenCompleted(handleResponse, response, object);
            }
        });
    }
}
