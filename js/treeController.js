class TreeController {
    constructor(tree, renderer) {
        this.tree = tree;
        this.renderer = renderer;
        this.selection = {
            new: this.tree.root,
            old: null
        };
        this.newChild = null;
    }

    changeSelection(newSelection) {
        this.selection.old = this.selection.new;
        this.selection.new = newSelection;
    }

    onPressedLeft() {
        if (this.selection.new.parent) {
            this.selection.old = this.selection.new;
            this.selection.new = this.selection.new.parent;
            this.renderer.drawAllTree(this.selection);
        }
    }

    onPressedRight() {
        if (this.selection.new.children.length != 0) {
            this.selection.old = this.selection.new;
            this.selection.new = this.selection.old.children[0];
            this.renderer.drawAllTree(this.selection);
        }
    }

    onPressedUp() {
        if (this.selection.new.parent) {
            const parent = this.selection.new.parent;
            const children = parent.children;
            const index = children.indexOf(this.selection.new);
            const isFirstChild = 0 == index;
            if (!isFirstChild) {
                this.selection.old = this.selection.new;
                this.selection.new = children[index - 1];
                this.renderer.drawAllTree(this.selection);
            }
        }
    }

    onPressedDown() {
        if (this.selection.new.parent) {
            const parent = this.selection.new.parent;
            const children = parent.children;
            const index = children.indexOf(this.selection.new);
            const isLastChild = children.length - 1 == index;
            if (!isLastChild) {
                this.selection.old = this.selection.new;
                this.selection.new = children[index + 1];
                this.renderer.drawAllTree(this.selection);
            }
        }
    }

    onPressedTab() {
        const counterChild = this.selection.new.children.length;
        let nodeName = "";
        if (this.selection.new == this.tree.root)
        {
            nodeName = 'Main Section ' + (counterChild + 1);
        } else {
            nodeName = 'Subsection ' + (counterChild + 1)
        }

        this.changeSelection(this.selection.new.addChild(nodeName));
        this.renderer.drawAllTree(this.selection);
    }

    onPressedDel() {
        if (this.selection.new == this.tree.root)
        {
            return;
        }
        this.changeSelection(this.selection.new.parent);
        const index = this.selection.new.children.indexOf(this.selection.old);
        this.selection.new.children.splice(index, 1);
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
                }
            }
        );
    }

    controlAll() {
        this.pressingArrows();
    }
}