'use strict';

let allTree = new Tree("Main Section");

let drawAll = new TreeRenderer(allTree);
let arrowPress = new TreeController(allTree, drawAll);
arrowPress.controlAll();
drawAll.drawAllTree(arrowPress.selection);