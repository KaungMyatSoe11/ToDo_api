const { default: mongoose } = require("mongoose");

const ToDoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      require: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: "false",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref:"user"
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("ToDo", ToDoSchema);
