'use strict';
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');
canvas.width = 1875;
canvas.height = 790;

// Вспомогательное получение координат
function getCoordinates() {
    canvas.onclick = function (event) {
        var imgY = this.getBoundingClientRect().top;
        var imgX = this.getBoundingClientRect().left;
        var relativeY = event.clientY - imgY;
        var relativeX = event.clientX - imgX;
        console.log(relativeX + '  ' + relativeY)
    }
}
getCoordinates();

// Рисуем элементы в виде прямоугольников
var counterRect = 0;
function drawElementRect(xLeftCorner, yLeftCorner, width, height, lineSize) {
    ctx.fillStyle = "#aaf0d1";
    ctx.fillRect(xLeftCorner, yLeftCorner, width, height);
    ctx.fillStyle = "#506a85";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    if (counterRect == 0) {
        ctx.fillText('Main section', xLeftCorner + (width / 2), yLeftCorner + (height / 1.7));
    } else {
        ctx.fillText('Main section ' + counterRect, xLeftCorner + (width / 2), yLeftCorner + (height / 1.7));
    }
    ctx.beginPath();
    ctx.fill();
    ctx.moveTo(xLeftCorner, yLeftCorner);
    ctx.lineTo(xLeftCorner + width, yLeftCorner);
    ctx.lineTo(xLeftCorner + width, yLeftCorner + height);
    ctx.lineTo(xLeftCorner, yLeftCorner + height);
    ctx.lineTo(xLeftCorner, yLeftCorner);
    ctx.strokeStyle = "#00a085";
    ctx.lineWidth = lineSize;
    ctx.stroke();
    counterRect++;
}

const
    X_LROOT = 840,
    Y_LROOT = 360,
    ROOT_WIDTH = 200,
    ROOT_HEIGHT = 70,
    ROOT_LINE_SIZE = 3,
    ELEMENT_LINE_SIZE = 2,
    ELEMENT_WIDTH = 150,
    ELEMENT_HEIGHT_INVISIBLE = 30,
    ELEMENT_HEIGHT = 50;

var counterLine = 1;
function drawElementLine(xLeftCorner, yLeftCorner, width, height, lineSize) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(xLeftCorner, yLeftCorner, width, height);
    ctx.fillStyle = "#506a85";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText('Subsection ' + counterLine, xLeftCorner + (width / 2), yLeftCorner + (height - lineSize));
    ctx.beginPath();
    ctx.fill();
    ctx.moveTo(xLeftCorner, yLeftCorner + height);
    ctx.lineTo(xLeftCorner + width, yLeftCorner + height);
    ctx.strokeStyle = "#00a085";
    ctx.lineWidth = "#00a085";
    ctx.stroke();
    counterLine++;
}

const
    INDENT = 5;
