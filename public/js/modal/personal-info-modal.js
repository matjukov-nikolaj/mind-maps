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
        const photoField = document.getElementById("user_info_photo");
        photoField.setAttribute("accept", ".jpg,.jpeg,.png");
        const saveUserInfoButton = document.getElementById("saveUserInfoButton");
        saveUserInfoButton.onclick = () => {
            const fileName = document.getElementById("user_info_photo").value;
            if (fileName === "") {
                alert("Please, select a file.");
                return;
            }
            if (document.getElementById("user_info_firstName").value === "") {
                alert("Please, fill the field <first name>");
                return;
            }
            if (document.getElementById("user_info_lastName").value === "") {
                alert("Please, fill the field <last name>");
                return;
            }
            if (document.getElementById("user_info_middleName").value === "") {
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
        api.loadData({}, url.USER_INFO, this._loadedUserInfo, this);
    }

    _loadedUserInfo(value, thisPtr) {
        console.log(value);
        if (value === "") {
            document.getElementById("personalForm").style.display = "block";
        } else {
            document.getElementById("personalInfo").style.display = "block";
            document.getElementById("personalForm").style.display = "none";
            const editButton = document.getElementById("editPersonalInfoButton");
            editButton.onclick = () => {
                document.getElementById("personalInfo").style.display = "none";
                document.getElementById("personalForm").style.display = "block";
                const data = JSON.parse(value);
                document.getElementById("user_info_firstName").value = data.firstName;
                document.getElementById("user_info_lastName").value = data.lastName;
                document.getElementById("user_info_middleName").value = data.middleName;
            };
            const closeEditButton = document.getElementById("closeUpdateUserInfo");
            closeEditButton.onclick = () => {
                document.getElementById("personalInfo").style.display = "block";
                document.getElementById("personalForm").style.display = "none";
            }
        }
    }

}
