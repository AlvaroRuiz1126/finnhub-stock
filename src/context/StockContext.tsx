import { createContext, useState, type JSX } from "react";

interface StockContext {
  stock: string;
  stockInfo: any;
  handleSetStock: (traceStock: string) => void;
  handleStockInfo: (stockPrices: any) => void;
}

export const StockContext = createContext({} as StockContext);

export const StockProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  const [stock, setStock] = useState("");
  const [stockInfo, setStockInfo] = useState({});

  const handleSetStock = (traceStock: string) => {
    setStock(traceStock);
  };

  const handleStockInfo = (stockPrices: any) => {
    setStockInfo(stockPrices)
  }

  return (
    <StockContext.Provider value={{ stock, stockInfo, handleSetStock, handleStockInfo }}>
      {children}
    </StockContext.Provider>
  );
};
