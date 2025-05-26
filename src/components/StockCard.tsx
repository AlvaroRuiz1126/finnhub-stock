import { useContext } from "react";
import { StockContext } from "../context";

export const StockCard = () => {
  const { stock, stockInfo } = useContext(StockContext);
  // console.log('stockInfo', stockInfo)

  return (
    <div className="stock-card">
      <div className="stock-card__header">
        <span>{stock ?? 'NO STOCK'}</span>
        <span>{stockInfo?.c ?? 0}</span>
      </div>
      <div className="stock-card__content">
        <span>arrow</span>
        <span>{`${stockInfo?.dp ?? 0}%`}</span>
      </div>
    </div>
  );
};
