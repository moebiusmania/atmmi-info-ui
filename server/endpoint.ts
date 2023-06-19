const ENDPOINT: string = "https://www.atm.it/it/Pagine/default.aspx";

const getPage = async (): Promise<string> => {
  const response = await fetch(ENDPOINT, {
    method: "GET",
    mode: "cors",
  });

  return response.text();
};

export { ENDPOINT, getPage };
