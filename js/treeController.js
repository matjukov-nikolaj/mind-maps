export class TreeController {
    constructor(tree, renderer) {
        this.tree = tree;
        this.renderer = renderer;
        this.selection = {
            new: this.tree.root,
            old: null
        };
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
                }
            }
        );
    }

    controlAll() {
        this.pressingArrows();
    }
}