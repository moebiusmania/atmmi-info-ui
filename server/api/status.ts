import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

import ENDPOINT from "../endpoint";
import type { LineStatus } from "../../types/line";

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

instance.get(ENDPOINT);

// export default defineEventHandler(async (): Promise<LineStatus[]> => {

export default defineEventHandler(async () => {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  console.log(ENDPOINT);
  const { data } = await axios.get(ENDPOINT, { httpsAgent: agent });

  const $ = cheerio.load(data);

  return {
    html: $.html(),
  };
});
