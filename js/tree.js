'use strict';
const
    X_LROOT = 840,
    Y_LROOT = 360,
    ROOT_WIDTH = 200,
    ROOT_HEIGHT = 70,
    EL_WIDTH = 150,
    EL_HEIGHT_WHITE = 30,
    EL_HEIGHT = 50;

let mainSection = {
    x1: 600,
    x2: 1130,
    y1: 310,
    y2: 430
};

let allTree = {
    title: 'Main Section',
    x: X_LROOT,
    y: Y_LROOT,
    width: ROOT_WIDTH,
    height: ROOT_HEIGHT,
    children: [
        {
            title: 'Main Section 1',
            x: mainSection.x1,
            y: mainSection.y1,
            width: EL_WIDTH,
            height: EL_HEIGHT
        },
        {
            title: 'Main Section 2',
            x: mainSection.x2,
            y: mainSection.y1,
            width: EL_WIDTH,
            height: EL_HEIGHT
        }
    ]
};

class Tree {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 1875;
        this.canvas.height = 790;
    }

    drawElementRect(xLeftCorner, yLeftCorner, width, height, title) {
        this.ctx.fillStyle = "#aaf0d1";
        this.ctx.fillRect(xLeftCorner, yLeftCorner, width, height);
        this.ctx.fillStyle = "#506a85";
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(title, xLeftCorner + (width / 2), yLeftCorner + (height / 1.7));
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.moveTo(xLeftCorner, yLeftCorner);
        this.ctx.lineTo(xLeftCorner + width, yLeftCorner);
        this.ctx.lineTo(xLeftCorner + width, yLeftCorner + height);
        this.ctx.lineTo(xLeftCorner, yLeftCorner + height);
        this.ctx.lineTo(xLeftCorner, yLeftCorner);
        this.ctx.strokeStyle = "#00a085";
        if (title == 'Main Section') {
            this.ctx.lineWidth = 3;
        } else {
            this.ctx.lineWidth = 2;
        }
        this.ctx.stroke();
    }

    drawRoot() {
        this.drawElementRect(allTree.x, allTree.y, allTree.width, allTree.height, allTree.title);
    }
}

let centerRoot = new Tree;
centerRoot.drawRoot();
