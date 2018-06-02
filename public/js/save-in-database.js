class SaveInDatabase {
    constructor(tree) {
        this.tree = tree;
        this._addSaveToDatabaseButtonClickHandler();
    }

    _addSaveToDatabaseButtonClickHandler() {
        const saveToDBButton = document.getElementById("saveToDatabase");
        saveToDBButton.onclick = () => {
            const saver = new TreeSaver();
            const json = saver.save(this.tree);
            console.log("ara", JSON.stringify(json));
            const jsonStr = JSON.stringify(json);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/mind_maps_save',
                data: {
                    data: {
                        name: 'name_mm_123',
                        data: jsonStr
                    }
                },
                success: function (data) {
                    $('.results').html(data);
                }
            });
        }
    }

}