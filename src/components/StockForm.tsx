import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { StockContext } from "../context";
import { getPeers, getStockPrice } from "../api";
import { useWebSocket } from "../hooks";

export interface StockResponse {
  currency?: string;
  description?: string;
  displaySymbol?: string;
  figi?: string;
  isin?: null;
  mic?: string;
  shareClassFIGI?: string;
  symbol?: string;
  symbol2?: string;
  type?: string;
}

export const StockForm = () => {
  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const { handleSetStock, handleStockInfo } = useContext(StockContext);
  const { socket } = useWebSocket(
    "wss://ws.finnhub.io?token=d0p4mh9r01qr8ds1gd7gd0p4mh9r01qr8ds1gd80"
  );

  const handleSelectStock = async (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    handleSetStock(e.target.value);

    const stockInfo = await getStockPrice(e.target.value);
    handleStockInfo(stockInfo);
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
  };

  useEffect(() => {
    (async () => {
      const response = await getPeers();

      setStocks(response);
    })();
  }, []);

  return (
    <div className="stock-form__container">
      <form className="sotck-form" onSubmit={handleSubmit}>
        <select className="stock-form__select" onChange={handleSelectStock}>
          {stocks.map((stock) => (
            <option key={stock.symbol} value={stock.symbol}>
              {stock.symbol}
            </option>
          ))}
        </select>
        <input
          className="stock-form__input"
          type="text"
          placeholder="Value reference"
        />

        <button
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
