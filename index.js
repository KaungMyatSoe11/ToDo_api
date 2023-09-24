require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimiter = require("express-rate-limit");

const connectDB = require("./db/connect");

const apiKeyRouter = require("./routers/apiKeyRoutes");
const userRouter = require("./routers/authRoutes");
const toDoRouter = require("./routers/toDoRoutes");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandleMiddleware = require("./middleware/error-handler");
const apiKey = require("./middleware/api-key");
const auth = require("./middleware/auth");

var whitelist = ["http://localhost:3000", "localhost","https://todo.kaungmyatsoe.dev","kaungmyatsoe.dev","https://api-todo.kaungmyatsoe.dev"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Define a sample route
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// Set the port for your server
const port = process.env.PORT ? process.env.PORT : 5001;

app.use("/api/v1/api-key", apiKeyRouter);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/todo", auth, toDoRouter);

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
