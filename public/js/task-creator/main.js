'use strict';
const api = new MindMapApi();

let allTree = new Tree("");

const treeRenderer = new TreeRenderer(allTree);
const treeController = new TaskTreeController(allTree, treeRenderer);
const createTaskModal = new CreateTaskModal();
// const saveModalWindow = new SaveAsModal(allTree);
const mindMapLoader = new MindMapLoaderController(allTree);
// const saveChanges = new SaveChangesController(allTree);

mindMapLoader.onLoadTree = (tree) => {
    treeController.setTree(tree);
    // saveModalWindow.setTree(tree);
    // saveChanges.setTree(tree);
    allTree = tree;
};

treeRenderer.drawAllTree(treeController.selection);
