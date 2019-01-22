class TaskModal {
    constructor() {
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
                const data = {
                    id: attribute,
                };
                api.loadData(data, url.UPDATE_TASK, thisPtr._formFieldsController, thisPtr);
            }
        }, false);
    }

    _formFieldsController(data, thisPtr) {
        try {
            thisPtr._createModal(thisPtr);
            const json = JSON.parse(data);
            const formFields = thisPtr._getFormFields();
            thisPtr._setFormFields(json, formFields);
            const formFieldsValues = thisPtr._getFormFieldsValues(formFields);
            thisPtr._buttonsClickHandler(thisPtr, formFieldsValues);
        } catch (e) {
            console.log(e.message);
        }
    }

    _createModal(thisPtr) {
        thisPtr.modalUpdateTask = document.getElementById("modalUpdateTask");
        thisPtr.modalUpdateTaskForm = document.getElementById("modalUpdateTaskForm");
        thisPtr.openButton = thisPtr.target;
        thisPtr.closeButton = document.getElementById("closeUpdateTask");
        thisPtr.modal = new AutoModal(thisPtr.modalUpdateTask, thisPtr.modalUpdateTaskForm, thisPtr.openButton, thisPtr.closeButton);
    }

    _setFormFields(json, formFields) {
        const timestamp = parseInt(json.endTime.timestamp) * 1000;
        let date = new Date(timestamp);
        formFields.id.style.display = 'none';
        formFields.complete.style.display = 'none';
        formFields.id.value = json.id;
        formFields.complete.value = json.complete;
        formFields.name.value = json.name;
        formFields.description.value = json.description;
        formFields.parent.value = json.parent;
        formFields.endTimeYear.value = date.getUTCFullYear();
        formFields.endTimeMonth.value = date.getUTCMonth() + 1;
        formFields.endTimeDay.value = date.getUTCDate();
        formFields.endTimeHour.value = date.getUTCHours();
        formFields.endTimeMinutes.value = date.getUTCMinutes();
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
            id: formFields.id.value,
            complete: formFields.complete.value,
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
            id: document.getElementById("update_task_id"),
            complete: document.getElementById("update_task_complete"),
        }
    }

    _buttonsClickHandler(thisPtr, formFieldsValues) {
        const updateButton = document.getElementById("updateTaskButton");
        updateButton.onclick = () => {
            const currentFormFields = thisPtr._getFormFields();
            const currentFormFieldsValues = thisPtr._getFormFieldsValues(currentFormFields);
            if (thisPtr._isInvalidParent(currentFormFieldsValues, formFieldsValues)) {
                alert("The root of the task cannot have a parent.");
                return;
            }
            if (!thisPtr._isEqualsFields(currentFormFieldsValues, formFieldsValues)) {
                const taskEndTime = this._getObjectOfEndTime();
                const currentTime = this._getCurrentDate();
                if (!this._isValidDate(taskEndTime, currentTime)) {
                    alert("The end date of the task should be greater than the current date.");
                    return;
                }
                document.getElementById("submitTaskButton").click();
            }
        };
        const closeTaskButton = document.getElementById("closeTaskButton");
        closeTaskButton.onclick = () => {
            if (formFieldsValues.complete === "0") {
                const data = {
                    id: formFieldsValues.id,
                };
                api.loadData(data, url.CLOSE_TASK, thisPtr._closeTaskMessage, thisPtr);
            } else {
                alert("This task already completed.");
            }
        };
        const deleteTaskButton = document.getElementById("deleteTaskButton");
        deleteTaskButton.onclick = () => {
            const data = {
                id: formFieldsValues.id,
            };
            api.saveChanges(data, url.DELETE_TASK, () => {}, this)
        }
    }

    _closeTaskMessage(data, thisPtr) {
        alert("Task closed.");
        window.location.reload();
    }

    _isInvalidParent(lhs, rhs) {
        return rhs.parent === "" && lhs.parent !== "";
    }

    _isValidDate(lhs, rhs) {
        if (lhs.year > rhs.year) {
            return true;
        }
        if (lhs.year < rhs.year) {
            return false;
        }
        if (lhs.month > rhs.month) {
            return true;
        }
        if (lhs.month < rhs.month) {
            return false;
        }
        if (lhs.day > rhs.day) {
            return true;
        }
        if (lhs.day < rhs.day) {
            return false;
        }
        if (lhs.hour > rhs.hour) {
            return true;
        }
        if (lhs.hour < rhs.hour) {
            return false;
        }
        if (lhs.minutes > rhs.minutes) {
            return true;
        }
        if (lhs.minutes < rhs.minutes) {
            return false;
        }
    }

    _getObjectOfEndTime() {
        return {
            year: this._getValueOfElement("update_task_end_time_date_year"),
            month: this._getValueOfElement("update_task_end_time_date_month"),
            day: this._getValueOfElement("update_task_end_time_date_day"),
            hour: this._getValueOfElement("update_task_end_time_time_hour"),
            minutes: this._getValueOfElement("update_task_end_time_time_minute"),
        };
    }

    _getCurrentDate() {
        const currentDate = new Date();
        return {
            year: currentDate.getFullYear().toString(),
            month: (currentDate.getMonth() + 1).toString(),
            day: currentDate.getDate().toString(),
            hour: currentDate.getHours().toString(),
            minutes: currentDate.getMinutes().toString(),
        }
    }

    _getValueOfElement(element) {
        return document.getElementById(element).value;
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

}