import { Request } from "express";
import {
  DAILY_TICKET_LIMIT,
  jumpDurations,
  MIN_POINTS_THRESHOLD,
  PLATFORM_WIDTH,
  POINTS_RATE,
  TICKET_ODDS,
} from "./const";
import { GameStateData } from "../types";
import random from "./random";

export const checkDelta = (timestamp: number) => {
  return Date.now() - timestamp < 500;
};

export const isAtTicketThreshold = (score: number) => {
  return score >= MIN_POINTS_THRESHOLD;
};

export const isTicketWin = () => {
  const rand = Math.random();
  console.log("Ticket randomization: " + rand);
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
    console.log("Duration of game: " + duration / 1000);
    return score <= (duration / 1000) * POINTS_RATE;
  }

  return true;
};

export const validatePlatformChecks = (
  uuid: string,
  state: GameStateData[]
) => {
  const rand = random(uuid);
  const index = Math.floor(rand() * 100);
  if (state.length !== 3) {
    return false;
  }

  if (index > state[0].id || index + 2 < state[0].id) {
    return false;
  }

  return (
    validateTimeBetweenJumps(state[1], state[0]) &&
    validateTimeBetweenJumps(state[2], state[1])
  );
};

const validateTimeBetweenJumps = (
  state1: GameStateData,
  state2: GameStateData
) => {
  const deltaID = state1.id - state2.id;
  const deltaTS = state1.ts - state2.ts;
  switch (deltaID) {
    case 2:
      return deltaTS >= jumpDurations[2][0] && deltaTS <= jumpDurations[2][1];
    case 1:
      return deltaTS >= jumpDurations[1][0] && deltaTS <= jumpDurations[1][1];
    case 0:
      return deltaTS >= jumpDurations[0][0] && deltaTS <= jumpDurations[0][1];
    case -1:
      return deltaTS >= jumpDurations[-1][0] && deltaTS <= jumpDurations[-1][1];
    case -2:
      return deltaTS >= jumpDurations[-2][0] && deltaTS <= jumpDurations[-2][1];
    case -3:
      return deltaTS >= jumpDurations[-3][0] && deltaTS <= jumpDurations[-3][1];
    case -4:
      return deltaTS >= jumpDurations[-4][0] && deltaTS <= jumpDurations[-4][1];
  }

  return false;
};

//rand => index, (i, i + 1, i + 2)
