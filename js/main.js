'use strict';
const allTree = new Tree("Main Section");
const modalManager = new ModalManager(allTree);
const drawAll = new TreeRenderer(allTree);
const arrowPress = new TreeController(allTree, drawAll);
arrowPress.controlAll();
drawAll.drawAllTree(arrowPress.selection);