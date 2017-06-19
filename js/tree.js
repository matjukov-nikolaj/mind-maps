'use strict';
const
    X_LROOT = 840,
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

let border = ["#ffffff", "#506a85"];

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

// Логическая структура дерева
let allTree = {
    title: 'Main Section',
    children: [
        {
            title: 'Main Section 1',
            children: [
                {
                    title: 'Subsection 1',
                    children: []
                },
                {
                    title: 'Subsection 2',
                    children: []
                }
            ]
        },
        {
            title: 'Main Section 2',
            children: [
                {
                    title: 'Subsection 8',
                    children: []
                }
            ]
        },
        {
            title: 'Main Section 3',
            children: []
        },
        {
            title: 'Main Section 4',
            children: [
                {
                    title: 'Subsection 3',
                    children: [
                        {
                            title: 'Subsection 4',
                            children: []
                        },
                        {
                            title: 'Subsection 5',
                            children: [
                                {
                                    title: 'Subsection 6',
                                    children: []
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Subsection 6',
                    children: []
                },
                {
                    title: 'Subsection 7',
                    children: []
                }
            ]
        }
    ]
};

class TreeRenderer {
    constructor(tree) {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 1875;
        this.canvas.height = 790;
        this.tree = tree;
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

    drawElementLine(xLeftCorner, yLeftCorner, width, height, title) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(xLeftCorner, yLeftCorner, width, height);
        this.ctx.fillStyle = "#506a85";
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(title, xLeftCorner + (width / 2), yLeftCorner + (height - 2));
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.moveTo(xLeftCorner, yLeftCorner + height);
        this.ctx.lineTo(xLeftCorner + width, yLeftCorner + height);
        this.ctx.strokeStyle = "#00a085";
        this.ctx.lineWidth = "#00a085";
        this.ctx.stroke();
    }

    drawOutline(xLeftCorner, yLeftCorner, width, height, borderStyle) {
        const
            INDENT = 5;
        xLeftCorner -= INDENT;
        yLeftCorner -= INDENT;
        width += INDENT * 2;
        height += INDENT * 2;
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.moveTo(xLeftCorner, yLeftCorner);
        this.ctx.lineTo(xLeftCorner + width, yLeftCorner);
        this.ctx.lineTo(xLeftCorner + width, yLeftCorner + height);
        this.ctx.lineTo(xLeftCorner, yLeftCorner + height);
        this.ctx.lineTo(xLeftCorner, yLeftCorner);
        this.ctx.strokeStyle = borderStyle;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawSelection(x, y, widht, height, selection, node) {
        if (node == selection.new) {
            this.drawOutline(x, y, widht, height, border[1]);
        }
        else if (node == selection.old) {
            this.drawOutline(x, y, widht, height, border[0]);
        }
    }

    drawRoot(selection) {
        this.drawElementRect(X_LROOT, Y_LROOT, ROOT_WIDTH, ROOT_HEIGHT, this.tree.title);
        this.drawSelection(X_LROOT, Y_LROOT, ROOT_WIDTH, ROOT_HEIGHT, selection, this.tree)
    }

    calculateChildPoint(center, index) {
        const angle = index * 2 * Math.PI / this.tree.children.length + Math.PI / 4;
        return {
            x: center.x + Math.cos(angle) * MAIN_RADIUS,
            y: center.y + Math.sin(angle) * MAIN_RADIUS * 0.5
        }
    }

    drawChild(selection) {
        const center = {
            x: X_LROOT + ROOT_WIDTH / 2,
            y: Y_LROOT + ROOT_HEIGHT / 2
        };
        for (let i = 0; i < this.tree.children.length; i++) {
            const point = this.calculateChildPoint(center, i);
            const child = this.tree.children[i];
            this.drawElementRect(point.x - EL_WIDTH / 2, point.y - EL_HEIGHT / 2, EL_WIDTH, EL_HEIGHT, child.title);
            this.drawSelection(point.x - EL_WIDTH / 2, point.y - EL_HEIGHT / 2, EL_WIDTH, EL_HEIGHT, selection, child)
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
            for (let i = 0; i < subsections.length; ++i) {
                const subsection = subsections[i];
                const title = subsection.title;
                const point = {
                    x: startPoint.x,
                    y: startPoint.y + i * heightWithMargin
                };
                this.drawElementLine(point.x - SUBSECTION_WIDTH / 2, point.y, SUBSECTION_WIDTH, SUBSECTION_HEIGHT, title);
                this.drawSelection(point.x - SUBSECTION_WIDTH / 2, point.y, SUBSECTION_WIDTH, SUBSECTION_HEIGHT, selection, subsection );
                this.drawSubsections(point.x, point.y, subsection.children, isLeft, selection);
            }
        }
    }

    drawAllTree(selection) {
        this.drawRoot(selection);
        this.drawChild(selection);
    }
}

let drawAll = new TreeRenderer(allTree);


class TreeController {
    constructor(tree, renderer) {
        this.tree = tree;
        this.renderer = renderer;
        this.selection = {
            new: this.tree,
            old: null
        };
    }

    // Обработка нажатий стрелок
    pressingArrows() {
        let self = this;
        window.addEventListener("keydown", function (event) {
                switch (event.code) {
                    case "ArrowLeft":
                        break;
                    case "ArrowUp":
                        self.renderer.drawAllTree(self.selection);
                        break;
                    case "ArrowRight":
                        break;
                    case "ArrowDown":
                }
            }
        );
    }

    controlAll() {
        this.pressingArrows();
    }
}
let arrowPress = new TreeController(allTree, drawAll);
arrowPress.controlAll();
drawAll.drawAllTree(arrowPress.selection);

