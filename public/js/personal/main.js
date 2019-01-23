const api = new MindMapApi();

const deleter = new DeleteMindMapController();
const downloadController = new DownloadController();
const loadModal = new LoadModal();
const createTaskModal = new CreateTaskModal();
const personalModal = new PersonalInfo(api);
const openAccess = new OpenAccess();
const forumModal = new ForumModal(api);
