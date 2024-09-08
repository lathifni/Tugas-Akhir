const io = require("socket.io")(3002, {
  cors: {
    origin: "http://localhost:3001",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
  });

  socket.on("join-room", (chat_room_id) => {
    socket.join(chat_room_id);
    console.log(`User joined room: ${chat_room_id}`);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected");
    // send all active users to all users
  });

  // send message to a specific user
  socket.on("send-message", (message) => {    
    socket.to(message.chat_room_id).emit("receive-message", message);
  });

  socket.on("is-read", (message) => {
    socket.to(message.chat_room_id).emit("is-read-notification", message);
  });

  socket.on("read-all-messages", (chat_room_id) => {
    socket.to(chat_room_id).emit("read-all-messages-notification");
  });
});