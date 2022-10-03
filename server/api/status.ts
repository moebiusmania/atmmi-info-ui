import * as cheerio from "cheerio";

import ENDPOINT from "../endpoint";
import type { LineStatus } from "../../types/line";

// export default defineEventHandler(async (): Promise<LineStatus[]> => {

export default defineEventHandler(async () => {
  /*const data = await $fetch(ENDPOINT, {
    method: "GET",
    mode: "cors",
  });*/
  const response = await fetch(ENDPOINT, {
    method: "GET",
    mode: "cors",
  });
  const data = await response.json();
  console.log(data);
  //const $ = cheerio.load(data);

  return {
    // html: $.html(),
    test: data,
  };
});
