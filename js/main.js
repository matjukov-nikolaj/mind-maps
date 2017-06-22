'use strict';
import TreeRenderer from "./js/treeRenderer.js";
import TreeController from "./js/treeController.js";

class Node {
    constructor(title) {
        this.title = title;
        this.children = [];
        this.parent = null;
    }

    addChild(nodeTitle) {
        const node = new Node(nodeTitle);
        node.parent = this;
        const pushed = this.children.push(node);
        return this.children[pushed - 1];
    }
}

class Tree {
    constructor(rootTitle){
        this.root = new Node(rootTitle);
    }
}

let allTree = new Tree("Main Section");

let section1 = allTree.root.addChild("Main Section 1");
let subsection1 = section1.addChild("Subsection 1");
subsection1.addChild("Subsection 3");
subsection1.addChild("Subsection 4");
section1.addChild("Subsection 2");
section1.addChild("Subsection 3");

let section2 = allTree.root.addChild("Main Section 2");
section2.addChild("Subsection 5");
let subsection2 = section2.addChild("Subsection 6");
subsection2.addChild("Subsection 7");

allTree.root.addChild("Main Section 3");

let section4 = allTree.root.addChild("Main Section 4");
let subsection4dot1 = section4.addChild("Subsection 8");
subsection4dot1.addChild("Subsection 9");
subsection4dot1.addChild("Subsection 10");
subsection4dot1.addChild("Subsection 11");
section4.addChild("Subsection 12");
section4.addChild("Subsection 13");
section4.addChild("Subsection 14");
let subsection4dot2 = section4.addChild("Subsection 15");
subsection4dot2.addChild("Subsection 16");
subsection4dot2.addChild("Subsection 17");

let drawAll = new TreeRenderer(allTree);
let arrowPress = new TreeController(allTree, drawAll);
arrowPress.controlAll();
drawAll.drawAllTree(arrowPress.selection);