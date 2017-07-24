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
        this.canvasBlock = document.getElementById('canvasdiv');
        this.input = null;
    }

    changeSelection(newSelection) {
        this.selection.prev = this.selection.curr;
        this.selection.curr = newSelection;
    }

    onPressedLeft() {
        if (this.input) {
            return;
        }
        if (this.selection.curr.parent) {
            this.selection.prev = this.selection.curr;
            this.selection.curr = this.selection.curr.parent;
            this.renderer.drawAllTree(this.selection);
        }
    }

    onPressedRight() {
        if (this.input) {
            return;
        }
        if (this.selection.curr.children.length != 0) {
            this.selection.prev = this.selection.curr;
            this.selection.curr = this.selection.prev.children[0];
            this.renderer.drawAllTree(this.selection);
        }
    }

    onPressedUp() {
        if (this.selection.curr.parent) {
            const parent = this.selection.curr.parent;
            const children = parent.children;
            const index = children.indexOf(this.selection.curr);
            const isFirstChild = 0 == index;
            if (!isFirstChild) {
                this.selection.prev = this.selection.curr;
                this.selection.curr = children[index - 1];
                this.renderer.drawAllTree(this.selection);
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
                this.selection.prev = this.selection.curr;
                this.selection.curr = children[index + 1];
                this.renderer.drawAllTree(this.selection);
            }
        }
    }

    onPressedTab() {
        const counterChild = this.selection.curr.children.length;
        let nodeName = "";
        if (this.selection.curr == this.tree.root) {
            nodeName = 'Main Section ' + (counterChild + 1);
        } else {
            nodeName = 'Subsection ' + (counterChild + 1)
        }
        const newNode = this.selection.curr.addChild(nodeName);
        if (newNode) {
            this.changeSelection(newNode);
            this.renderer.drawAllTree(this.selection);
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
        this.renderer.drawAllTree(this.selection);
    }

    pressingKeys() {
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
                }
            }
        );
    }

    onClick(point) {
        const result = this.renderer.findNodeByPoint(point);
        if (result) {
            this.selection.curr = result.node;
            this.renderer.drawAllTree(this.selection);
        }
        this.closeInput();
    }

    mouseClicker() {
        this.canvas.onclick = (e) => {
            const offset = new Point(this.canvas.getBoundingClientRect().left, this.canvas.getBoundingClientRect().top);
            const currentPoint = new Point(e.clientX - offset.x, e.clientY - offset.y);
            console.log('Точка: ', currentPoint);
            this.onClick(currentPoint);
        }
    }

    closeInput() {
        if (this.input) {
            this.selection.curr.title = this.input.value;
            this.renderer.drawAllTree(this.selection);
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
            this.input.focus();
            const rect = result.rect;
            this.selection.curr = result.node;
            this.input.value = this.selection.curr.title;
            this.changeInputStyle(rect.leftTop, rect.width(), rect.height());
        }
    }

    createInput() {
        this.closeInput();
        this.input = document.createElement('input');
        this.input.setAttribute("id", "input_block");
        this.canvasBlock.appendChild(this.input);
    }

    emergenceInput() {
        let self = this;
        this.canvas.ondblclick = function (e) {
            const offset = new Point(this.getBoundingClientRect().left, this.getBoundingClientRect().top);
            const currentPoint = new Point(e.clientX - offset.x, e.clientY - offset.y);
            self.showInput(currentPoint);
        }
    }

    controlAll() {
        this.pressingKeys();
        this.mouseClicker();
        this.emergenceInput();
    }
}