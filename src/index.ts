import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";
import "dotenv/config";
import { apiRouter } from "./routes/api";
import { getCurrentDay } from "./utils/utils";
import { checkForIp } from "./middleware";

const app = express();
const port = process.env.PORT || 8080;

app.set("dailyIssuedTickets", 0);
app.set("issuedTicketsDay", getCurrentDay());

app.use(compression()); // Compress all routes
const limiter = RateLimit({
  windowMs: 1 * 30 * 1000, // 30sec
  max: 500,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(path.join(__dirname, "../public")));
app.use("/api", checkForIp, apiRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

app.get("/theme", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/theme.html"));
});

app.get("/2", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index2.html"));
});

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/test.html"));
});

app.listen(port, () => {
  console.log(`\n\nServer live at http://localhost:${port}\n\n`);
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
