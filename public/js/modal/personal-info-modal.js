class PersonalInfo {

    constructor(api) {
        this.api = api;
        this.modalLoad = document.getElementById("modalPersonal");
        this.modalLoadFile = document.getElementById("modalPersonalInfo");
        this.openButton = document.getElementById("openProfile");
        this.closeButton = document.getElementById("closePersonal");
        this.modal = new Modal(this.modalLoad, this.modalLoadFile, this.openButton, this.closeButton);
        this._personalModalHandler();
    }

    _personalModalHandler() {
        api.loadData({}, url.USER_INFO, this._loadedUserInfo, this);
    }

    _loadedUserInfo(value, thisPtr) {
        const json = JSON.parse(value);
        const closeButton = document.getElementById("closeUpdateUserInfo");
        const personalForm = document.getElementById("personalForm");
        const personalInfo = document.getElementById("personalInfo");
        if (json.firstName === null && json.lastName === null && json.middleName === null && json.photo === null) {
            personalInfo.style.display = "none";
            personalForm.style.display = "block";
            closeButton.style.display = "none";
            const photoField = document.getElementById("user_model_photo");
            photoField.setAttribute("accept", ".jpg,.jpeg,.png");
            const saveUserInfoButton = document.getElementById("saveUserInfoButton");
            saveUserInfoButton.onclick = () => {
                const fileName = document.getElementById("user_model_photo").value;
                if (fileName === "") {
                    alert("Please, select a file.");
                    return;
                }
                if (document.getElementById("user_model_firstName").value === "") {
                    alert("Please, fill the field <first name>");
                    return;
                }
                if (document.getElementById("user_model_lastName").value === "") {
                    alert("Please, fill the field <last name>");
                    return;
                }
                if (document.getElementById("user_model_middleName").value === "") {
                    alert("Please, fill the field <middle name>");
                    return;
                }
                const extension = fileName.split(".").pop();
                if (extension === "jpg" || extension === "png" || extension === "jpeg") {
                    document.getElementById("submitUserInfoForm").click();
                } else {
                    alert("Use (jpg, jpeg, png) format");
                }
            };
        } else {
            closeButton.style.display = "block";
            document.getElementById("personalInfo").style.display = "block";
            document.getElementById("personalForm").style.display = "none";
            const photo = document.getElementById("userImage");
            photo.setAttribute('src', '/uploads/photos/' + json.photo);
            document.getElementById("firstName").innerText = "First name: " + json.firstName;
            document.getElementById("secondName").innerText = "Second name: " + json.lastName;
            document.getElementById("middleName").innerText = "Middle name: " + json.middleName;
            const editButton = document.getElementById("editPersonalInfoButton");
            editButton.onclick = () => {
                document.getElementById("personalInfo").style.display = "none";
                document.getElementById("personalForm").style.display = "block";
                document.getElementById("user_model_firstName").value = json.firstName;
                document.getElementById("user_model_lastName").value = json.lastName;
                document.getElementById("user_model_middleName").value = json.middleName;
            };
            const closeEditButton = document.getElementById("closeUpdateUserInfo");
            closeEditButton.onclick = () => {
                document.getElementById("personalInfo").style.display = "block";
                document.getElementById("personalForm").style.display = "none";
            };
            const photoField = document.getElementById("user_model_photo");
            photoField.setAttribute("accept", ".jpg,.jpeg,.png");
            const saveUserInfoButton = document.getElementById("saveUserInfoButton");
            saveUserInfoButton.onclick = () => {
                const fileName = document.getElementById("user_model_photo").value;
                if (fileName === "") {
                    alert("Please, select a file.");
                    return;
                }
                if (document.getElementById("user_model_firstName").value === "") {
                    alert("Please, fill the field <first name>");
                    return;
                }
                if (document.getElementById("user_model_lastName").value === "") {
                    alert("Please, fill the field <last name>");
                    return;
                }
                if (document.getElementById("user_model_middleName").value === "") {
                    alert("Please, fill the field <middle name>");
                    return;
                }
                const extension = fileName.split(".").pop();
                if (extension === "jpg" || extension === "png" || extension === "jpeg") {
                    document.getElementById("submitUserInfoForm").click();
                } else {
                    alert("Use (jpg, jpeg, png) format");
                }
            };
        }
    }

}
