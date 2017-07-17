class TreeRenderer {
    constructor(tree) {
        this.canvas = document.getElementById('canvas');
        this.canvas.focus();
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 10000;
        this.canvas.height = 10000;
        this.tree = tree;
        this.treeWithRects = null;
        this.currentNode = null;
    }

    findNodeByPoint(point) {
        if (this.treeWithRects.rect.pointInRect(point)) {
            return {
                node: this.treeWithRects.node,
                rect: this.treeWithRects.rect
            };
        }
        let result = null;
        for (let node of this.treeWithRects.children ) {
            const found = this.findChildWithPoint(point, node);
            if (found) {
                result = found;
                break;
            }
        }
        return result;
    }

    findChildWithPoint(point, nodeWithRect) {
        if (nodeWithRect.rect.pointInRect(point)) {
            return {
                node: nodeWithRect.node,
                rect: nodeWithRect.rect,
            };
        }
        let result = null;
        for (let node of nodeWithRect.children) {
            const found = this.findChildWithPoint(point, node);
            if (found) {
                result = found;
                break;
            }
        }
        return result;
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
        if (xLeftCorner == config.X_LROOT) {
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
        this.ctx.lineWidth = 3;
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
        const leftTop = new Point(config.X_LROOT, config.Y_LROOT);
        const rightBottom = new Point(config.X_LROOT + config.ROOT_WIDTH, config.Y_LROOT + config.ROOT_HEIGHT);
        this.treeWithRects = {
            node: this.tree.root,
            rect: new Rect(leftTop, rightBottom),
            children: [],
        };
        this.currentNode = this.treeWithRects;
        this.drawElementRect(config.X_LROOT, config.Y_LROOT, config.ROOT_WIDTH, config.ROOT_HEIGHT, this.tree.root.title);
        this.drawSelection(config.X_LROOT, config.Y_LROOT, config.ROOT_WIDTH, config.ROOT_HEIGHT, selection, this.tree.root)
    }

    drawConnection(xStart, yStart, xEnd, yEnd) {
        this.ctx.beginPath();
        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);
        this.ctx.strokeStyle = "#00a085";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawMainChild(selection) {
        const center = new Point(config.X_LROOT + config.ROOT_WIDTH / 2, config.Y_LROOT + config.ROOT_HEIGHT / 2);
        const children = this.tree.root.children;
        const fullHeight = this.getMainHeight(children);
        const startPoint = new Point(config.MAIN_SECTION_DISTANCE + center.x, center.y - fullHeight / 2);
        let prevMargin = 0;
        for (let i = 0; i < this.tree.root.children.length; i++) {
            const connectFrom = new Point(center.x + config.INDENT_FROM_ROOT, center.y);
            this.drawConnection(center.x + config.ROOT_WIDTH / 2, center.y, connectFrom.x, connectFrom.y);
            const child = this.tree.root.children[i];
            if (i != 0) {
                prevMargin += this.getMarginTop(child.children);
            }
            const point = new Point(startPoint.x, startPoint.y + prevMargin);
            const leftTop = new Point(startPoint.x - config.EL_WIDTH / 2, startPoint.y + prevMargin - config.EL_HEIGHT / 2);
            const rightBottom = new Point(leftTop.x + config.EL_WIDTH, leftTop.y + config.EL_HEIGHT);
            const isLeft = (point.x - center.x) < 0;
            this.drawConnection(connectFrom.x, connectFrom.y, point.x - config.EL_WIDTH / 2, point.y);
            const newNode = {
                node: child,
                rect: new Rect(leftTop, rightBottom),
                children: [],
            };
            this.currentNode.children.push(newNode);
            const tmpCurrent = this.currentNode;
            this.currentNode = newNode;
            this.drawElementRect(point.x - config.EL_WIDTH / 2, point.y - config.EL_HEIGHT / 2, config.EL_WIDTH, config.EL_HEIGHT, child.title);
            this.drawSelection(point.x - config.EL_WIDTH / 2, point.y - config.EL_HEIGHT / 2, config.EL_WIDTH, config.EL_HEIGHT, selection, child);
            this.drawSubsections(point.x, point.y, child.children, isLeft, selection);
            this.currentNode = tmpCurrent;
            prevMargin += this.getMarginBottom(child.children) + config.EL_HEIGHT;
        }
    };

    drawSubsections(x, y, subsections, isLeft, selection) {
        if (subsections.length != 0) {
            const connectFrom = new Point(x + config.INDENT_FROM_MAIN_SECTION, y);
            this.drawConnection(x + config.EL_WIDTH / 2, y, connectFrom.x, connectFrom.y);
            let side = 0;
            if (isLeft) {
                side = -1;
            } else {
                side = 1;
            }
            const fullHeight = this.getSubsectionsHight(subsections);
            const startPoint = new Point((config.SUBSECTION_DISTANCE * side) + x, y - fullHeight / 2);
            let prevMargin = 0;
            for (let i = 0; i < subsections.length; i++) {
                const subsection = subsections[i];
                if (i != 0) {
                    prevMargin += this.getMarginTop(subsection.children);
                }
                const title = subsection.title;
                const point = new Point(startPoint.x, startPoint.y + prevMargin);
                const rightBottom = new Point(point.x + config.SUBSECTION_WIDTH, point.y + config.SUBSECTION_HEIGHT);
                const newNode = {
                    node: subsection,
                    rect: new Rect(point, rightBottom),
                    children: [],
                };
                this.currentNode.children.push(newNode);
                const tmpCurrent = this.currentNode;
                this.currentNode = newNode;
                this.drawConnection(connectFrom.x, connectFrom.y, point.x, point.y + config.SUBSECTION_HEIGHT);
                this.drawElementLine(point.x, point.y, config.SUBSECTION_WIDTH, config.SUBSECTION_HEIGHT, title);
                this.drawSelection(point.x, point.y, config.SUBSECTION_WIDTH, config.SUBSECTION_HEIGHT, selection, subsection);
                this.drawSubsections(point.x + config.SUBSECTION_WIDTH / 2, point.y + config.SUBSECTION_HEIGHT / 2, subsection.children, isLeft, selection);
                this.currentNode = tmpCurrent;
                prevMargin += this.getMarginBottom(subsection.children) + config.SUBSECTION_HEIGHT;
                console.log(prevMargin);
            }
        }
    }

    getSubsectionsBox(subsections, isHalf) {
        let fullHeight = 0;
        for (let i = 0; i < subsections.length; i++) {
            const child = subsections[i];
            const newHalf = (i != 0 && i != subsections.length - 1) ? false : isHalf;
            const subsectionsHeight = this.getSubsectionsBox(child.children, newHalf);
            if (isHalf) {
                fullHeight += Math.max(config.SUBSECTION_HEIGHT, subsectionsHeight / 2);
            } else {
              fullHeight += Math.max(config.SUBSECTION_HEIGHT, subsectionsHeight);
            }
        }
        return fullHeight;
    }

    getSubsectionsHight(subsections) {
        let fullHeight = 0;
        for (let i = 0; i < subsections.length; i++) {
            const child = subsections[i];
            const isHalf = (i == 0 || i == subsections.length - 1);
            const subsectionsHeight = this.getSubsectionsBox(child.children, isHalf);
            fullHeight += Math.max(config.SUBSECTION_HEIGHT, subsectionsHeight);
        }
        return fullHeight;
    }

    getSubBoundingHeight(subsections) {
        let fullHeight = 0;
        for (let i = 0; i < subsections.length; i++) {
            const child = subsections[i];
            const subsectionsHeight = this.getSubBoundingHeight(child.children);
            fullHeight += Math.max(config.SUBSECTION_HEIGHT, subsectionsHeight);
        }
        return fullHeight;
    }

    getMainHeight(children) {
        let fullHeight = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const subsectionsHeight = this.getSubBoundingHeight(child.children);
            let margin = 0;
            if (i != 0 && i != children.length - 1) {
                margin = Math.max(0, subsectionsHeight - config.EL_HEIGHT);
            }
            else {
                margin = Math.max(0, (subsectionsHeight - config.EL_HEIGHT) / 2);
            }
            fullHeight += margin + config.EL_HEIGHT;
        }
        return fullHeight;
    }

    getMarginBottom(children) {
        let margin = 0;
        if (children.length > 0) {
            margin += this.getSubsectionsHight(children) / 2;
            margin += this.getSubsectionsHight(children[children.length - 1].children) / 2;
        }
        return margin;
    }

    getMarginTop(children) {
        let margin = 0;
        if (children.length > 0) {
            margin += this.getSubsectionsHight(children) / 2;
            margin += this.getSubsectionsHight(children[0].children) / 2;
        }
        return margin;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAllTree(selection) {
        this.clearCanvas();
        this.drawRoot(selection);
        this.drawMainChild(selection);
    }
}
