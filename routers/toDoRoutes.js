const { Router } = require("express");
const {
  getAllToDos,
  createToDo,
  updateToDo,
  deleteToDo,
} = require("../controllers/toDoController");

const router = Router();

router.route("/").get(getAllToDos).post(createToDo);
router.route("/:id").patch(updateToDo).delete(deleteToDo);

module.exports = router;
