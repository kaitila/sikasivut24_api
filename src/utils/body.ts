import * as z from "zod";

export const parseBody = <T extends z.ZodObject<any>>(body: any, schema: T) => {
  const { data } = schema.safeParse(body);
  if (data) {
    return data as z.infer<T>;
  }

  return undefined;
};
