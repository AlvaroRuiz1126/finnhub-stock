import { createContext, useState, type JSX } from "react";
interface StockContext {
  stocks: any[];
  handleSetStock: (traceStock: any) => void;
}

export const StockContext = createContext({} as StockContext);

export const StockProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  const [stocks, setStocks] = useState<any[]>([]);

  const handleSetStock = (traceStock: any) => {
    setStocks([...stocks, traceStock]);
  };

  return (
    <StockContext.Provider
      value={{
        stocks,
        handleSetStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};
