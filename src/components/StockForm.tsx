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

export const StockForm = () => {
  const { socket } = useContext(SocketContext);
  const { handleSetStock } = useContext(StockContext);
  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const [stockSelected, setStockSelected] = useState("");
  const [searchStock, setSearchStock] = useState("");
  const [referencePrice, setReferencePrice] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<StockResponse[]>([]);

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

  const handleSelectStock = async (e: ChangeEvent<HTMLSelectElement>) => {
    setStockSelected(e.target.value);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!stockSelected) return;

    const stockInfo = await getStockPrice(stockSelected);
    const subscribedStocks = JSON.parse(localStorage.getItem("subscribedStocks") || "[]");

    socket?.send(JSON.stringify({ type: "subscribe", symbol: stockSelected }));
    localStorage.setItem("subscribedStocks", JSON.stringify([...subscribedStocks, stockSelected]));
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

  const handleChangeReferencePriceValue = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setReferencePrice(e.target.value);
  };

  useEffect(() => {
    (async () => {
      const cachedStocks = localStorage.getItem("stocks");

      if(cachedStocks) setStocks(JSON.parse(cachedStocks));

      const response = await getPeers();

      setFilteredStocks(response);
      setStocks(response);
    })();
  }, []);

  return (
    <div className="stock-form__container">
      <form className="sotck-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search a Stock"
          onChange={handleSearchStock}
          value={searchStock}
        />

        <select
          className="stock-form__select"
          onChange={handleSelectStock}
          value={stockSelected}
        >
          <option value="" disabled>
            Select a Stock
          </option>
          {filteredStocks?.map((stock) => (
            <option key={stock?.symbol} value={stock?.symbol}>
              {stock?.symbol} - {stock?.description}
            </option>
          ))}
        </select>

        <input
          className="stock-form__input"
          type="text"
          placeholder="Value reference in USD"
          onChange={handleChangeReferencePriceValue}
          value={referencePrice}
        />

        <button
          disabled={
            !stockSelected.trim().length && !referencePrice.trim().length
          }
          className="stock-form__button"
          type="submit"
          onClick={handleSubmit}
        >
          Save Stock
        </button>
      </form>
    </div>
  );
};
