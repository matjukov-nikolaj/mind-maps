'use strict';
const
    X_LROOT = 240,
    Y_LROOT = 360,
    ROOT_WIDTH = 200,
    ROOT_HEIGHT = 70,
    EL_WIDTH = 150,
    EL_HEIGHT = 50,
    MAIN_RADIUS = 250,
    SUBSECTION_MARGIN = 15,
    SUBSECTION_HEIGHT = 30,
    SUBSECTION_WIDTH = 150,
    SUBSECTION_DISTANCE = 200;

class Node {
    constructor(title) {
        this.title = title;
        this.children = [];
        this.parent = null;
    }

    addChild(nodeTitle) {
        const node = new Node(nodeTitle);
        node.parent = this;
        const pushed = this.children.push(node);
        return this.children[pushed - 1];
    }
}

class Tree {
    constructor(rootTitle){
        this.root = new Node(rootTitle);
    }
}

let allTree = new Tree("Main Section");

let section1 = allTree.root.addChild("Main Section 1");
let subsection1 = section1.addChild("Subsection 1");
subsection1.addChild("Subsection 3");
subsection1.addChild("Subsection 4");
section1.addChild("Subsection 2");
section1.addChild("Subsection 3");

let section2 = allTree.root.addChild("Main Section 2");
section2.addChild("Subsection 5");
let subsection2 = section2.addChild("Subsection 6");
subsection2.addChild("Subsection 7");

allTree.root.addChild("Main Section 3");

let section4 = allTree.root.addChild("Main Section 4");
let subsection4dot1 = section4.addChild("Subsection 8");
subsection4dot1.addChild("Subsection 9");
subsection4dot1.addChild("Subsection 10");
subsection4dot1.addChild("Subsection 11");
section4.addChild("Subsection 12");
section4.addChild("Subsection 13");
section4.addChild("Subsection 14");
let subsection4dot2 = section4.addChild("Subsection 15");
subsection4dot2.addChild("Subsection 16");
subsection4dot2.addChild("Subsection 17");




class TreeRenderer {
    constructor(tree) {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 1875;
        this.canvas.height = 790;
        this.tree = tree;
        this.borderColor = ["#ffffff", "#506a85"];
    }

    drawElementRect(xLeftCorner, yLeftCorner, width, height, title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#aaf0d1";
        this.ctx.fillRect(xLeftCorner, yLeftCorner, width, height);
        this.ctx.fillStyle = "#506a85";
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(title, xLeftCorner + (width / 2), yLeftCorner + (height / 1.7));
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
        this.ctx.closePath();
    }

