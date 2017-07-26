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

    getTextWidth(text, min, max) {
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
        return Math.min(Math.max(this.ctx.measureText(text).width, min), max);
    }

    drawElementRect(leftTop, width, height, title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#aaf0d1";
        this.ctx.fillRect(leftTop.x, leftTop.y, width, height);
        this.ctx.fillStyle = "#506a85";
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(title, leftTop.x + (width / 2), leftTop.y + (height / 1.7));
        this.ctx.fill();
        this.ctx.moveTo(leftTop.x, leftTop.y);
        this.ctx.lineTo(leftTop.x + width, leftTop.y);
        this.ctx.lineTo(leftTop.x + width, leftTop.y + height);
        this.ctx.lineTo(leftTop.x, leftTop.y + height);
        this.ctx.lineTo(leftTop.x, leftTop.y);
        this.ctx.strokeStyle = "#00a085";
        if (leftTop.x == config.X_LROOT) {
            this.ctx.lineWidth = 3;
        } else {
            this.ctx.lineWidth = 2;
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawElementLine(leftTop, width, height, title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(leftTop.x, leftTop.y, width, height);
        this.ctx.fillStyle = "#506a85";
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(title, leftTop.x + (width / 2), leftTop.y + (height - 10));
        this.ctx.fill();
        this.ctx.moveTo(leftTop.x, leftTop.y + height);
        this.ctx.lineTo(leftTop.x + width, leftTop.y + height);
        this.ctx.strokeStyle = "#00a085";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawOutline(leftTop, width, height) {
        this.ctx.beginPath();
        const indent = 5;
        leftTop.x -= indent;
        leftTop.y -= indent;
        width += indent * 2;
        height += indent * 2;
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.moveTo(leftTop.x, leftTop.y);
        this.ctx.lineTo(leftTop.x + width, leftTop.y);
        this.ctx.lineTo(leftTop.x + width, leftTop.y + height);
        this.ctx.lineTo(leftTop.x, leftTop.y + height);
        this.ctx.lineTo(leftTop.x, leftTop.y);
        this.ctx.strokeStyle = "#506a85";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawSelection(rect, selection, node) {
        if (node == selection.curr) {
            this.drawOutline(rect.leftTop, rect.width(), rect.height());
        }
    }

    getRootWidth() {
        const rootWidth = this.getTextWidth(this.tree.root.title, config.ROOT_MIN_WIDTH, Number.POSITIVE_INFINITY);
        return rootWidth;
    }

    drawRoot(selection) {
        const leftTop = new Point(config.X_LROOT, config.Y_LROOT);
        const rootWidth = this.getRootWidth();
        const rightBottom = new Point(config.X_LROOT + rootWidth, config.Y_LROOT + config.ROOT_HEIGHT);
        const rootRect=  new Rect(leftTop, rightBottom);
        this.treeWithRects = {
            node: this.tree.root,
            rect: rootRect,
            children: [],
        };
        this.currentNode = this.treeWithRects;
        const leftTopRoot = new Point(config.X_LROOT, config.Y_LROOT);
        this.drawElementRect(leftTopRoot, rootWidth, config.ROOT_HEIGHT, this.tree.root.title);
        this.drawSelection(rootRect, selection, this.tree.root)
    }

    drawConnection(Start, End) {
        this.ctx.beginPath();
        this.ctx.moveTo(Start.x, Start.y);
        this.ctx.lineTo(End.x, End.y);
        this.ctx.strokeStyle = "#00a085";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawMainChild(selection) {
        const rightRootCenter = new Point(config.X_LROOT + this.getRootWidth(), config.Y_LROOT + config.ROOT_HEIGHT / 2);
        const children = this.tree.root.children;
        let connectFrom = 0;
        if (children.length > 0) {
            connectFrom = new Point(rightRootCenter.x + config.INDENT_FROM_ROOT, rightRootCenter.y);
            const startConnectFromRoot = new Point(rightRootCenter.x, rightRootCenter.y);
            this.drawConnection(startConnectFromRoot, connectFrom);
        }
        const fullHeight = this.getMainSectionsHeight(children);
        const startPoint = new Point(
            config.MAIN_SECTION_DISTANCE + rightRootCenter.x - config.EL_MIN_WIDTH / 2,
            rightRootCenter.y - fullHeight / 2);
        let topOffset = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const mainWidth = this.getTextWidth(child.title, config.EL_MIN_WIDTH, Number.POSITIVE_INFINITY);
            if (i != 0) {
                topOffset += this.getMainMarginTop(child.children);
            }
            const point = new Point(startPoint.x, startPoint.y + topOffset);
            const rightBottom = new Point(point.x + mainWidth, point.y + config.EL_HEIGHT);
            const endConnectMain = new Point(point.x, point.y + config.EL_HEIGHT/ 2);
            this.drawConnection(connectFrom, endConnectMain);
            const mainRect = new Rect(point, rightBottom);
            const newNode = {
                node: child,
                rect: mainRect,
                children: [],
            };
            this.currentNode.children.push(newNode);
            const tmpCurrent = this.currentNode;
            this.currentNode = newNode;
            const connectionPoint = new Point(mainRect.rightBottom.x + config.INDENT_FROM_MAIN_SECTION, point.y  + config.EL_HEIGHT/ 2);
            if (child.children.length > 0) {
                const startConnectFromMain = new Point(mainRect.rightBottom.x, point.y  + config.EL_HEIGHT/ 2);
                this.drawConnection(startConnectFromMain, connectionPoint);
            }
            this.drawElementRect(point, mainWidth, config.EL_HEIGHT, child.title);
            this.drawSelection(mainRect, selection, child);
            this.drawSubsections(connectionPoint, child.children, selection, connectionPoint);
            this.currentNode = tmpCurrent;
            const mainBottom = this.getMainMarginBottom(child.children);
            topOffset += mainBottom + this.getMainSectionSize();
        }
    };

    drawSubsections(bottomPoint, subsections, selection, connectionPoint) {
        if (subsections.length != 0) {
            const fullHeight = this.getSubsectionsHeight(subsections);
            const x = bottomPoint.x + config.SUBSECTION_DISTANCE;
            const y = bottomPoint.y - config.SUBSECTION_HEIGHT / 2;
            const startPoint = new Point(x, y - fullHeight / 2);
            let topOffset = 0;
            for (let i = 0; i < subsections.length; i++) {
                const subsection = subsections[i];
                const subWidth = this.getTextWidth(subsection.title, config.SUBSECTION_MIN_WIDTH, Number.POSITIVE_INFINITY);
                if (i != 0) {
                    topOffset += this.getSubsectionMarginTop(subsection.children);
                }
                const title = subsection.title;
                const point = new Point(startPoint.x, startPoint.y + topOffset);
                const rightBottom = new Point(point.x + subWidth, point.y + config.SUBSECTION_HEIGHT);
                const subsectionRect = new Rect(point, rightBottom);
                const newNode = {
                    node: subsection,
                    rect: subsectionRect,
                    children: [],
                };
                this.currentNode.children.push(newNode);
                const tmpCurrent = this.currentNode;
                this.currentNode = newNode;
                const subConnectEnd = new Point(point.x, point.y + config.SUBSECTION_HEIGHT);
                this.drawConnection(connectionPoint, subConnectEnd);
                const subsectionConnection = new Point (point.x + subWidth + config.INDENT_FROM_SUB, point.y + config.SUBSECTION_HEIGHT);
                if (subsection.children.length > 0) {
                    const subConnectStart = new Point(point.x, point.y + config.SUBSECTION_HEIGHT);
                    this.drawConnection(subConnectStart, subsectionConnection);
                }
                this.drawElementLine(point, subWidth, config.SUBSECTION_HEIGHT, title);
                this.drawSelection(subsectionRect, selection, subsection);
                this.drawSubsections(subsectionConnection, subsection.children, selection, subsectionConnection);
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
            marginTop += Math.max(0, (this.getSubsectionsHeight(subsections) - config.SUBSECTION_HEIGHT) / 2);
            marginTop += this.getSubsectionMarginTop(subsections[0].children);
        }
        return marginTop;
    }

    getSubsectionMarginBottom(subsections) {
        let marginBottom = 0;
        if (subsections.length > 0) {
            marginBottom += Math.max(0, (this.getSubsectionsHeight(subsections) - config.SUBSECTION_HEIGHT) / 2);
            marginBottom += this.getSubsectionMarginBottom(subsections[subsections.length - 1].children);
        }
        return marginBottom;
    }

    getSubsectionsHeight(subsections) {
        let height = 0;
        for (let i = 0; i < subsections.length; ++i) {
            const subsection = subsections[i];
            height += config.SUBSECTION_HEIGHT;
            if (i != 0) {
                height += this.getSubsectionMarginTop(subsection.children);
                height += config.SUBSECTION_MARGIN;
            }
            if (i != subsections.length - 1) {
                const bottom = this.getSubsectionMarginBottom(subsection.children);
                height += bottom;
                height += config.SUBSECTION_MARGIN;
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
            height += config.EL_HEIGHT;
            if (i != 0) {
                height += this.getMainMarginTop(mainSection.children);
                height += config.MAIN_MARGIN;
            }
            if (i != mainSections.length - 1) {
                height += this.getMainMarginBottom(mainSection.children);
                height += config.MAIN_MARGIN;
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
