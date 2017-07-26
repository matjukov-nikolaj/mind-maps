window.onload = function() {
    let myModal = document.getElementById("my_modal");
    let modalContent = document.getElementById('modal_contents');

    let modalOpen = document.querySelector("#modalOpen");

    modalOpen.onclick = function () {
        myModal.classList.add("js_open");
        modalContent.classList.add("js_modal_content");
    };

    let modalClose = document.getElementById('close');

    modalClose.onclick = function () {
        myModal.classList.remove("js_open");
        modalContent.classList.remove("js_modal_content");
    };
};
