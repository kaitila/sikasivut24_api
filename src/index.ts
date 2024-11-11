import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";
import "dotenv/config";
import { apiRouter } from "./routes/api";
import { getCurrentDay } from "./utils/utils";
import { checkForIp } from "./middleware";
import cors from "cors";

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

app.use(cors({ origin: ["http://127.0.0.1:5500", "https://sikajuhlat.com"] }));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
      "img-src": ["'self'", "api.qrserver.com/"],
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

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/test.html"));
});

app.get("/drink-ticket", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/drink-ticket.html"));
});

app.listen(port, () => {
  console.log(`\n\nServer live at http://localhost:${port}\n\n`);
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
