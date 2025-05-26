const BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = "token=d0p4mh9r01qr8ds1gd7gd0p4mh9r01qr8ds1gd80";

const fetchData = async (path: string) =>
  fetch(`${BASE_URL}/${path}${path.includes("?") ? "&" : "?"}${API_KEY}`);

export const getPeers = async () => {
  const response = await fetchData("stock/symbol?exchange=US&currecny=USD");
  const data = await response.json();
  console.log(
    "common stock",
    data.filter((stock) => stock.type === "Common Stock")
  );

  return data;
};

export const getStockPrice = async (symbol: string) => {
  const response = await fetchData(`quote?symbol=${symbol}`);
  const data = await response.json();

  return data;
};
