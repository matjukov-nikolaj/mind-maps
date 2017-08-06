class TreeRenderer {

    constructor(tree) {
        this.canvas = document.getElementById('canvas');
        this.canvas.focus();
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = globalConfig.MAX_CANVAS_SIZE;
        this.canvas.height = globalConfig.MAX_CANVAS_SIZE;
        this.tree = tree;
        this.treeWithRects = null;
        this.currentNode = null;
    }

    setTree(tree) {
        this.tree = tree;
        this.treeWithRects = null;
        this.currentNode = null;
    }

    getNodeRect(node) {
        return this.getChildNodeRect(node, this.treeWithRects);
    }

    getChildNodeRect(node, child) {
        console.log(child);
        if (child.node == node) {
            return child.rect;
        }
        let result = null;
        for (let treeChild of child.children) {
            const found = this.getChildNodeRect(node, treeChild);
            if (found) {
                result = found;
                break;
            }
        }
        return result;

    }

    findNodeByPoint(point) {
       return this.findChildWithPoint(point, this.treeWithRects);
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

    fontSettings() {
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
    }

    getTextWidth(text, min, max) {
        this.fontSettings();
        return Math.min(Math.max(this.ctx.measureText(text).width + globalConfig.MARGIN_FOR_TEXT * 2, min), max);
    }

    drawRectFrame(leftTop, width, height) {
        this.ctx.lineTo(leftTop.x + width, leftTop.y);
        this.ctx.lineTo(leftTop.x + width, leftTop.y + height);
        this.ctx.lineTo(leftTop.x, leftTop.y + height);
        this.ctx.lineTo(leftTop.x, leftTop.y);
    }

    drawElementRect(leftTop, width, height, title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = configRightMap.MAIN_BACKGROUND_COLOR;
        this.ctx.fillRect(leftTop.x, leftTop.y, width, height);
        this.ctx.fillStyle = configRightMap.SELECT_ELEMENT;
        this.fontSettings();
        this.ctx.fillText(title, leftTop.x + (width / 2), leftTop.y + (height / 1.7));
        this.ctx.fill();
        this.ctx.moveTo(leftTop.x, leftTop.y);
        this.drawRectFrame(leftTop, width, height);
        this.ctx.strokeStyle = configRightMap.FRAME_COLOR;
        if (leftTop.x == configRightMap.X_LROOT) {
            this.ctx.lineWidth = 3;
        } else {
            this.ctx.lineWidth = 2;
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawElementLine(leftTop, width, height, title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = configRightMap.SUB_BACKGROUND_COLOR;
        this.ctx.fillRect(leftTop.x, leftTop.y, width, height);
        this.ctx.fillStyle = configRightMap.SELECT_ELEMENT;
        this.fontSettings();
        this.ctx.fillText(title, leftTop.x + (width / 2), leftTop.y + (height - 10));
        this.ctx.fill();
        this.ctx.moveTo(leftTop.x, leftTop.y + height);
        this.ctx.lineTo(leftTop.x + width, leftTop.y + height);
        this.ctx.strokeStyle = configRightMap.FRAME_COLOR;
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
        this.drawRectFrame(leftTop, width, height);
        this.ctx.strokeStyle = configRightMap.SELECT_ELEMENT;
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
        const rootWidth = this.getTextWidth(this.tree.root.title, configRightMap.ROOT_MIN_WIDTH, Number.POSITIVE_INFINITY);
        return rootWidth;
    }

    drawRoot(selection) {
        const leftTop = new Point(configRightMap.X_LROOT, configRightMap.Y_LROOT);
        const rootWidth = this.getRootWidth();
        const rightBottom = new Point(configRightMap.X_LROOT + rootWidth, configRightMap.Y_LROOT + configRightMap.ROOT_HEIGHT);
        const rootRect=  new Rect(leftTop, rightBottom);
        this.treeWithRects = {
            node: this.tree.root,
            rect: rootRect,
            children: [],
        };
        this.currentNode = this.treeWithRects;
        const leftTopRoot = new Point(configRightMap.X_LROOT, configRightMap.Y_LROOT);
        this.drawElementRect(leftTopRoot, rootWidth, configRightMap.ROOT_HEIGHT, this.tree.root.title);
        this.drawSelection(rootRect, selection, this.tree.root)
    }

    drawConnection(start, end) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.strokeStyle = configRightMap.FRAME_COLOR;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawMainChild(selection) {
        const rightRootCenter = new Point(configRightMap.X_LROOT + this.getRootWidth(), configRightMap.Y_LROOT + configRightMap.ROOT_HEIGHT / 2);
        const children = this.tree.root.children;
        let connectFrom = 0;
        if (children.length > 0) {
            connectFrom = new Point(rightRootCenter.x + configRightMap.INDENT_FROM_ROOT, rightRootCenter.y);
            const startConnectFromRoot = new Point(rightRootCenter.x, rightRootCenter.y);
            this.drawConnection(startConnectFromRoot, connectFrom);
        }
        const fullHeight = this.getMainSectionsHeight(children);
        const startPoint = new Point(
            configRightMap.MAIN_SECTION_DISTANCE + rightRootCenter.x - configRightMap.EL_MIN_WIDTH / 2,
            rightRootCenter.y - fullHeight / 2);
        let topOffset = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const mainWidth = this.getTextWidth(child.title, configRightMap.EL_MIN_WIDTH, Number.POSITIVE_INFINITY);
            if (i != 0) {
                topOffset += this.getMainMarginTop(child.children);
            }
            const point = new Point(startPoint.x, startPoint.y + topOffset);
            const rightBottom = new Point(point.x + mainWidth, point.y + configRightMap.EL_HEIGHT);
            const endConnectMain = new Point(point.x, point.y + configRightMap.EL_HEIGHT/ 2);
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
            const connectionPoint = new Point(mainRect.rightBottom.x + configRightMap.INDENT_FROM_MAIN_SECTION, point.y  + configRightMap.EL_HEIGHT/ 2);
            if (child.children.length > 0) {
                const startConnectFromMain = new Point(mainRect.rightBottom.x, point.y  + configRightMap.EL_HEIGHT/ 2);
                this.drawConnection(startConnectFromMain, connectionPoint);
            }
            this.drawElementRect(point, mainWidth, configRightMap.EL_HEIGHT, child.title);
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
            const x = bottomPoint.x + configRightMap.SUBSECTION_DISTANCE;
            const y = bottomPoint.y - configRightMap.SUBSECTION_HEIGHT / 2;
            const startPoint = new Point(x, y - fullHeight / 2);
            let topOffset = 0;
            for (let i = 0; i < subsections.length; i++) {
                const subsection = subsections[i];
                const subWidth = this.getTextWidth(subsection.title, configRightMap.SUBSECTION_MIN_WIDTH, Number.POSITIVE_INFINITY);
                if (i != 0) {
                    topOffset += this.getSubsectionMarginTop(subsection.children);
                }
                const title = subsection.title;
                const point = new Point(startPoint.x, startPoint.y + topOffset);
                const rightBottom = new Point(point.x + subWidth, point.y + configRightMap.SUBSECTION_HEIGHT);
                const subsectionRect = new Rect(point, rightBottom);
                const newNode = {
                    node: subsection,
                    rect: subsectionRect,
                    children: [],
                };
                this.currentNode.children.push(newNode);
                const tmpCurrent = this.currentNode;
                this.currentNode = newNode;
                const subConnectEnd = new Point(point.x, point.y + configRightMap.SUBSECTION_HEIGHT);
                this.drawConnection(connectionPoint, subConnectEnd);
                const subsectionConnection = new Point (point.x + subWidth + configRightMap.INDENT_FROM_SUB, point.y + configRightMap.SUBSECTION_HEIGHT);
                if (subsection.children.length > 0) {
                    const subConnectStart = new Point(point.x, point.y + configRightMap.SUBSECTION_HEIGHT);
                    this.drawConnection(subConnectStart, subsectionConnection);
                }
                this.drawElementLine(point, subWidth, configRightMap.SUBSECTION_HEIGHT, title);
                this.drawSelection(subsectionRect, selection, subsection);
                this.drawSubsections(subsectionConnection, subsection.children, selection, subsectionConnection);
                //Сбился Sub нужно его восставновитть
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
            marginTop += Math.max(0, this.calculateMargin(subsections, configRightMap.SUBSECTION_HEIGHT));
            marginTop += this.getSubsectionMarginTop(subsections[0].children);
        }
        return marginTop;
    }

    getSubsectionMarginBottom(subsections) {
        let marginBottom = 0;
        if (subsections.length > 0) {
            marginBottom += Math.max(0, this.calculateMargin(subsections, configRightMap.SUBSECTION_HEIGHT));
            marginBottom += this.getSubsectionMarginBottom(subsections[subsections.length - 1].children);
        }
        return marginBottom;
    }

    getSubsectionsHeight(subsections) {
        let height = 0;
        for (let i = 0; i < subsections.length; ++i) {
            const subsection = subsections[i];
            height += configRightMap.SUBSECTION_HEIGHT;
            if (i != 0) {
                height += this.getSubsectionMarginTop(subsection.children);
                height += configRightMap.SUBSECTION_MARGIN;
            }
            if (i != subsections.length - 1) {
                const bottom = this.getSubsectionMarginBottom(subsection.children);
                height += bottom;
                height += configRightMap.SUBSECTION_MARGIN;
            }
        }
        return height;
    }

    calculateMargin(subsections, elementHeight) {
        return (this.getSubsectionsHeight(subsections) - elementHeight) / 2
    }

    getMainMarginTop(subsections) {
        let marginTop = 0;
        if (subsections.length > 0) {
            marginTop += Math.max(0, this.calculateMargin(subsections, this.getMainSectionSize()));
            marginTop += this.getSubsectionMarginTop(subsections[0].children);
            marginTop += configRightMap.MAIN_MARGIN;
        }
        return marginTop;
    }

    getMainMarginBottom(subsections) {
        let marginBottom = 0;
        if (subsections.length > 0) {
            marginBottom += Math.max(0, this.calculateMargin(subsections, this.getMainSectionSize()));
            marginBottom += this.getSubsectionMarginBottom(subsections[subsections.length - 1].children);
            marginBottom += configRightMap.MAIN_MARGIN;
        }
        return marginBottom;
    }

    getMainSectionsHeight(mainSections) {
        let height = 0;
        for (let i = 0; i < mainSections.length; ++i) {
            const mainSection = mainSections[i];
            height += configRightMap.EL_HEIGHT;
            if (i != 0) {
                height += this.getMainMarginTop(mainSection.children);
                height += configRightMap.MAIN_MARGIN;
            }
            if (i != mainSections.length - 1) {
                height += this.getMainMarginBottom(mainSection.children);
                height += configRightMap.MAIN_MARGIN;
            }
        }
        return height;
    }

    getSubsectionSize() {
        return configRightMap.SUBSECTION_HEIGHT + configRightMap.SUBSECTION_MARGIN * 2;
    }

    getMainSectionSize() {
        return configRightMap.EL_HEIGHT + configRightMap.MAIN_MARGIN * 2;
    }
}
