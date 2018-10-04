class TaskModal {
    constructor() {
        this._addMouseClickListener();
    }

    _addMouseClickListener() {
        let thisPtr = this;
        document.addEventListener('click', function(e) {
            e = e || window.event;
            thisPtr.target = e.target || e.srcElement;
            const attribute = thisPtr.target.getAttribute("data-id");
            if (attribute !== null) {
                thisPtr._createModal(thisPtr);
                const data = {
                    id: attribute,
                };
                // document.getElementById("update_task_id").value = attribute;
                api.loadData(data, url.UPDATE_TASK, thisPtr._formFieldsController, thisPtr);
            }
        }, false);
    }

    _formFieldsController(data, thisPtr) {
        try {
            thisPtr.target.click();
            const json = JSON.parse(data);
            const formFields = thisPtr._getFormFields();
            thisPtr._setFormFields(json, formFields);
            const formFieldsValues = thisPtr._getFormFieldsValues(formFields);
            thisPtr._submitFormClickHandler(thisPtr, formFieldsValues);
        } catch (e) {
            console.log(e.message);
        }
    }

    _createModal(thisPtr) {
        thisPtr.modalUpdateTask = document.getElementById("modalUpdateTask");
        thisPtr.modalUpdateTaskForm = document.getElementById("modalUpdateTaskForm");
        thisPtr.openButton = thisPtr.target;
        thisPtr.closeButton = document.getElementById("closeUpdateTask");
        thisPtr.modal = new Modal(thisPtr.modalUpdateTask, thisPtr.modalUpdateTaskForm, thisPtr.openButton, thisPtr.closeButton);
    }

    _setFormFields(json, formFields) {
        const timestamp = parseInt(json.endTime.timestamp) * 1000;
        let date = new Date();
        date.setTime(timestamp);
        formFields.name.value = json.name;
        formFields.description.value = json.description;
        formFields.parent.value = json.parent;
        formFields.endTimeYear.value = date.getFullYear();
        formFields.endTimeMonth.value = date.getMonth() + 1;
        formFields.endTimeDay.value = date.getDay();
        formFields.endTimeHour.value = date.getHours();
        formFields.endTimeMinutes.value = date.getMinutes();
    }

    _getFormFieldsValues(formFields) {
        return {
            name: formFields.name.value,
            description: formFields.description.value,
            endTimeYear: formFields.endTimeYear.value,
            endTimeMonth: formFields.endTimeMonth.value,
            endTimeDay: formFields.endTimeDay.value,
            endTimeHour: formFields.endTimeHour.value,
            endTimeMinutes: formFields.endTimeMinutes.value,
            parent: formFields.parent.value,
        }
    }

    _getFormFields() {
        return {
            name: document.getElementById("update_task_name"),
            description: document.getElementById("update_task_description"),
            endTimeYear: document.getElementById("update_task_end_time_date_year"),
            endTimeMonth: document.getElementById("update_task_end_time_date_month"),
            endTimeDay: document.getElementById("update_task_end_time_date_day"),
            endTimeHour: document.getElementById("update_task_end_time_time_hour"),
            endTimeMinutes: document.getElementById("update_task_end_time_time_minute"),
            parent: document.getElementById("update_task_parent"),
        }
    }

    _submitFormClickHandler(thisPtr, formFieldsValues) {
        const updateButton = document.getElementById("updateTaskButton");
        updateButton.onclick = () => {
            const currentFormFields = thisPtr._getFormFields();
            const currentFormFieldsValues = thisPtr._getFormFieldsValues(currentFormFields);
            if (!thisPtr._isValidParent(currentFormFieldsValues, formFieldsValues)) {
                alert("The root of the task cannot have a parent.");

            } else if (!thisPtr._isEqualsFields(currentFormFieldsValues, formFieldsValues)) {
                document.getElementsByName("update_task")[0].submit();
            }
        }
    }

    _isValidParent(lhs, rhs) {
        return rhs.parent === "" && lhs.parent !== "";
    }

    _isEqualsFields(lhs, rhs) {
        return (
            rhs.parent === lhs.parent &&
            rhs.name === lhs.name &&
            rhs.description === lhs.description &&
            rhs.endTimeYear === lhs.endTimeYear &&
            rhs.endTimeMonth.value === lhs.endTimeMonth &&
            rhs.endTimeDay === lhs.endTimeDay &&
            rhs.endTimeHour === lhs.endTimeHour &&
            rhs.endTimeMinutes === lhs.endTimeMinutes
        );
    }

    // addTaskModalHandler(targetElement, attribute) {
    //     this.modalUpdateTask = document.getElementById("modalUpdateTask");
    //     this.modalUpdateTaskForm = document.getElementById("modalUpdateTaskForm");
    //     this.openButton = targetElement;
    //     this.closeButton = document.getElementById("closeUpdateTask");
    //     this.modal = new Modal(this.modalUpdateTask, this.modalUpdateTaskForm, this.openButton, this.closeButton);
    //     targetElement.click();
    //     const data = {
    //         id: attribute,
    //     };
    //     api.sendRequest(data, url.UPDATE_TASK);
    // }



}