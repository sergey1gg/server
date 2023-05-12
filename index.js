const express = require('express');
const http = require('http');
const mongoose = require("mongoose");
const config = require("config");
const corsMiddleware = require("./middlewares/cors.middleware");
const authRouter=require("./routes/authRouter")
const usersRouter=require("./routes/usersRouter")
const actRouter=require("./routes/actRouter")
const elementRouter=require("./routes/elementRouter")
const otdelkaRouter=require("./routes/otdelkaRouter")
const directoryRouter=require("./routes/directoryRouter")
const defectRouter=require("./routes/defectRouter")
const subDefectRouter=require("./routes/subDefectRouter")
const app = express();
const Directory=require("./models/Directory")
const server = http.createServer(app);


const PORT = config.get('serverPort');

// Middleware

app.use(express.json());
app.use(corsMiddleware);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/act", actRouter)
app.use("/api/elements", elementRouter)
app.use("/api/otdelka", otdelkaRouter)
app.use("/api/defect", defectRouter)
app.use("/api/subdefect", subDefectRouter)
app.use("/api/directory", directoryRouter)
// Запуск сервера
const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(config.get("dbUrl"));

    // Проверка наличия пустой директории
    const emptyDirectory = await Directory.findOne({});
    if (!emptyDirectory) {
      const newEmptyDirectory = new Directory();
      await newEmptyDirectory.save();
      console.log("Empty directory created and saved.");
    }

    server.listen(PORT, () => {
      console.log("Server listening on port", PORT);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
start();