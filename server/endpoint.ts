const ENDPOINT: string = "https://www.atm.it/it/Pagine/default.aspx";

const getPage = async (): Promise<string> =>
  $fetch(ENDPOINT, {
    method: "GET",
    mode: "cors",
  });

export { ENDPOINT, getPage };
