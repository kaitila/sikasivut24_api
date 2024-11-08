export type ApiResponse =
  | {
      data: {
        status: "OK";
        drinkTicketId?: string;
        gameId?: string;
      };
      error: undefined;
    }
  | {
      data: undefined;
      error: string;
    };

export interface GameDataParsed {
  email: string;
  ended_at: number | null;
  id: string;
  score: number | null;
  started_at: number;
  telegram: string;
}

export type GameValidationType = number[];
