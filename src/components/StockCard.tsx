import { useContext } from "react";
import { StockContext } from "../context";

// This component displays a card for each stock with its symbol, current price, and margin change
export const StockCard = () => {
  const { stocks } = useContext(StockContext);

  // If there are no stocks, display a message indicating no stock is selected
  if (!stocks || !stocks.length)
    return (
      <div className="stock-card" style={{ textAlign: "center" }}>
        NO STOCK SELECTED
      </div>
    );

  // Render a card for each stock with its symbol, current price, and margin change
  return (
    <>
      {stocks.map((stock) => (
        <div key={stock?.symbol} className="stock-card">
          <div className="stock-card__header">
            <span>{stock.symbol ?? "NO STOCK"}</span>
          </div>
          <div
            className={`stock-card__content ${
              stock?.c > stock?.referencePrice
                ? "stock-card__content--positive"
                : "stock-card__content--negative"
            }`}
          >
            <span>{stock?.c ?? 0} USD</span>
            <span>Margin Change: {`${stock?.percentageChange ?? stock?.dp ?? 0}%`}</span>
          </div>
        </div>
      ))}
    </>
  );
};
