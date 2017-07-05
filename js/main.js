'use strict';

// Вспомогательное получение координат
function getCoordinates() {
    let canvas = document.getElementById('canvas');
    canvas.onclick = function (event) {
        let imgY = this.getBoundingClientRect().top;
        let imgX = this.getBoundingClientRect().left;
        let relativeY = event.clientY - imgY;
        let relativeX = event.clientX - imgX;
        console.log(relativeX + '  ' + relativeY)
    }
}
getCoordinates();

let allTree = new Tree("Main Section");

let drawAll = new TreeRenderer(allTree);
let arrowPress = new TreeController(allTree, drawAll);
arrowPress.controlAll();
drawAll.drawAllTree(arrowPress.selection);