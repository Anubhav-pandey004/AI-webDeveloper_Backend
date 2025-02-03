const { Server } = require("socket.io");
const http = require("http");
const app = require("./app.js");
const server = http.createServer(app);
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const projectModel = require("./models/project.js");
const generateResult = require("./google_ai.js");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
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
    console.log(error);
    return next(new Error("invalid user"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  if (socket.project) {
    socket.join(socket.project._id.toString());
    console.log("Joined room with project ID:", socket.project._id.toString());
  }

  socket.on("project-message", async(data) => {

    const message = data.message

    const aiIsPresentInMessages = message.includes("@ai");
    socket.broadcast.to(socket.project._id.toString()).emit("project-message-receive", data);
    if (aiIsPresentInMessages) {
      const prompt = message.replace("@ai", "");
      const result = await generateResult(prompt);
      
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
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    socket.leave(socket.project._id.toString());
  });

  socket.on("connect_error", (err) => {
    console.log(`Connection Error: ${err.message}`);
  });
});
module.exports = { server, io };
