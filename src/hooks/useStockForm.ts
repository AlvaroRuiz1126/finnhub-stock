import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { SocketContext, StockContext } from "../context";
import { getPeers, getStockPrice } from "../api";
import type { StockResponse } from "../interfaces";

export const useStockForm = () => {
  const { socket } = useContext(SocketContext);
  const { handleSetStock } = useContext(StockContext);
  const [filteredStocks, setFilteredStocks] = useState<StockResponse[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [referencePrice, setReferencePrice] = useState("");
  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const [stockSelected, setStockSelected] = useState("");
  const [searchStock, setSearchStock] = useState("");

  // Function to toggle the dropdown visibility
  const handleOpenDropdown = () => {
    setOpenDropdown(!openDropdown)
  };

  // Function to handle stock search input changes
  const handleSearchStock = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchStock(e.target.value);
    setFilteredStocks(
      stocks.filter(
        (stock) =>
          stock.symbol?.toLocaleLowerCase().includes(e.target.value) ||
          stock.description?.toLocaleLowerCase().includes(e.target.value)
      )
    );

    if (e.target.value.trim() === "") setFilteredStocks(stocks);
  };

  // Function to handle stock selection from the dropdown
  const handleSelectStock = (selectedStock: any) => {
    setStockSelected(selectedStock?.symbol || "");
    setSearchStock(`${selectedStock?.symbol} - ${selectedStock?.description}`);
    setOpenDropdown(false);
  };

  // Function to handle form submission
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!stockSelected) return;

    const stockInfo = await getStockPrice(stockSelected);
    const subscribedStocks = JSON.parse(
      localStorage.getItem("subscribedStocks") || "[]"
    );

    socket?.send(JSON.stringify({ type: "subscribe", symbol: stockSelected }));
    localStorage.setItem(
      "subscribedStocks",
      JSON.stringify([...subscribedStocks, stockSelected])
    );
    handleSetStock({
      ...stockInfo,
      symbol: stockSelected,
      referencePrice: Number(referencePrice),
    });
    setSearchStock("");
    setStockSelected("");
    setReferencePrice("");
    setFilteredStocks(stocks);
  };

  // Function to handle changes in the reference price input
  const handleChangeReferencePriceValue = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setReferencePrice(e.target.value);
  };

  useEffect(() => {
    (async () => {
      // Check if stocks are cahced in localStorage
      const cachedStocks = localStorage.getItem("stocks");

      if (cachedStocks) setStocks(JSON.parse(cachedStocks));

      // If not cached, fetch stocks from Finnhub API
      const response = await getPeers();

      setFilteredStocks(response);
      setStocks(response);
    })();
  }, []);

  return {
    filteredStocks,
    openDropdown,
    referencePrice,
    searchStock,
    stockSelected,
    handleChangeReferencePriceValue,
    handleOpenDropdown,
    handleSearchStock,
    handleSelectStock,
    handleSubmit,
  };
};
