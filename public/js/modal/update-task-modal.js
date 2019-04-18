class UpdateTaskModal {

    constructor() {
        this.modalCreateTask = document.getElementById("modalUpdateTask");
        this.modalCreateTaskForm = document.getElementById("modalUpdateTaskForm");
        this.openButton = document.getElementById("openUpdateTask");
        this.closeButton = document.getElementById("closeUpdateTask");
        this.modal = new Modal(this.modalCreateTask, this.modalCreateTaskForm, this.openButton, this.closeButton);
        this._addCreateTaskButtonClickHandler();
    }

    _addCreateTaskButtonClickHandler() {
        const updateTaskButton = document.getElementById('updateTaskButton');
        updateTaskButton.onclick = () => {
            const taskNameInput = document.getElementById("task_name");
            const taskName = this._getValueOfElement("task_name").replace(new RegExp('[^а-яА-Яa-zA-Z0-9_-]', 'u'), "");
            const descriptionValue = this._getValueOfElement("task_description");
            const taskEndTime = this._getObjectOfEndTime();
            const currentTime = this._getCurrentDate();
            if (!this._isValidDate(taskEndTime, currentTime)) {
                alert("The end date of the task should be greater than the current date.");
                event.preventDefault();
                return;
            }
        }
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
            year: this._getValueOfElement("task_end_time_date_year"),
            month:  this._getValueOfElement("task_end_time_date_month"),
            day: this._getValueOfElement("task_end_time_date_day"),
            hour: this._getValueOfElement("task_end_time_time_hour"),
            minutes: this._getValueOfElement("task_end_time_time_minute"),
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
}