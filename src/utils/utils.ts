import { Request } from "express";
import {
  DAILY_TICKET_LIMIT,
  MIN_POINTS_THRESHOLD,
  POINTS_RATE,
  TICKET_ODDS,
} from "./const";
import { GameValidationType } from "../types";
import random from "./random";

export const checkDelta = (timestamp: number) => {
  //console.log(Date.now() - timestamp);
  const delta = Date.now() - timestamp;
  return delta < 5000 && delta > 0;
};

export const isAtTicketThreshold = (score: number) => {
  /*   console.log(
    "Ticket threshold: " + MIN_POINTS_THRESHOLD + ". Submitted score: " + score
  ); */
  return score >= MIN_POINTS_THRESHOLD;
};

export const isTicketWin = () => {
  const rand = Math.random();
  // console.log("Ticket randomization: " + rand);
  return rand <= TICKET_ODDS;
};

export const canGenerateTickets = (req: Request) => {
  if (req.app.get("issuedTicketsDay") < getCurrentDay()) {
    req.app.set("issuedTicketsDay", getCurrentDay());
    req.app.set("dailyIssuedTickets", 0);
    return true;
  }

  return req.app.get("dailyIssuedTickets") < DAILY_TICKET_LIMIT;
};

export const getCurrentDay = () => {
  const date = new Date();
  return date.getDate();
};

export const validateTimeSpent = (score: number, duration: number) => {
  if (score >= MIN_POINTS_THRESHOLD) {
    // console.log("Duration of game: " + duration / 1000);
    return score <= (duration / 1000) * POINTS_RATE;
  }

  return true;
};

export const validateGameData = (
  uuid: string,
  gameData: GameValidationType
) => {
  // console.log("called");
  const rand = random(uuid);
  const startIndex = Math.floor(rand() * 100);
  const arrLength = Math.floor(rand() * 10);

  if (gameData.length != arrLength) {
    return false;
  }

  for (let i = 0; i < startIndex; i++) {
    rand();
  }

  return gameData.every((val) => val == rand());
};
