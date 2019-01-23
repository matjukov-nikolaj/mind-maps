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

        const 

        const fromTimeYear = document.getElementById("statistic_form_from_date_year");
        const fromTimeMonth = document.getElementById("statistic_form_from_date_month");
        const fromTimeDay = document.getElementById("statistic_form_from_date_day");
        const fromTimeHour = document.getElementById("statistic_form_from_time_hour");
        const fromTimeMinutes = document.getElementById("statistic_form_from_time_minute");

        const toTimeYear = document.getElementById("statistic_form_to_date_year");
        const toTimeMonth = document.getElementById("statistic_form_to_date_month");
        const toTimeDay = document.getElementById("statistic_form_to_date_day");
        const toTimeHour = document.getElementById("statistic_form_to_time_hour");
        const toTimeMinutes = document.getElementById("statistic_form_to_time_minute");
    }
}