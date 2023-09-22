const { default: mongoose } = require("mongoose");

const ApiKeySchema = new mongoose.Schema(
  {
    api_key: {
      type: String,
      required: [true],
      unique: true,
    },
    api_name: {
      type: String,
      required: true,
      unique: true,
    },
    reated_By: {
      type: String,
      required: [false, "Please provide created By."],
    },
    updated_By: {
      type: String,
      required: [false, "Please provide updated By."],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("ApiKey", ApiKeySchema);
