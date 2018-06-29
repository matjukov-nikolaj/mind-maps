'use strict';
const api = new MindMapApi();

let allTree = new Tree(globalConfig.MAIN_NAME);

const InformationWindow = new HelpModal();
const treeRenderer = new TreeRenderer(allTree);
const treeController = new TreeController(allTree, treeRenderer);

const saveModalWindow = new SaveAsModal(allTree);
const mindMapLoader = new MindMapLoaderController(allTree);
const saveChanges = new SaveChangesController(allTree);

mindMapLoader.onLoadTree = (tree) => {
    treeController.setTree(tree);
    saveModalWindow.setTree(tree);
    saveChanges.setTree(tree);
    allTree = tree;
};

treeRenderer.drawAllTree(treeController.selection);
