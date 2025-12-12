require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const compression = require("compression");
const MongoStore = require("connect-mongo").default;
const database = require("./config/database");
const routeClient = require("./routes/client/index.route");

const http = require("http");
const { Server } = require("socket.io");

const startServer = async () => {
  try {
    await database.connect();
    const server = http.createServer(app);
    const io = new Server(server);
    global._io = io;

    // Socket middleware để set userId
    io.use((socket, next) => {
      const userId = socket.handshake.auth.userId;
      if (userId) {
        socket.userId = userId;
      }
      next();
    });

    // Load socket handlers
    const chatSocket = require("./socket/client/chat.socket");
    chatSocket(io);

    const usersSocket = require("./socket/client/users.socket");
    usersSocket(io);

    // Middleware
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(flash());
    app.use(methodOverride("_method"));

    app.set("views", `${__dirname}/views`);
    app.use(
      express.static(`${__dirname}/public`, {
        maxAge: "1y",
      })
    );
    app.set("view engine", "pug");

    app.use(cookieParser(process.env.COOKIE_SECRET || "nhathuy2005"));
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "session_secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.MONGO_URL,
          ttl: 14 * 24 * 60 * 60,
        }),
        cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
      })
    );

    // Routes
    routeClient(app);

    // START SERVER
    server.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (err) {
    console.error("Server failed to start");
    console.error(err);
    process.exit(1);
  }
};

startServer();
