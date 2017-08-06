'use strict';
let allTree = new Tree(globalConfig.MAIN_NAME);
const modalManager = new ModalManager(allTree);
const treeRenderer = new TreeRenderer(allTree);
const treeController = new TreeController(allTree, treeRenderer);
modalManager.onLoadTree = (tree) => {
  treeController.setTree(tree);
  allTree = tree;
};
treeRenderer.drawAllTree(treeController.selection);