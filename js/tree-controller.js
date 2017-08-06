class TreeController {
    constructor(tree, renderer) {
        this.tree = tree;
        this.renderer = renderer;
        this.selection = {
            curr: this.tree.root,
            prev: null
        };
        this.scrollController = new ScrollController();
        this.canvas = document.getElementById('canvas');
        this.canvasBlock = document.getElementById('canvasDiv');
        this.input = null;
        this.addEventHandlers();
    }

    setTree(tree) {
        this.tree = tree;
        this.selection = {
            curr: this.tree.root,
            prev: null
        };
        this.renderer.setTree(this.tree);
        this.renderer.drawAllTree(this.selection);
    }

    changeSelection(newSelection) {
        this.selection.prev = this.selection.curr;
        this.selection.curr = newSelection;
    }

    redrawingTree() {
        this.renderer.drawAllTree(this.selection);
    }

    onPressedLeft() {
        if (this.input) {
            return;
        }
        if (this.selection.curr.parent) {
            this.changeSelection(this.selection.curr.parent);
            console.log(this.selection);
            this.redrawingTree();
        }
    }

    onPressedRight() {
        if (this.input) {
            return;
        }
        if (this.selection.curr.children.length != 0) {
            this.changeSelection(this.selection.curr.children[0]);
            console.log(this.selection);

            this.redrawingTree();
        }
    }

    onPressedUp() {
        if (this.selection.curr.parent) {
            const parent = this.selection.curr.parent;
            const children = parent.children;
            const index = children.indexOf(this.selection.curr);
            const isFirstChild = 0 == index;
            if (!isFirstChild) {
                this.changeSelection(children[index - 1]);
                this.redrawingTree();
            }
        }
    }

    onPressedDown() {
        if (this.selection.curr.parent) {
            const parent = this.selection.curr.parent;
            const children = parent.children;
            const index = children.indexOf(this.selection.curr);
            const isLastChild = children.length - 1 == index;
            if (!isLastChild) {
                this.changeSelection(children[index + 1]);
                this.redrawingTree();
            }
        }
    }

    onPressedTab() {
        let parent = this.selection.curr.parent;
        let level= 0;
        while (parent) {
            ++level;
            parent = parent.parent;
        }
        if (level >= 15){
            return;
        }
        const childCounter = this.selection.curr.children.length;
        let nodeName = "";
        if (this.selection.curr == this.tree.root) {
            nodeName = globalConfig.MAIN_NAME + (childCounter + 1);
        } else {
            nodeName = globalConfig.SUB_NAME + (childCounter + 1)
        }
        const newNode = this.selection.curr.addChild(nodeName);
        if (newNode) {
            this.changeSelection(newNode);
            this.redrawingTree();
        }
    }

    onPressedDel() {
        if (this.input) {
            this.selection.curr.title = this.input.value;
            return;
        }
        if (this.selection.curr == this.tree.root) {
            return;
        }
        this.changeSelection(this.selection.curr.parent);
        const index = this.selection.curr.children.indexOf(this.selection.prev);
        this.selection.curr.children.splice(index, 1);
        this.redrawingTree();
    }

    onPressedF2() {
        this.createInput();
        const rect = this.renderer.getNodeRect(this.selection.curr);
        this.input.value = this.selection.curr.title;
        this.input.select();
        this.changeInputStyle(rect.leftTop, rect.width(), rect.height());
        this.input.focus();
    }

    addKeyDownHandler() {
        let self = this;
        window.addEventListener("keydown", function (event) {
                switch (event.code) {
                    case "ArrowLeft":
                        self.onPressedLeft();
                        break;
                    case "ArrowUp":
                        self.closeInput();
                        self.onPressedUp();
                        break;
                    case "ArrowRight":
                        self.onPressedRight();
                        break;
                    case "ArrowDown":
                        self.closeInput();
                        self.onPressedDown();
                        break;
                    case "Tab":
                        self.closeInput();
                        self.onPressedTab();
                        event.preventDefault();
                        break;
                    case "Enter":
                        self.closeInput();
                        event.preventDefault();
                        break;
                    case "Delete":
                        self.onPressedDel();
                        break;
                    case "F2":
                        self.onPressedF2();
                        break;
                }
            }
        );
    }

    onClick(point) {
        this.closeInput();
        const result = this.renderer.findNodeByPoint(point);
        if (result) {
            this.selection.curr = result.node;
            this.redrawingTree();
        }
    }

    addMouseClickHandler() {
        this.canvas.onclick = (e) => {
            const offset = new Point(this.canvas.getBoundingClientRect().left, this.canvas.getBoundingClientRect().top);
            const currentPoint = new Point(e.clientX - offset.x, e.clientY - offset.y);
            this.onClick(currentPoint);
        }
    }

    closeInput() {
        if (this.input) {
            this.selection.curr.title = this.input.value;
            this.redrawingTree();
            this.canvasBlock.removeChild(this.input);
            this.input = null;
        }
    }

    changeInputStyle(position, width, height) {
        this.input.style.display = 'block';
        this.input.style.left = position.x + 'px';
        this.input.style.top = (position.y + (height - this.input.offsetHeight) / 2) + 'px';
        this.input.style.opacity = '1';
        this.input.style.width = width + 'px';
    }

    showInput(point) {
        this.createInput();
        const result = this.renderer.findNodeByPoint(point);
        if (result) {
            const rect = result.rect;
            this.selection.curr = result.node;
            this.input.value = this.selection.curr.title;
            this.input.select();
            this.changeInputStyle(rect.leftTop, rect.width(), rect.height());
            this.input.focus();
        }
    }

    createInput() {
        this.closeInput();
        this.input = document.createElement('input');
        this.input.setAttribute("id", "input_block");
        this.canvasBlock.appendChild(this.input);
    }

    addCanvasDoubleClickHandler() {
        let self = this;
        this.canvas.ondblclick = function (e) {
            const offset = new Point(this.getBoundingClientRect().left, this.getBoundingClientRect().top);
            const currentPoint = new Point(e.clientX - offset.x, e.clientY - offset.y);
            self.showInput(currentPoint);
        }
    }

    addEventHandlers() {
        this.addKeyDownHandler();
        this.addMouseClickHandler();
        this.addCanvasDoubleClickHandler();
    }
}