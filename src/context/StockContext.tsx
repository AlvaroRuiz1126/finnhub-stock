import { createContext, useState, type JSX } from "react";
interface StockContext {
  stocks: any[];
  handleSetStock: (traceStock: any) => void;
}

// Create a context for managing stock data
export const StockContext = createContext({} as StockContext);

// StockProvider component to provide stock data to the application
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
