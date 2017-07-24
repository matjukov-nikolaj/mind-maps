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
        this.ctx.fillText(title, xLeftCorner + (width / 2), yLeftCorner + (height - 10));
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
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawMainChild(selection) {
        const center = new Point(config.X_LROOT + config.ROOT_WIDTH / 2, config.Y_LROOT + config.ROOT_HEIGHT / 2);
        const children = this.tree.root.children;
        let connectFrom = 0;
        if (children.length > 0) {
            connectFrom = new Point(center.x + config.INDENT_FROM_ROOT, center.y);
            this.drawConnection(center.x + config.ROOT_WIDTH / 2, center.y, connectFrom.x, connectFrom.y);
        }
        const fullHeight = this.getMainSectionsHeight(children);
        const startPoint = new Point(config.MAIN_SECTION_DISTANCE + center.x, center.y - fullHeight / 2);
        let topOffset = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (i != 0) {
                topOffset += this.getMainMarginTop(child.children);
            }
            const point = new Point(startPoint.x, startPoint.y + topOffset + config.MAIN_MARGIN);
            const leftTop = new Point(startPoint.x - config.EL_WIDTH / 2, startPoint.y + topOffset + config.MAIN_MARGIN);
            const rightBottom = new Point(leftTop.x + config.EL_WIDTH, leftTop.y + config.EL_HEIGHT);
            this.drawConnection(connectFrom.x, connectFrom.y , point.x - config.EL_WIDTH / 2, point.y + config.EL_HEIGHT/ 2);
            const newNode = {
                node: child,
                rect: new Rect(leftTop, rightBottom),
                children: [],
            };
            this.currentNode.children.push(newNode);
            const tmpCurrent = this.currentNode;
            this.currentNode = newNode;
            const connectionPoint = new Point(point.x + config.INDENT_FROM_MAIN_SECTION, point.y  + config.EL_HEIGHT/ 2);
            if (child.children.length > 0) {
                this.drawConnection(point.x + config.EL_WIDTH / 2, point.y  + config.EL_HEIGHT/ 2, connectionPoint.x, connectionPoint.y);
            }
            this.drawElementRect(point.x - config.EL_WIDTH / 2, point.y, config.EL_WIDTH, config.EL_HEIGHT, child.title);
            this.drawSelection(point.x - config.EL_WIDTH / 2, point.y, config.EL_WIDTH, config.EL_HEIGHT, selection, child);
            this.drawSubsections(point.x, point.y, child.children, selection, connectionPoint);
            this.currentNode = tmpCurrent;
            const mainBottom = this.getMainMarginBottom(child.children);
            topOffset += mainBottom + this.getMainSectionSize();
        }
    };

    drawSubsections(x, y, subsections, selection, connectionPoint) {
        if (subsections.length != 0) {
            const fullHeight = this.getSubsectionsHeight(subsections);
            const startPoint = new Point(config.SUBSECTION_DISTANCE + x, y - fullHeight / 2);
            let topOffset = 0;
            for (let i = 0; i < subsections.length; i++) {
                const subsection = subsections[i];
                if (i != 0) {
                    const subTop = this.getSubsectionMarginTop(subsection.children);
                    topOffset += subTop;
                }
                const title = subsection.title;
                const point = new Point(startPoint.x, startPoint.y + topOffset + config.SUBSECTION_MARGIN);
                const leftTop = new Point(startPoint.x, startPoint.y + topOffset + config.SUBSECTION_MARGIN + config.SUBSECTION_HEIGHT / 2);
                const rightBottom = new Point(leftTop.x + config.SUBSECTION_WIDTH, leftTop.y + config.SUBSECTION_HEIGHT);
                const newNode = {
                    node: subsection,
                    rect: new Rect(leftTop, rightBottom),
                    children: [],
                };
                this.currentNode.children.push(newNode);
                const tmpCurrent = this.currentNode;
                this.currentNode = newNode;
                this.drawConnection(connectionPoint.x, connectionPoint.y, point.x, point.y + config.SUBSECTION_HEIGHT + config.SUBSECTION_MARGIN);
                const subsectionConnection = new Point (point.x + config.SUBSECTION_WIDTH + config.INDENT_FROM_SUB, point.y + config.SUBSECTION_HEIGHT);
                if (subsection.children.length > 0) {
                    this.drawConnection(point.x, point.y + config.SUBSECTION_HEIGHT, subsectionConnection.x, subsectionConnection.y);
                }
                this.drawElementLine(point.x, point.y + config.SUBSECTION_HEIGHT / 2, config.SUBSECTION_WIDTH, config.SUBSECTION_HEIGHT, title);
                this.drawSelection(point.x, point.y + config.SUBSECTION_HEIGHT / 2, config.SUBSECTION_WIDTH, config.SUBSECTION_HEIGHT, selection, subsection);
                this.drawSubsections(point.x + config.SUBSECTION_WIDTH / 2, point.y + config.SUBSECTION_HEIGHT / 2, subsection.children, selection, subsectionConnection);
                this.currentNode = tmpCurrent;
                const subBottom = this.getSubsectionMarginBottom(subsection.children);
                topOffset +=  subBottom + this.getSubsectionSize();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAllTree(selection) {
        this.clearCanvas();
        this.drawRoot(selection);
        this.drawMainChild(selection);
    }

    getSubsectionMarginTop(subsections) {
        let marginTop = 0;
        if (subsections.length > 0) {
            marginTop += Math.max(0, (this.getSubsectionsHeight(subsections) - this.getSubsectionSize()) / 2);
            marginTop += this.getSubsectionMarginTop(subsections[0].children);
        }
        return marginTop;
    }

    getSubsectionMarginBottom(subsections) {
        let marginBottom = 0;
        if (subsections.length > 0) {
            marginBottom += Math.max(0, (this.getSubsectionsHeight(subsections) - this.getSubsectionSize()) / 2);
            marginBottom += this.getSubsectionMarginBottom(subsections[subsections.length - 1].children);
        }
        return marginBottom;
    }

    getSubsectionsHeight(subsections) {
        let height = 0;
        for (let i = 0; i < subsections.length; ++i) {
            const subsection = subsections[i];
            height += this.getSubsectionSize();
            if (i != 0) {
                height += this.getSubsectionMarginTop(subsection.children);
            }
            if (i != subsections.length - 1) {
                const bottom = this.getSubsectionMarginBottom(subsection.children);
                height += bottom;
            }
        }
        return height;
    }

    getMainMarginTop(subsections) {
        let marginTop = 0;
        if (subsections.length > 0) {
            marginTop += Math.max(0, (this.getSubsectionsHeight(subsections) - this.getMainSectionSize()) / 2);
            marginTop += this.getSubsectionMarginTop(subsections[0].children);
        }
        return marginTop;
    }

    getMainMarginBottom(subsections) {
        let marginBottom = 0;
        if (subsections.length > 0) {
            marginBottom += Math.max(0, (this.getSubsectionsHeight(subsections) - this.getMainSectionSize()) / 2);
            marginBottom += this.getSubsectionMarginBottom(subsections[subsections.length - 1].children);
        }
        return marginBottom;
    }

    getMainSectionsHeight(mainSections) {
        let height = 0;
        for (let i = 0; i < mainSections.length; ++i) {
            const mainSection = mainSections[i];
            height += this.getMainSectionSize();
            if (i != 0) {
                height += this.getMainMarginTop(mainSection.children);
            }
            if (i != mainSections.length - 1) {
                height += this.getMainMarginBottom(mainSection.children);
            }
        }
        return height;
    }

    getSubsectionSize() {
        return config.SUBSECTION_HEIGHT + config.SUBSECTION_MARGIN * 2;
    }

    getMainSectionSize() {
        return config.EL_HEIGHT + config.MAIN_MARGIN * 2;
    }
}
