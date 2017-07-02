class TreeController {
    constructor(tree, renderer) {
        this.tree = tree;
        this.renderer = renderer;
        this.selection = {
            curr: this.tree.root,
            prev: null
        };
        this.scrollController = new scrollController();
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
        if (this.selection.curr == this.tree.root)
        {
            nodeName = 'Main Section ' + (counterChild + 1);
        } else {
            nodeName = 'Subsection ' + (counterChild + 1)
        }

        this.changeSelection(this.selection.curr.addChild(nodeName));
        this.renderer.drawAllTree(this.selection);
    }

    onPressedDel() {
        if (this.selection.curr == this.tree.root)
        {
            return;
        }
        this.changeSelection(this.selection.curr.parent);
        const index = this.selection.curr.children.indexOf(this.selection.prev);
        this.selection.curr.children.splice(index, 1);
        this.renderer.drawAllTree(this.selection);
    }

    // Обработка нажатий стрелок
    pressingArrows() {
        let self = this;
        window.addEventListener("keydown", function (event) {
                switch (event.code) {
                    case "ArrowLeft":
                        self.onPressedLeft();
                        break;
                    case "ArrowUp":
                        self.onPressedUp();
                        break;
                    case "ArrowRight":
                        self.onPressedRight();
                        break;
                    case "ArrowDown":
                        self.onPressedDown();
                        break;
                    case "Tab":
                        self.onPressedTab();
                        break;
                    case "Delete":
                        self.onPressedDel();
                        break;
                    return false;
                }
            }
        );
    }



    controlAll() {
        this.pressingArrows();
    }
}