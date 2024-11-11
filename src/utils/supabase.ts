import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import "dotenv/config";
import { GameDataParsed } from "../types";

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const createDrinkTicket = async (gameId: string) => {
  const uuid = crypto.randomUUID();
  const { error } = await supabase
    .from("drink_tickets")
    .insert({ id: uuid, game_id: gameId });
  return { error, ticketId: uuid };
};

export const deleteGameWithId = async (gameId: string) => {
  await supabase.from("games").delete().eq("id", gameId);
};

export const getGameDataWithId = async (gameId: string) => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .limit(1)
    .single();

  if (!data || !data.telegram || !data.started_at) {
    return undefined;
  }

  return data as GameDataParsed;
};

export const getDrinkTicket = async (gameId: string) => {
  const { data, error } = await supabase
    .from("drink_tickets")
    .select("*")
    .eq("id", gameId)
    .limit(1)
    .single();
  return data;
};

export const checkIfBanned = async (ip: string) => {
  const { data, error } = await supabase
    .from("banned_ips")
    .select("*")
    .eq("ip", ip)
    .limit(1)
    .single();

  return data;
};
