import { knowledge } from "../knowledge";

export const search = {
  async semantic(q: string) {
    return knowledge.query(q, 8);
  },
};