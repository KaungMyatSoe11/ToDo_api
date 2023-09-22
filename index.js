require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const requestIp = require("request-ip");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/connect");

const apiKeyRouter = require("./routers/apiKeyRoutes");
const userRouter = require("./routers/authRoutes");
const toDoRouter = require("./routers/toDoRoutes");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandleMiddleware = require("./middleware/error-handler");
const apiKey = require("./middleware/api-key");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Define a sample route
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// Set the port for your server
const port = process.env.PORT ? process.env.PORT : 5001;

app.use("/api/v1/api-key", apiKeyRouter);
app.use("/api/v1/auth", apiKey, userRouter);
app.use("/api/v1/todo", apiKey, auth,toDoRouter );

app.use(notFoundMiddleware);
app.use(errorHandleMiddleware);

// Start the server
const load = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Site is listening in port http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

load();
