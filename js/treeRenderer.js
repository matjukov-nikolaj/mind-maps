class TreeRenderer {
    constructor(tree) {
        this.canvas = document.getElementById('canvas');
        this.canvas.focus();
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 10000;
        this.canvas.height = 10000;
        this.tree = tree;
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

    drawOutline(xLeftCorner, yLeftCorner, width, height) {
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
        this.ctx.strokeStyle = "#506a85";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawSelection(x, y, width, height, selection, node) {
        if (node == selection.curr) {
            this.drawOutline(x, y, width, height);
        }
    }

    drawRoot(selection) {
        this.drawElementRect(config.X_LROOT, config.Y_LROOT, config.ROOT_WIDTH, config.ROOT_HEIGHT, this.tree.root.title);
        this.drawSelection(config.X_LROOT, config.Y_LROOT, config.ROOT_WIDTH, config.ROOT_HEIGHT, selection, this.tree.root)
    }

    drawConnection(xStart, yStart, xEnd, yEnd) {
        this.ctx.beginPath();
        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);
        this.ctx.strokeStyle = "#00a085";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    findElementCoords(target) {
        if (this.tree.root == target) {
            return {
                x: config.X_LROOT,
                y: config.Y_LROOT
            };
        }
        const center = {
            x: config.X_LROOT + config.ROOT_WIDTH / 2,
            y: config.Y_LROOT + config.ROOT_HEIGHT / 2
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
            x: center.x + Math.cos(angle) * config.MAIN_RADIUS,
            y: center.y + Math.sin(angle) * config.MAIN_RADIUS * 1.5
        }
    }

    drawChild(selection) {
        const center = {
            x: config.X_LROOT + config.ROOT_WIDTH / 2,
            y: config.Y_LROOT + config.ROOT_HEIGHT / 2
        };
        for (let i = 0; i < this.tree.root.children.length; i++) {
            const point = this.calculateChildPoint(center, i);
            const child = this.tree.root.children[i];
            this.drawConnection(center.x, center.y, point.x, point.y);
            this.drawRoot(selection);
            this.drawElementRect(point.x - config.EL_WIDTH / 2, point.y - config.EL_HEIGHT / 2, config.EL_WIDTH, config.EL_HEIGHT, child.title);
            this.drawSelection(point.x - config.EL_WIDTH / 2, point.y - config.EL_HEIGHT / 2, config.EL_WIDTH, config.EL_HEIGHT, selection, child);
            const isLeft = (point.x - center.x) < 0;
            this.drawSubsections(point.x, point.y, child.children, isLeft, selection);
        }
    }

    drawSubsections(x, y, subsections, isLeft, selection) {
        if (subsections.length != 0) {
            const heightWithMargin = config.SUBSECTION_HEIGHT + config.SUBSECTION_MARGIN;
            const totalHeight =  config.SUBSECTION_HEIGHT  * subsections.length + config.SUBSECTION_MARGIN * (subsections.length - 1);
            let side = 0;
            if (isLeft) {
                side = -1;
            } else
                side = 1;
            const startPoint = {
                x: x + (config.SUBSECTION_DISTANCE * side),
                y: y - totalHeight / 2
            };
            for (let i = 0; i < subsections.length; i++) {
                const subsection = subsections[i];
                const title = subsection.title;
                const point = {
                    x: startPoint.x,
                    y: startPoint.y + i * heightWithMargin
                };
                this.drawElementLine(point.x, point.y, config.SUBSECTION_WIDTH, config.SUBSECTION_HEIGHT, title);
                this.drawSelection(point.x, point.y, config.SUBSECTION_WIDTH, config.SUBSECTION_HEIGHT, selection, subsection);
                this.drawSubsections(point.x + config.SUBSECTION_WIDTH / 2, point.y + config.SUBSECTION_HEIGHT / 2, subsection.children, isLeft, selection);
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAllTree(selection) {
        this.clearCanvas();
        this.drawRoot(selection);
        this.drawChild(selection);
    }
}
