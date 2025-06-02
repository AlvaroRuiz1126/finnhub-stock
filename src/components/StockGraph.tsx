import { useContext, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StockContext } from "../context";

// This component renders a Bar Chart to display stock prices
export const StockGraph = () => {
  // Use the StockContext to access the stocks data
  const { stocks } = useContext(StockContext);

  // Memorize the data to aovid unnesessary re-renders
  const data = useMemo(() => {
    return stocks.map((stock) => ({
      name: stock.symbol,
      value: stock.c,
    }));
  }, [stocks]);

  // If there are no stocks, display a message indicating no data is available
  if (!data.length)
    return <div className="stock-graph__empty">No data available to graph</div>;

  // Render the Bar Chart with the stock dats
  return (
    <div className="stock-graph__container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "USD", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
