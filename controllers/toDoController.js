const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error");
const ToDo = require("../models/ToDo");

const createToDo = async (req, res) => {
  const { userId } = req.user;
  const { text } = req.body;

  if (!text) {
    throw new CustomError.BadRequest("Please provide task value");
  }

  req.body.user = userId;
  const todo = await ToDo.create(req.body);

  res.status(StatusCodes.CREATED).json({ todo });
};

const getAllToDos = async (req, res) => {
  const { userId } = req.user;
  const todos = await ToDo.find({ user: userId });
  res.status(StatusCodes.OK).json({ todos });
};

const updateToDo = async (req, res) => {
  const { id: toDoId } = req.params;
  const { text, completed } = req.body;

  const todo = await ToDo.findOne({ _id: toDoId });

  if (!todo) {
    throw new CustomError.NotFoundError(`No data with id ${toDoId}`);
  }

  todo.text = text;
  todo.completed = completed;

  await todo.save();
  res.status(StatusCodes.OK).json({ todo });
};

const deleteToDo = async (req, res) => {
  const { id: toDoId } = req.params;

  const todo = await ToDo.findOne({ _id: toDoId });

  if (!todo) {
    throw new CustomError.NotFoundError("No todo with id " + toDoId);
  }

  await todo.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Successfully Deleted!" });
};

module.exports = { createToDo, getAllToDos, deleteToDo, updateToDo };
