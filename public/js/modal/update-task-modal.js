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
        const crateTaskButton = document.getElementById('updateTaskButton');
        crateTaskButton.onclick = () => {
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

    _getValueOfElement(element) {
        return document.getElementById(element).value;
    }
}