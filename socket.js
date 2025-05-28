const { Server } = require("socket.io");
const http = require("http");
const app = require("./app.js");
const server = http.createServer(app);
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const projectModel = require("./models/project.js");
const generateResult = require("./google_ai.js");
// const generateResult = require("./openai.js")
// const generateResult = require("./llama.js")

const io = new Server(server, {
  cors: {
    origin: ["https://ai-webdeveloper-frontend.onrender.com"],
  },
});

io.use(async(socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization.split(" ")[1];

    const projectId = socket.handshake.query.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("invalid project id"));
    }
    socket.project = await projectModel.findById(projectId);

    if (!token) {
      return next(new Error("invalid user"));
    }
    jwt.verify(token.slice(1, -1), process.env.JWT_SECRET, function (err, decoded) {

      if (!decoded) {
        return next(new Error("invalid user"));
      }
      socket.user = decoded;
      next(); // check
    });
  } catch (error) {
    return next(new Error("invalid user"));
  }
});

io.on("connection", (socket) => {

  if (socket.project) {
    socket.join(socket.project._id.toString());
  }

  socket.on("project-message", async(data) => {

    const message = data.message

    const aiIsPresentInMessages = message.includes("@ai");
    socket.broadcast.to(socket.project._id.toString()).emit("project-message-receive", data);
    
    if (aiIsPresentInMessages) {
      let prompt = message.replace("@ai", "");
      if (prompt.includes("create") || prompt.includes("make") || prompt.includes("react") || prompt.includes("node") || prompt.includes("project")) {
        prompt += "\nIn react project index.html and vite.config.js should be in root directory.Create an App.jsx file as the main component. Ensure a main.jsx file exists in the src directory to initialize React.When multiple pages are required, create a pages/ folder in src.Use a components/ folder inside src to store reusable components.Apply Tailwind CSS for styling where applicable.Create backend only when required otherwise avoid making backend. In backend create Store sensitive credentials in a .env file when required Use MongoDB as the database, and always connect using this URI:'mongodb+srv://Anubhavpandey:xg3bVxJO5PGfKQXs@projectdb001.yfit8.mongodb.net/?retryWrites=true&w=majority&appName=ProjectDB001' . Implement proper API routes for CRUD operations. Enable CORS to allow frontend-backend communication. Use this base url when fetching data from backend 'https://k03e2io1v3fx9wvj0vr8qd5q58o56n-fkdo--3001--d20a0a75.local-corp.webcontainer-api.io'.Use Fetch to interact with backend "
        prompt += "Follow a structured MERN stack architecture.Ensure the code is modular, well-commented, and follows best practices.If the project requires authentication, use JWT for secure login sessions."
        if (data?.fileTree) {
          prompt = `${prompt} This is my current project `
          prompt += JSON.stringify(data.fileTree, null, 2);
        }
      }
      console.log(prompt);
      const result = await generateResult(prompt);
      console.log(result);
      // socket.to(socket.project._id.toString()).emit("project-message-receive", data);
      io.to(socket.project._id.toString()).emit("project-message-receive", {
        user : {
          username:'ai',
          email:'AI',
          _id:'ai'
        },
        message : result
      }); 
      return 
    }
   
  });

  socket.on("disconnect", (reason) => {
    socket.leave(socket.project._id.toString());
  });

  socket.on("connect_error", (err) => {
  });
});
module.exports = { server, io };
