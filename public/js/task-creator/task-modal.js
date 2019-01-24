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
                const name = thisPtr.target.getAttribute("name");
                if (name === "tagCheckBox") {
                    thisPtr._checkBoxHandler(attribute, thisPtr);
                } else {
                    const data = {
                        id: attribute,
                    };
                    api.loadData(data, url.UPDATE_TASK, thisPtr._formFieldsController, thisPtr);
                }
            }
        }, false);
    }

    _checkBoxHandler(attribute, thisPtr) {
        const taskId = document.getElementById("update_task_id").value;
        const tagId = attribute;
        const add = document.getElementById("tag_" + tagId).checked;
        const data = {
            task_id: taskId,
            tag_id: tagId
        };
        if (add) {
            api.saveChanges(data, "/add_tag", () => {}, thisPtr);
        } else {
            api.saveChanges(data, "/remove_tag", () => {}, thisPtr);
        }

    }

    _formFieldsController(data, thisPtr) {
        try {
            thisPtr._createModal(thisPtr);
            const json = JSON.parse(data);
            const formFields = thisPtr._getFormFields();
            thisPtr._setFormFields(json.entity, formFields);
            const formFieldsValues = thisPtr._getFormFieldsValues(formFields);
            thisPtr._setCheckBox(json.tags);
            thisPtr._buttonsClickHandler(thisPtr, formFieldsValues);
        } catch (e) {
            console.log(e.message);
        }
    }

    _setCheckBox(tags) {
        if (tags.length === 0 || tags === null || tags === undefined) {
            return;
        }
        for (let i = 0; i < tags.length; ++i) {
            const tag = tags[i];
            const checkBox = document.getElementById("tag_" + tag.tag_id);
            checkBox.checked = true;
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
        formFields.endTimeYear.value = date.getFullYear();
        formFields.endTimeMonth.value = date.getMonth() + 1;
        formFields.endTimeDay.value = date.getDate();
        formFields.endTimeHour.value = date.getHours();
        formFields.endTimeMinutes.value = date.getMinutes();
    }

    _getFormFieldsValues(formFields) {
        return {
            name: formFields.name.value.replaceAll(",", ""),
            description: formFields.description.value,
            endTimeYear: formFields.endTimeYear.value,
            endTimeMonth: formFields.endTimeMonth.value,
            endTimeDay: formFields.endTimeDay.value,
            endTimeHour: formFields.endTimeHour.value,
            endTimeMinutes: formFields.endTimeMinutes.value,
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
                window.location.reload();
            } else {
                alert("This task already completed.");
            }
        };
        const deleteTaskButton = document.getElementById("deleteTaskButton");
        deleteTaskButton.onclick = () => {
            const data = {
                id: formFieldsValues.id,
            };
            api.saveChanges(data, url.DELETE_TASK, () => {
                window.location = "/personal";
            }, thisPtr);

        };
        const addTagButton = document.getElementById("addTagsButton");
        const tagContainer = document.getElementById("checkBoxContainer");
        const closeTagContainer = document.getElementById("closeCheckBoxContainer");
        addTagButton.onclick = () => {
            tagContainer.style.display = 'block';
            addTagButton.style.display = 'none';
        };
        closeTagContainer.onclick = () => {
            tagContainer.style.display = 'none';
            addTagButton.style.display = 'block';
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
            rhs.name === lhs.name &&
            rhs.description === lhs.description &&
            rhs.endTimeYear === lhs.endTimeYear &&
            rhs.endTimeMonth === lhs.endTimeMonth &&
            rhs.endTimeDay === lhs.endTimeDay &&
            rhs.endTimeHour === lhs.endTimeHour &&
            rhs.endTimeMinutes === lhs.endTimeMinutes
        );
    }

}