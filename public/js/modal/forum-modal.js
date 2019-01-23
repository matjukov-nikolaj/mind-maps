class ForumModal {

    constructor(api) {
        this.api = api;
        this.modalWidnow = document.getElementById("modalForum");
        this.modalContainer = document.getElementById("modalForumContainer");
        this.openModal = document.getElementById("openForum");
        this.closeModal = document.getElementById("closeForum");
        this.modal = new Modal(this.modalWidnow, this.modalContainer, this.openModal, this.closeModal);
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
                if (nameAttribute === 'forum') {
                    const data = {
                        id: attribute,
                    };
                    thisPtr._openCommentField(attribute, thisPtr);
                }
                if (nameAttribute === 'comment') {
                    thisPtr._deleteComment(attribute, thisPtr);
                }
            }
        }, false);
    }

    _openCommentField(attribute, thisPtr) {
        const commentButton = document.getElementById("commentButton_" + attribute);
        const commentBlock = document.getElementById("commentContainer_" + attribute);
        commentButton.style.display = "none";
        commentBlock.style.display = "block";
        const closeComment = document.getElementById("closeComment_" + attribute);
        closeComment.onclick = () => {
            commentButton.style.display = "inline-block";
            commentBlock.style.display = "none";
        };
        const saveButton = document.getElementById("saveCommentButton_" + attribute);
        saveButton.onclick = () => {
            const commitText = document.getElementById("comment_" + attribute);
            if (commitText.value === "") {
                alert("Please write a comment.");
                return;
            }
            const data = {
                id: attribute,
                value: commitText.value
            };
            this.api.saveChanges(data, '/create_comment', () => {}, thisPtr);
            window.location.reload();
        }
    }

    _deleteComment(attribute, thisPtr) {
        const data = {
            id: attribute,
        };
        api.saveChanges(data, "/delete_comment", () => {}, thisPtr);
        const mainParent = thisPtr.target.parentNode.parentNode;
        thisPtr.target.parentNode.parentNode.removeChild(thisPtr.target.parentNode);
    }


}