    drawElementLine(xLeftCorner, yLeftCorner, width, height, title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(xLeftCorner, yLeftCorner, width, height);
        this.ctx.fillStyle = "#506a85";
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(title, xLeftCorner + (width / 2), yLeftCorner + (height - 2));
        this.ctx.fill();
        this.ctx.moveTo(xLeftCorner, yLeftCorner + height);
        this.ctx.lineTo(xLeftCorner + width, yLeftCorner + height);
        this.ctx.strokeStyle = "#00a085";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawOutline(xLeftCorner, yLeftCorner, width, height, borderStyle) {
        this.ctx.beginPath();
        const indent = 5;
        xLeftCorner -= indent;
        yLeftCorner -= indent;
        width += indent * 2;
        height += indent * 2;
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.moveTo(xLeftCorner, yLeftCorner);
        this.ctx.lineTo(xLeftCorner + width, yLeftCorner);
        this.ctx.lineTo(xLeftCorner + width, yLeftCorner + height);
        this.ctx.lineTo(xLeftCorner, yLeftCorner + height);
        this.ctx.lineTo(xLeftCorner, yLeftCorner);
        this.ctx.strokeStyle = borderStyle;
        if (borderStyle == this.borderColor[0]) {
            this.ctx.lineWidth = 4;
        } else {
            this.ctx.lineWidth = 2;
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawSelection(x, y, widht, height, selection, node) {
        if (node == selection.new) {
            this.drawOutline(x, y, widht, height, this.borderColor[1]);
        }
        else if (node == selection.old) {
            this.drawOutline(x, y, widht, height, this.borderColor[0]);
        }
    }

    drawRoot(selection) {
        this.drawElementRect(X_LROOT, Y_LROOT, ROOT_WIDTH, ROOT_HEIGHT, this.tree.root.title);
        this.drawSelection(X_LROOT, Y_LROOT, ROOT_WIDTH, ROOT_HEIGHT, selection, this.tree.root)
    }

    findElementCoords(target) {
        if (this.tree.root == target) {
            return {
                x: X_LROOT,
                y: Y_LROOT
            };
        }
        const center = {
            x: X_LROOT + ROOT_WIDTH / 2,
            y: Y_LROOT + ROOT_HEIGHT / 2
        };
        for (let i = 0; i < this.tree.children; ++i) {
            const child = this.tree.root.children[i];
            if (child == target) {
                return this.calculateChildPoint(center, i);
            }
        }
        return null;
    }

    calculateChildPoint(center, index) {
        const angle = index * 0.5 * Math.PI / this.tree.root.children.length - Math.PI / 4;
        return {
            x: center.x + Math.cos(angle) * MAIN_RADIUS,
            y: center.y + Math.sin(angle) * MAIN_RADIUS * 1.5
        }
    }

    drawChild(selection) {
        const center = {
            x: X_LROOT + ROOT_WIDTH / 2,
            y: Y_LROOT + ROOT_HEIGHT / 2
        };
        for (let i = 0; i < this.tree.root.children.length; i++) {
            const point = this.calculateChildPoint(center, i);
            const child = this.tree.root.children[i];
            this.drawElementRect(point.x - EL_WIDTH / 2, point.y - EL_HEIGHT / 2, EL_WIDTH, EL_HEIGHT, child.title);
            this.drawSelection(point.x - EL_WIDTH / 2, point.y - EL_HEIGHT / 2, EL_WIDTH, EL_HEIGHT, selection, child);
            const isLeft = (point.x - center.x) < 0;
            this.drawSubsections(point.x, point.y, child.children, isLeft, selection);
        }
    }

    drawSubsections(x, y, subsections, isLeft, selection) {
        if (subsections.length != 0) {
            const heightWithMargin = SUBSECTION_HEIGHT + SUBSECTION_MARGIN;
            const totalHeight = heightWithMargin * subsections.length;
            let side = 0;
            if (isLeft) {
                side = -1;
            } else
                side = 1;
            const startPoint = {
                x: x + (SUBSECTION_DISTANCE * side),
                y: y - totalHeight / 2
            };
            for (let i = 0; i < subsections.length; i++) {
                const subsection = subsections[i];
                const title = subsection.title;
                const point = {
                    x: startPoint.x,
                    y: startPoint.y + i * heightWithMargin
                };
                this.drawElementLine(point.x - SUBSECTION_WIDTH / 2, point.y, SUBSECTION_WIDTH, SUBSECTION_HEIGHT, title);
                this.drawSelection(point.x - SUBSECTION_WIDTH / 2, point.y, SUBSECTION_WIDTH, SUBSECTION_HEIGHT, selection, subsection);
                this.drawSubsections(point.x, point.y, subsection.children, isLeft, selection);
            }
        }
    }

    drawAllTree(selection) {
        this.drawRoot(selection);
        this.drawChild(selection);
    }
}

class TreeController {
    constructor(tree, renderer) {
        this.tree = tree;
        this.renderer = renderer;
        this.selection = {
            new: this.tree.root,
            old: null
        };
    }

    onPressedLeft() {
        if (this.selection.new.parent) {
            this.selection.old = this.selection.new;
            this.selection.new = this.selection.new.parent;
            this.renderer.drawAllTree(this.selection);
        }
    }

    onPressedRight() {
        if (this.selection.new.children.length != 0) {
            this.selection.old = this.selection.new;
            this.selection.new = this.selection.old.children[0];
            this.renderer.drawAllTree(this.selection);
        }
    }

    onPressedUp() {
        if (this.selection.new.parent) {
            const parent = this.selection.new.parent;
            const children = parent.children;
            const index = children.indexOf(this.selection.new);
            const isFirstChild = 0 == index;
            if (!isFirstChild) {
                this.selection.old = this.selection.new;
                this.selection.new = children[index - 1];
                this.renderer.drawAllTree(this.selection);
            }
        }
    }

    onPressedDown() {
        if (this.selection.new.parent) {
            const parent = this.selection.new.parent;
            const children = parent.children;
            const index = children.indexOf(this.selection.new);
            const isLastChild = children.length - 1 == index;
            if (!isLastChild) {
                this.selection.old = this.selection.new;
                this.selection.new = children[index + 1];
                this.renderer.drawAllTree(this.selection);
            }
        }
    }

    // Обработка нажатий стрелок
    pressingArrows() {
        let self = this;
        window.addEventListener("keydown", function (event) {
                switch (event.code) {
                    case "ArrowLeft":
                        self.onPressedLeft();
                        break;
                    case "ArrowUp":
                        self.onPressedUp();
                        break;
                    case "ArrowRight":
                        self.onPressedRight();
                        break;
                    case "ArrowDown":
                        self.onPressedDown();
                }
            }
        );
    }

    controlAll() {
        this.pressingArrows();
    }
}

let drawAll = new TreeRenderer(allTree);
let arrowPress = new TreeController(allTree, drawAll);
arrowPress.controlAll();
drawAll.drawAllTree(arrowPress.selection);