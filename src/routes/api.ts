import { Router } from "express";
import {
  createDrinkTicket,
  deleteGameWithId,
  getDrinkTicket,
  getGameDataWithId,
  supabase,
} from "../utils/supabase";
import {
  canGenerateTickets,
  checkDelta,
  isAtTicketThreshold,
  isTicketWin,
  validateGameData,
  validateTimeSpent,
} from "../utils/utils";
import bodyParser from "body-parser";
import { parseBody } from "../utils/body";
import {
  endGameSchema,
  startGameSchema,
  verifyDrinkTicketSchema,
} from "../utils/schemas";
import { sendDrinkTicketEmail } from "../utils/mailerSend";

export const apiRouter = Router();
const jsonParser = bodyParser.json();

apiRouter.post("/start-game", jsonParser, async (req, res) => {
  const body = parseBody(req.body, startGameSchema);

  if (!body) {
    res.json({ error: "Invalid request body" });
    return;
  }

  const { telegram, timestamp } = body;

  if (!telegram) {
    res.json({ data: { anon: true } });
    return;
  }

  if (!checkDelta(timestamp)) {
    res.json({ error: "Invalid timestamp" });
    return;
  }

  await supabase
    .from("games")
    .delete()
    .eq("telegram", telegram)
    .is("ended_at", null);

  const id = crypto.randomUUID();
  const { error } = await supabase.from("games").insert({
    id,
    telegram,
    started_at: timestamp,
  });

  if (error) {
    console.log(error);
    res.json({ error: "Error creating a new game" });
    return;
  }

  console.log("Successfully started game " + id);
  res.json({ data: { gameId: id } });
});

apiRouter.post("/end-game", jsonParser, async (req, res) => {
  const body = parseBody(req.body, endGameSchema);

  if (!body) {
    res.json({ error: "Invalid request body" });
    return;
  }

  const { gameId, score, timestamp, state } = body;

  if (!checkDelta(timestamp)) {
    res.json({ error: "Invalid timestamp" });
    return;
  }

  const data = await getGameDataWithId(gameId);
  if (!data) {
    res.json({ error: "Error fetching game data" });
    return;
  }

  const { started_at, ended_at } = data;

  if (ended_at) {
    res.json({ error: "Invalid score" });
    return;
  }

  const duration = timestamp - started_at;
  if (
    !validateTimeSpent(score, duration) ||
    (isAtTicketThreshold(score) && !validateGameData(gameId, state))
  ) {
    await deleteGameWithId(gameId);
    res.json({ error: "Invalid score" });
    return;
  }

  let drinkTicketId: string | undefined = undefined;

  if (isAtTicketThreshold(score) && canGenerateTickets(req) && isTicketWin()) {
    req.app.set("dailyIssuedTickets", req.app.get("dailyIssuedTickets") + 1);
    const { error, ticketId } = await createDrinkTicket(gameId);
    if (error) {
      console.log(error);
    } else {
      console.log("Created ticket with id: " + ticketId);
    }

    if (!error && ticketId) {
      drinkTicketId = ticketId;
    }
  } else {
    console.log("No win");
  }

  const { error } = await supabase
    .from("games")
    .update({ ended_at: timestamp, score: score })
    .eq("id", gameId);

  if (error) {
    console.log(error);
    res.json({ error: "Error updating game data" });
    return;
  }

  console.log("Succesfully ended game " + gameId + " with score " + score);
  res.json({ data: { status: "OK", drinkTicketId } });
});

apiRouter.get("/highscores", async (req, res) => {
  const { data, error } = await supabase
    .from("distinct_player")
    .select("*")
    .not("score", "is", null)
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    res.json({ error: "Error fetching highscores" });
    return;
  }

  res.json({ data: { highscores: data } });
});

apiRouter.post("/verify-ticket", jsonParser, async (req, res) => {
  const body = parseBody(req.body, verifyDrinkTicketSchema);
  if (!body) {
    res.json({ error: "Invalid request body" });
    return;
  }
  const { gameId } = body;

  if (await getDrinkTicket(gameId)) {
    res.json({ status: "OK" });
    return;
  } else {
    res.json({ error: "Invalid ticket id" });
    return;
  }
});
