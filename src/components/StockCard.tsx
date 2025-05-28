import { useContext } from "react";
import { StockContext } from "../context";

export const StockCard = () => {
  const { stocks } = useContext(StockContext);

  if (!stocks || !stocks.length)
    return (
      <div className="stock-card" style={{ textAlign: "center" }}>
        NO STOCK SELECTED
      </div>
    );

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
            <span>{stock?.c ?? 0}</span>
            <span>{`${stock?.percentageChange ?? stock?.dp ?? 0}%`}</span>
          </div>
        </div>
      ))}
    </>
  );
};
