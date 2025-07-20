
import axios from "axios";

import { GiveawaySchema } from "../models/giveaway";

const API_URL = "https://www.gamerpower.com/api/giveaways";

export const getGiveaways = async () => {
  try {
    const response = await axios.get(API_URL);
    return GiveawaySchema.array().parse(response.data);
  } catch (error) {
    console.error("Error fetching or validating giveaways:", error);
    return [];
  }
};
