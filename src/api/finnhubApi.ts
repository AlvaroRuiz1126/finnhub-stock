const BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = "token=d0p4mh9r01qr8ds1gd7gd0p4mh9r01qr8ds1gd80";

// This function fetches data from the Finnhub API using the provided path
const fetchData = async (path: string) =>
  fetch(`${BASE_URL}/${path}${path.includes("?") ? "&" : "?"}${API_KEY}`);

// This function retrieves a list of stock symbols from the Finnhub API, sorts them alphabetically, and stores them in localStorage
export const getPeers = async () => {
  const response = await fetchData("stock/symbol?exchange=US&currecny=USD");
  const data = await response.json();
  const alphabeticalStocks = data
    .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))
    .slice(0, 3000);
  localStorage.setItem("stocks", JSON.stringify(alphabeticalStocks));

  return alphabeticalStocks;
};

// This function retrieves the stock price for a given symbol from the Finnhub API
export const getStockPrice = async (symbol: string) => {
  const response = await fetchData(`quote?symbol=${symbol}`);
  const data = await response.json();

  return data;
};
