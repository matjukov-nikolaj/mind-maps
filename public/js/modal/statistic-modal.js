class StatisticModal {

    constructor(api) {
        this.api = api;
        this.modalWidnow = document.getElementById("modalStatistic");
        this.modalContainer = document.getElementById("modalStatisticContainer");
        this.openModal = document.getElementById("statisticOpen");
        this.closeModal = document.getElementById("closeStatistic");
        this.modal = new Modal(this.modalWidnow, this.modalContainer, this.openModal, this.closeModal);
        this._handleStatistic();
    }

    _handleStatistic() {
        const getButton = document.getElementById("getStatisticButton");
        let thisPtr = this;
        getButton.onclick = () => {
            let successCheckBox = document.getElementById("statistic_form_success");
            let failedCheckBox = document.getElementById("statistic_form_failed");
            let progressCheckBox = document.getElementById("statistic_form_progress");

            if (!successCheckBox.checked && !failedCheckBox.checked && !progressCheckBox.checked) {
                alert("Please select checkbox.");
                return;
            }

            let fromTimeYear = document.getElementById("statistic_form_from_date_year");
            let fromTimeMonth = document.getElementById("statistic_form_from_date_month");
            let fromTimeDay = document.getElementById("statistic_form_from_date_day");
            let fromTimeHour = document.getElementById("statistic_form_from_time_hour");
            let fromTimeMinutes = document.getElementById("statistic_form_from_time_minute");

            let from = fromTimeYear.value + "-"
                + fromTimeMonth.value + "-"
                + fromTimeDay.value + " "
                + fromTimeHour.value + ":"
                + fromTimeMinutes.value + ":"
                + "00";

            let toTimeYear = document.getElementById("statistic_form_to_date_year");
            let toTimeMonth = document.getElementById("statistic_form_to_date_month");
            let toTimeDay = document.getElementById("statistic_form_to_date_day");
            let toTimeHour = document.getElementById("statistic_form_to_time_hour");
            let toTimeMinutes = document.getElementById("statistic_form_to_time_minute");

            let to = toTimeYear.value + "-"
                + toTimeMonth.value + "-"
                + toTimeDay.value + " "
                + toTimeHour.value + ":"
                + toTimeMinutes.value + ":"
                + "00";


            from = new Date(from);
            to = new Date(to);

            from = from.getTime() / 1000;
            to = to.getTime() / 1000;

            if (to < from) {
                alert("To not can be greater that from.")
                return;
            }

            const data = {
                from: from,
                to: to,
                success: successCheckBox.checked,
                failed: failedCheckBox.checked,
                progress: progressCheckBox.checked
            };

            api.loadData(data, "/get_statistic", this._handleStatisticResponse, thisPtr);
            successCheckBox.checked = false;
            failedCheckBox.checked = false;
            progressCheckBox.checked = false;

            fromTimeYear.value = 2014;
            fromTimeMonth.value = 1;
            fromTimeDay.value = 1;
            fromTimeHour.value = 0;
            fromTimeMinutes.value = 0;

            toTimeYear.value = 2014;
            toTimeMonth.value = 1;
            toTimeDay.value = 1;
            toTimeHour.value = 0;
            toTimeMinutes.value = 0;

        };

    }

    _handleStatisticResponse(data, thisPtr) {
        const json = JSON.parse(data);
        if (json.length === 0) {
            alert('Tasks not found.');
            return;
        }
        const formStat = document.getElementById("formStat");
        formStat.style.display = 'none';
        const parentSuccess = document.getElementById("success");
        const headerSuccess = document.getElementById("successHeader");
        const parentFailed = document.getElementById("failed");
        const headerFailed = document.getElementById("failedHeader");
        const parentProgress = document.getElementById("progress");
        const headerProgress = document.getElementById("progressHeader");
        const successBlock = document.getElementById("successBlock");
        const failedBlock = document.getElementById("failedBlock");
        const progressBlock = document.getElementById("progressBlock");
        for (let i = 0; i < json.length; ++i) {
            const item = json[i];
            if (item.complete_name === "Success") {
                successBlock.style.display = "block";
                headerSuccess.innerText = "Success: " + item.count_task;
                const children = item.task_name.split(',');
                for (let j = 0; j < children.length; ++j) {
                    let element = document.createElement('h3');
                    element.setAttribute('class', 'create_task_title');
                    element.innerText = children[j];
                    parentSuccess.appendChild(element);
                }
            } else if (item.complete_name === "Failed") {
                failedBlock.style.display = "block";
                headerFailed.innerText = "Failed: " + item.count_task;
                const children = item.task_name.split(',');
                for (let j = 0; j < children.length; ++j) {
                    let element = document.createElement('h3');
                    element.setAttribute('class', 'create_task_title');
                    element.innerText = children[j];
                    parentFailed.appendChild(element);
                }
            } else if (item.complete_name === "In progress") {
                progressBlock.style.display = "block";
                headerProgress.innerText = "In progress: " + item.count_task;
                const children = item.task_name.split(',');
                for (let j = 0; j < children.length; ++j) {
                    let element = document.createElement('h3');
                    element.setAttribute('class', 'create_task_title');
                    element.innerText = children[j];
                    parentProgress.appendChild(element);
                }
            }
        }
        const statsShower = document.getElementById("statsShower");
        statsShower.style.display = 'block';
        const closeButton = document.getElementById("closeStatisticIcon");
        closeButton.onclick = () => {
            headerSuccess.innerHTML = "";
            headerFailed.innerHTML = "";
            headerProgress.innerHTML = "";
            parentSuccess.innerHTML = "";
            parentFailed.innerHTML = "";
            parentProgress.innerHTML = "";
            formStat.style.display = 'block';
            statsShower.style.display = 'none';
            successBlock.style.display = 'none';
            failedBlock.style.display = 'none';
            progressBlock.style.display = 'none';
        }
    }
}