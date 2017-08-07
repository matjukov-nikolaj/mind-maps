class TreeRenderer {

    constructor(tree) {
        this.canvas = document.getElementById('canvas');
        this.canvas.focus();
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = globalConfig.MAX_CANVAS_SIZE;
        this.canvas.height = globalConfig.MAX_CANVAS_SIZE;
        this.tree = tree;
        this.treeWithRects = null;
    }

    setTree(tree) {
        this.tree = tree;
        this.treeWithRects = null;
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

    _fontSettings() {
        this.ctx.font = "bold 18px sans-serif";
        this.ctx.textAlign = "center";
    }

    _getTextWidth(text, min, max) {
        this._fontSettings();
        return Math.min(Math.max(this.ctx.measureText(text).width + globalConfig.MARGIN_FOR_TEXT * 2, min), max);
    }

    _drawRectFrame(leftTop, width, height) {
        this.ctx.lineTo(leftTop.x + width, leftTop.y);
        this.ctx.lineTo(leftTop.x + width, leftTop.y + height);
        this.ctx.lineTo(leftTop.x, leftTop.y + height);
        this.ctx.lineTo(leftTop.x, leftTop.y);
    }

    _drawElementRect(leftTop, width, height, title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = mainConfig.BACKGROUND_COLOR;
        this.ctx.fillRect(leftTop.x, leftTop.y, width, height);
        this.ctx.fillStyle = colorConfig.SELECT_ELEMENT;
        this._fontSettings();
        this.ctx.fillText(title, leftTop.x + (width / 2), leftTop.y + (height / 1.7));
        this.ctx.fill();
        this.ctx.moveTo(leftTop.x, leftTop.y);
        this._drawRectFrame(leftTop, width, height);
        this.ctx.strokeStyle = colorConfig.FRAME_COLOR;
        if (leftTop.x == rootConfig.leftTop.x) {
            this.ctx.lineWidth = 3;
        } else {
            this.ctx.lineWidth = 2;
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    _drawElementLine(leftTop, width, height, title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = subsectionConfig.BACKGROUND_COLOR;
        this.ctx.fillRect(leftTop.x, leftTop.y, width, height);
        this.ctx.fillStyle = colorConfig.SELECT_ELEMENT;
        this._fontSettings();
        this.ctx.fillText(title, leftTop.x + (width / 2), leftTop.y + (height - 10));
        this.ctx.fill();
        this.ctx.moveTo(leftTop.x, leftTop.y + height);
        this.ctx.lineTo(leftTop.x + width, leftTop.y + height);
        this.ctx.strokeStyle = colorConfig.FRAME_COLOR;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    _drawOutline(leftTop, width, height) {
        this.ctx.beginPath();
        const indent = 5;
        leftTop.x -= indent;
        leftTop.y -= indent;
        width += indent * 2;
        height += indent * 2;
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.moveTo(leftTop.x, leftTop.y);
        this._drawRectFrame(leftTop, width, height);
        this.ctx.strokeStyle = colorConfig.SELECT_ELEMENT;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    _drawSelection(rect, selection, node) {
        if (node == selection.curr) {
            this._drawOutline(rect.leftTop, rect.width(), rect.height());
        }
    }

    _getRootWidth() {
        const rootWidth = this._getTextWidth(this.tree.root.title, rootConfig.MIN_WIDTH, Number.POSITIVE_INFINITY);
        return rootWidth;
    }

    _drawRoot(selection) {
        const leftTop = new Point(rootConfig.leftTop.x, rootConfig.leftTop.y);
        const rootWidth = this._getRootWidth();
        const rightBottom = new Point(rootConfig.leftTop.x + rootWidth, rootConfig.leftTop.y + rootConfig.HEIGHT);
        const rootRect=  new Rect(leftTop, rightBottom);
        this.treeWithRects = {
            node: this.tree.root,
            rect: rootRect,
            children: [],
        };
        const leftTopRoot = new Point(rootConfig.leftTop.x, rootConfig.leftTop.y);
        this._drawElementRect(leftTopRoot, rootWidth, rootConfig.HEIGHT, this.tree.root.title);
        this._drawSelection(rootRect, selection, this.tree.root)
    }

    _drawConnection(start, end) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.strokeStyle = colorConfig.FRAME_COLOR;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    _drawMainChild(selection) {
        const rightRootCenter = new Point(rootConfig.leftTop.x + this._getRootWidth(), rootConfig.leftTop.y + rootConfig.HEIGHT / 2);
        const children = this.tree.root.children;
        let connectFrom = 0;
        if (children.length > 0) {
            connectFrom = new Point(rightRootCenter.x + rootConfig.INDENT, rightRootCenter.y);
            const startConnectFromRoot = new Point(rightRootCenter.x, rightRootCenter.y);
            this._drawConnection(startConnectFromRoot, connectFrom);
        }
        const fullHeight = this._getMainSectionsHeight(children);
        const startPoint = new Point(
            mainConfig.DISTANCE + rightRootCenter.x - mainConfig.MIN_WIDTH / 2,
            rightRootCenter.y - fullHeight / 2);

        this._drawTreeElement({
            elements: children,
            selection,
            startPoint,
            currentNode: this.treeWithRects,
            config: mainConfig,
            connectionPoint: connectFrom,
            drawElementFn: (point, elementWidth, height, title) => this._drawElementRect(point, elementWidth, height, title),
            getMarginTopFn: (children) => this._getMainMarginTop(children),
            getMarginBottomFn: (children) => this._getMainMarginBottom(children),
            calculateConnectionYFn: (pointY) => pointY + mainConfig.HEIGHT / 2 ,
        });
    };

    _drawSubsections(bottomPoint, subsections, selection, connectionPoint, currentNode) {
        if (subsections.length != 0) {
            const fullHeight = this._getSubsectionsHeight(subsections);
            const x = bottomPoint.x + subsectionConfig.DISTANCE;
            const y = bottomPoint.y - subsectionConfig.HEIGHT / 2;
            const startPoint = new Point(x, y - fullHeight / 2);
            this._drawTreeElement({
                elements: subsections,
                selection,
                startPoint,
                currentNode,
                config: subsectionConfig,
                connectionPoint,
                drawElementFn: (point, elementWidth, height, title) => this._drawElementLine(point, elementWidth, height, title),
                getMarginTopFn: (children) => this._getSubsectionMarginTop(children),
                getMarginBottomFn: (children) => this._getSubsectionMarginBottom(children),
                calculateConnectionYFn: (pointY) => pointY + subsectionConfig.HEIGHT,
            });
        }
    }

    _drawTreeElement({elements, selection, startPoint, config, currentNode, connectionPoint, drawElementFn, getMarginTopFn, getMarginBottomFn, calculateConnectionYFn}) {
        let topOffset = 0;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const elementWidth = this._getTextWidth(element.title, config.MIN_WIDTH, Number.POSITIVE_INFINITY);
            if (i != 0) {
                topOffset += getMarginTopFn(element.children);
            }
            const title = element.title;
            const point = new Point(startPoint.x, startPoint.y + topOffset);
            const rightBottom = new Point(point.x + elementWidth, point.y + config.HEIGHT);
            const elementRect = new Rect(point, rightBottom);
            const newNode = {
                node: element,
                rect: elementRect,
                children: [],
            };
            currentNode.children.push(newNode);
            const connectionEndPoint = new Point(point.x, calculateConnectionYFn(point.y));
            this._drawConnection(connectionPoint, connectionEndPoint);
            const elementConnection = new Point (point.x + elementWidth + config.INDENT, calculateConnectionYFn(point.y));
            if (element.children.length > 0) {
                const connectionStartPoint = new Point(point.x, calculateConnectionYFn(point.y));
                this._drawConnection(connectionStartPoint, elementConnection);
            }
            drawElementFn(point, elementWidth, config.HEIGHT, title);
            this._drawSelection(elementRect, selection, element);
            this._drawSubsections(elementConnection, element.children, selection, elementConnection, newNode);
            const subBottom = getMarginBottomFn(element.children);
            topOffset += subBottom + config.HEIGHT + config.MARGIN * 2;
        }
    }

    _clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAllTree(selection) {
        this._clearCanvas();
        this._drawRoot(selection);
        this._drawMainChild(selection);
    }

    _getSubsectionMarginTop(subsections) {
        let marginTop = 0;
        if (subsections.length > 0) {
            marginTop += Math.max(0, this._calculateMargin(subsections, subsectionConfig.HEIGHT));
            marginTop += this._getSubsectionMarginTop(subsections[0].children);
        }
        return marginTop;
    }

    _getSubsectionMarginBottom(subsections) {
        let marginBottom = 0;
        if (subsections.length > 0) {
            marginBottom += Math.max(0, this._calculateMargin(subsections, subsectionConfig.HEIGHT));
            marginBottom += this._getSubsectionMarginBottom(subsections[subsections.length - 1].children);
        }
        return marginBottom;
    }

    _getSubsectionsHeight(subsections) {
        let height = 0;
        for (let i = 0; i < subsections.length; ++i) {
            const subsection = subsections[i];
            height += subsectionConfig.HEIGHT;
            if (i != 0) {
                height += this._getSubsectionMarginTop(subsection.children);
                height += subsectionConfig.MARGIN;
            }
            if (i != subsections.length - 1) {
                const bottom = this._getSubsectionMarginBottom(subsection.children);
                height += bottom;
                height += subsectionConfig.MARGIN;
            }
        }
        return height;
    }

    _calculateMargin(subsections, elementHeight) {
        return (this._getSubsectionsHeight(subsections) - elementHeight) / 2
    }

    _getMainMarginTop(subsections) {
        let marginTop = 0;
        if (subsections.length > 0) {
            marginTop += Math.max(0, this._calculateMargin(subsections, this._getMainSectionSize()));
            marginTop += this._getSubsectionMarginTop(subsections[0].children);
            marginTop += mainConfig.MARGIN;
        }
        return marginTop;
    }

    _getMainMarginBottom(subsections) {
        let marginBottom = 0;
        if (subsections.length > 0) {
            marginBottom += Math.max(0, this._calculateMargin(subsections, this._getMainSectionSize()));
            marginBottom += this._getSubsectionMarginBottom(subsections[subsections.length - 1].children);
            marginBottom += mainConfig.MARGIN;
        }
        return marginBottom;
    }

    _getMainSectionsHeight(mainSections) {
        let height = 0;
        for (let i = 0; i < mainSections.length; ++i) {
            const mainSection = mainSections[i];
            height += mainConfig.HEIGHT;
            if (i != 0) {
                height += this._getMainMarginTop(mainSection.children);
                height += mainConfig.MARGIN;
            }
            if (i != mainSections.length - 1) {
                height += this._getMainMarginBottom(mainSection.children);
                height += mainConfig.MARGIN;
            }
        }
        return height;
    }

    _getSubsectionSize() {
        return subsectionConfig.HEIGHT + subsectionConfig.MARGIN * 2;
    }

    _getMainSectionSize() {
        return mainConfig.HEIGHT + mainConfig.MARGIN * 2;
    }
}
