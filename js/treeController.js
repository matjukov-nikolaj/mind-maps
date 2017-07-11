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
    }

    changeSelection(newSelection) {
        this.selection.prev = this.selection.curr;
        this.selection.curr = newSelection;
    }

    onPressedLeft() {
        if (this.selection.curr.parent) {
            this.selection.prev = this.selection.curr;
            this.selection.curr = this.selection.curr.parent;
            this.renderer.drawAllTree(this.selection);
        }
    }

    onPressedRight() {
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
                        self.closeInput();
                        break;
                    case "ArrowUp":
                        self.onPressedUp();
                        self.closeInput();
                        break;
                    case "ArrowRight":
                        self.onPressedRight();
                        self.closeInput();
                        break;
                    case "ArrowDown":
                        self.onPressedDown();
                        self.closeInput();
                        break;
                    case "Tab":
                        self.onPressedTab();
                        event.preventDefault();
                        self.closeInput();
                        break;
                    case "Enter":
                        self.closeInput();
                        break;
                    case "Delete":
                        self.onPressedDel();
                        self.closeInput();
                        break;
                }
            }
        );
        return false;
    }

    choiceByClickRoot(point) {
        if (((point.x >= config.X_LROOT) && (point.x <= config.X_LROOT + config.ROOT_WIDTH))
            && ((point.y >= config.Y_LROOT) && (point.y <= config.Y_LROOT + config.ROOT_HEIGHT))) {
            this.selection.curr = this.tree.root;
            this.renderer.drawAllTree(this.selection);
        }
    }

    choiceByClickMain(point) {
        for(let i = 0; i < this.renderer.coordinatesMain.length; i++) {
            let checkedPoint = this.renderer.coordinatesMain[i];
            if (((point.x >= checkedPoint.x) && (point.x <= checkedPoint.x + config.EL_WIDTH))
                && ((point.y >= checkedPoint.y) && (point.y <= checkedPoint.y + config.EL_HEIGHT))) {
                this.selection.curr = this.tree.root.children[i];
                this.renderer.drawAllTree(this.selection);
            }
        }
    }

    choiceByClickSub(point) {
        for(let i = 0; i < this.renderer.coordinatesSub.length; i++) {
            let checkedPoint = this.renderer.coordinatesSub[i];
            if (((point.x >= checkedPoint.x) && (point.x <= checkedPoint.x + config.SUBSECTION_WIDTH))
                && ((point.y >= checkedPoint.y) && (point.y <= checkedPoint.y + config.SUBSECTION_HEIGHT))) {
                console.log('попал в Sub');
            }
        }
    }

    mouseClicker() {
        let self = this;
        this.canvas.onclick = function (e) {
            const offset = new Point (this.getBoundingClientRect().left, this.getBoundingClientRect().top);
            const currentPoint = new Point (e.clientX - offset.x, e.clientY - offset.y);
            self.choiceByClickRoot(currentPoint);
            self.choiceByClickMain(currentPoint);
            self.choiceByClickSub(currentPoint);
            self.closeInput();
        }
    }

    closeInput() {
        const input = document.querySelector('.input_block');
        input.style.display = 'none';
        input.style.left = 0 + 'px';
        input.style.top = 0 + 'px';
        input.style.opacity = '0';
    }

    changeInputStyle(position, width, height) {
        const input = document.querySelector('.input_block');
        input.style.display = 'block';
        input.style.left = position.x + 'px';
        input.style.top = (position.y + (height - input.offsetHeight) / 2) + 'px';
        input.style.opacity = '1';
        input.style.width = width + 'px';
    }

    showInput(point) {
        let position;
        if (((point.x >= config.X_LROOT) && (point.x <= config.X_LROOT + config.ROOT_WIDTH))
            && ((point.y >= config.Y_LROOT) && (point.y <= config.Y_LROOT + config.ROOT_HEIGHT))) {
            position = new Point(config.X_LROOT, config.Y_LROOT);
            this.changeInputStyle(position, config.ROOT_WIDTH, config.ROOT_HEIGHT);
        } else {
            for(let i = 0; i < this.renderer.coordinatesMain.length; i++) {
                let checkedPoint = this.renderer.coordinatesMain[i];
                if (((point.x >= checkedPoint.x) && (point.x <= checkedPoint.x + config.EL_WIDTH))
                    && ((point.y >= checkedPoint.y) && (point.y <= checkedPoint.y + config.EL_HEIGHT))) {
                    this.changeInputStyle(checkedPoint, config.EL_WIDTH, config.EL_HEIGHT);
                }
            }
        }
    }

    emergenceInput() {
        let self = this;
        this.canvas.ondblclick = function (e) {
            const offset = new Point (this.getBoundingClientRect().left, this.getBoundingClientRect().top);
            const currentPoint = new Point (e.clientX - offset.x, e.clientY - offset.y);
            self.showInput(currentPoint);
        }
    }

    controlAll() {
        this.pressingKeys();
        this.mouseClicker();
        this.emergenceInput();
    }
}