function drawOutline(xLeftCorner, yLeftCorner, width, height, borderStyle) {
    xLeftCorner -= INDENT;
    yLeftCorner -= INDENT;
    width += INDENT * 2;
    height += INDENT * 2;
    ctx.beginPath();
    ctx.fill();
    ctx.moveTo(xLeftCorner, yLeftCorner);
    ctx.lineTo(xLeftCorner + width, yLeftCorner);
    ctx.lineTo(xLeftCorner + width, yLeftCorner + height);
    ctx.lineTo(xLeftCorner, yLeftCorner + height);
    ctx.lineTo(xLeftCorner, yLeftCorner);
    ctx.strokeStyle = borderStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Коордианты начала(левый верхний угол) всех главных разделов
var border = ["#ffffff", "#506a85"];
var mainSection = [
    {x: 600, y1: 310, y2: 430},
    {x: 1130, y1: 220, y2: 310, y3: 430}
];
// Коордианты начала(левый верхний угол) всех подразделов
var subsection = [
    {x: 1300, y1: 160, y2: 230, y3: 300, y4: 350, y5: 420, y6: 470, y7: 530},
    {x: 1470, y1: 300, y2: 350, y3: 470},
    {x: 1640, y1: 300},
    {y: 240, x1: 90, x2: 260, x3: 430},
    {y: 300, x1: 430}
];

// var whlis = {
//     width: ELEMENT_WIDTH,
//     height: ELEMENT_HEIGHT,
//     lineSize: ELEMENT_LINE_SIZE
// };
// ============================================================================================================
// Отрисовка главного элемента
drawElementRect(X_LROOT, Y_LROOT, ROOT_WIDTH, ROOT_HEIGHT, ROOT_LINE_SIZE);
// Разделы первого уровня слева
drawElementRect(mainSection[0].x, mainSection[0].y1, ELEMENT_WIDTH, ELEMENT_HEIGHT, ELEMENT_LINE_SIZE);
drawElementRect(mainSection[0].x, mainSection[0].y2, ELEMENT_WIDTH, ELEMENT_HEIGHT, ELEMENT_LINE_SIZE);
// Разделы первого уровня справа
drawElementRect(mainSection[1].x, mainSection[1].y1, ELEMENT_WIDTH, ELEMENT_HEIGHT, ELEMENT_LINE_SIZE);
drawElementRect(mainSection[1].x, mainSection[1].y2, ELEMENT_WIDTH, ELEMENT_HEIGHT, ELEMENT_LINE_SIZE);
drawElementRect(mainSection[1].x, mainSection[1].y3, ELEMENT_WIDTH, ELEMENT_HEIGHT, ELEMENT_LINE_SIZE);
// Подразделы справа
drawElementLine(subsection[0].x, subsection[0].y1, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[0].x, subsection[0].y2, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[0].x, subsection[0].y3, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[0].x, subsection[0].y4, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[0].x, subsection[0].y5, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[0].x, subsection[0].y6, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[0].x, subsection[0].y7, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[1].x, subsection[1].y1, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[1].x, subsection[1].y2, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[1].x, subsection[1].y3, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[2].x, subsection[2].y1, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);

// Подразделы слева
drawElementLine(subsection[3].x1, subsection[3].y, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[3].x2, subsection[3].y, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[3].x3, subsection[3].y, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
drawElementLine(subsection[4].x1, subsection[4].y, ELEMENT_WIDTH, ELEMENT_HEIGHT_INVISIBLE, ELEMENT_LINE_SIZE);
// ============================================================================================================

// Сначала выделен центральный раздел
drawOutline(X_LROOT, Y_LROOT, ROOT_WIDTH, ROOT_HEIGHT, border[1]);

// Обработка нажатий стрелок
var leftArrow = {
        down: false,
        up: false,
        pressed: false
    },
    rightArrow = {
        down: false,
        up: false,
        pressed: false
    },
    topArrow = {
        down: false,
        up: false,
        pressed: false
    },
    bottomArrow = {
        down: false,
        up: false,
        pressed: false
    };

window.addEventListener("keydown", function(event) {
    switch (event.code) {
        case "ArrowLeft":
            leftArrow.down = true;
            break;
        case "ArrowUp":
            topArrow.down = true;
            break;
        case "ArrowRight":
            rightArrow.down = true;
            break;
        case "ArrowDown":
            bottomArrow.down = true;
    }
});

window.addEventListener("keyup", function(event) {
    switch (event.code) {
        case "ArrowLeft":
            leftArrow.up = true;
            break;
        case "ArrowUp":
            topArrow.up = true;
            break;
        case "ArrowRight":
            rightArrow.up = true;
            break;
        case "ArrowDown":
            bottomArrow.up = true;
    }
});

function checkPressing() {
    if ((leftArrow.down) && (leftArrow.up)) {
        leftArrow.pressed = true;
        console.log('leftArrow.pressed')
    }
    if ((rightArrow.down) && (rightArrow.up)) {
        rightArrow.pressed = true;
        console.log('rightArrow.pressed')
    }
    if ((topArrow.down) && (topArrow.up)) {
        topArrow.pressed = true;
        console.log('topArrow.pressed')
    }
    if ((bottomArrow.down) && (bottomArrow.up)) {
        bottomArrow.pressed = true;
        console.log('bottomArrow.pressed')
    }
}

window.setInterval(checkPressing, 5);

var lastX = X_LROOT,
    lastY = Y_LROOT,
    newX = 0,
    newY = 0;
function redraw() {
    // Main section -> Main section 4
    if ((rightArrow.pressed == true) && (lastX == X_LROOT) && (lastY == Y_LROOT)) {
        drawOutline(lastX, lastY, ROOT_WIDTH, ROOT_HEIGHT, border[0]);
        newX = mainSection[1].x;
        newY = mainSection[1].y2;
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        rightArrow.down = false;
        rightArrow.up = false;
        rightArrow.pressed = false;
        console.log('Root -> 4');
    }
    // Main section 4 -> Main section
    if ((leftArrow.pressed == true) && (lastX == mainSection[1].x) && (lastY == mainSection[1].y2)) {
        drawOutline(lastX, lastY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = X_LROOT;
        newY = Y_LROOT;
        drawOutline(newX, newY, ROOT_WIDTH, ROOT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        leftArrow.down = false;
        leftArrow.up = false;
        leftArrow.pressed = false;
        console.log('4 -> Root');
    }
    // Main section 4 -> main section 3
    if ((topArrow.pressed == true) && (lastX == mainSection[1].x) && (lastY == mainSection[1].y2)) {
        drawOutline(lastX, lastY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = mainSection[1].x;
        newY = mainSection[1].y1;
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        topArrow.down = false;
        topArrow.up = false;
        topArrow.pressed = false;
        console.log('4 -> 3');
    }
    // Main section 3 -> main section 4
    if ((bottomArrow.pressed == true) && (lastX == mainSection[1].x) && (lastY == mainSection[1].y1)) {
        drawOutline(lastX, lastY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = mainSection[1].x;
        newY = mainSection[1].y2;
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        bottomArrow.down = false;
        bottomArrow.up = false;
        bottomArrow.pressed = false;
        console.log('3 -> 4');
    }
    // Main section 4 -> Main section 5
    if ((bottomArrow.pressed == true) && (lastX == mainSection[1].x) && (lastY == mainSection[1].y2)) {
        drawOutline(lastX, lastY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = mainSection[1].x;
        newY = mainSection[1].y3;
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        bottomArrow.down = false;
        bottomArrow.up = false;
        bottomArrow.pressed = false;
        console.log('4 -> 5');
    }
    // Main section 5 -> Main section 4
    if ((topArrow.pressed == true) && (lastX == mainSection[1].x) && (lastY == mainSection[1].y3)) {
        drawOutline(lastX, lastY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = mainSection[1].x;
        newY = mainSection[1].y2;
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        topArrow.down = false;
        topArrow.up = false;
        topArrow.pressed = false;
        console.log('5 -> 4');
    }
    // Main section 5 -> Main section
    if ((leftArrow.pressed == true) && (lastX == mainSection[1].x) && (lastY == mainSection[1].y3)) {
        drawOutline(lastX, lastY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = X_LROOT;
        newY = Y_LROOT;
        drawOutline(newX, newY, ROOT_WIDTH, ROOT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        leftArrow.down = false;
        leftArrow.up = false;
        leftArrow.pressed = false;
        console.log('5 -> Root');
    }
    // Main section 3 -> Main section
    if ((leftArrow.pressed == true) && (lastX == mainSection[1].x) && (lastY == mainSection[1].y1)) {
        drawOutline(lastX, lastY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = X_LROOT;
        newY = Y_LROOT;
        drawOutline(newX, newY, ROOT_WIDTH, ROOT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        leftArrow.down = false;
        leftArrow.up = false;
        leftArrow.pressed = false;
        console.log('3 -> Root');
    }
    // Main section -> Main section 2
    if ((leftArrow.pressed == true) && (lastX == X_LROOT) && (lastY == Y_LROOT)) {
        drawOutline(lastX, lastY, ROOT_WIDTH, ROOT_HEIGHT, border[0]);
        newX = mainSection[0].x;
        newY = mainSection[0].y2;
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        leftArrow.down = false;
        leftArrow.up = false;
        leftArrow.pressed = false;
        console.log('Root -> 2');
    }
    // Main section 2 -> Main section
    if ((rightArrow.pressed == true) && (lastX == mainSection[0].x) && (mainSection[0].y2)) {
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = X_LROOT;
        newY = Y_LROOT;
        drawOutline(newX, newY, ROOT_WIDTH, ROOT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        rightArrow.down = false;
        rightArrow.up = false;
        rightArrow.pressed = false;
        console.log('2 -> Root');
    }
    // Main section 2 -> Main section 1
    if ((topArrow.pressed == true) && (lastX == mainSection[0].x) && (mainSection[0].y2)) {
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = mainSection[0].x;
        newY = mainSection[0].y1;
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        topArrow.down = false;
        topArrow.up = false;
        topArrow.pressed = false;
        console.log('2 -> 1');
    }
    // Main section 1 -> Main section 2
    if ((bottomArrow.pressed == true) && (lastX == mainSection[0].x) && (mainSection[0].y1)) {
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = mainSection[0].x;
        newY = mainSection[0].y2;
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        bottomArrow.down = false;
        bottomArrow.up = false;
        bottomArrow.pressed = false;
        console.log('1 -> 2');
    }
    // Main section 1 -> Main section
    if ((rightArrow.pressed == true) && (lastX == mainSection[0].x) && (mainSection[0].y1)) {
        drawOutline(newX, newY, ELEMENT_WIDTH, ELEMENT_HEIGHT, border[0]);
        newX = X_LROOT;
        newY = Y_LROOT;
        drawOutline(newX, newY, ROOT_WIDTH, ROOT_HEIGHT, border[1]);
        lastX = newX;
        lastY = newY;
        rightArrow.down = false;
        rightArrow.up = false;
        rightArrow.pressed = false;
        console.log('1 -> Root');
    }
};

window.setInterval(redraw, 10);


