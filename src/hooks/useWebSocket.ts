import { useCallback, useEffect, useState } from "react";

let lastStockPrice = 0;

export const useWebSocket = (wssPath: string, stocks: any[], handleUpdateStocks: (traceStock: any) => void) => {
  const [socket, setSocket] = useState<WebSocket>();

  const createSocketConnection = useCallback(() => {
    const connection = new WebSocket(wssPath);

    connection.onopen = () => {
      console.log("WebSocket connected");
    };

    connection.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    connection.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(connection);
  }, [wssPath]);

  useEffect(() => {
    createSocketConnection();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [wssPath]);

  useEffect(() => {
    if(socket) {
      socket.onmessage = (event) => {
        console.log("Message from websocket data", JSON.parse(event.data));
        const message = JSON.parse(event.data);

        if (message.type === "trade") {
          console.log("trade event received");
          const percentageChange = ((message.data[0].p - lastStockPrice) / lastStockPrice) * 100;

          const newStocks = stocks.map((stock) => {
            if (stock.symbol === message.data[0].s) {
              return {
                ...stock,
                c: message.data[0].p,
                percentageChange: percentageChange.toFixed(2),
              }
            }

            return stock;
          })

          handleUpdateStocks(newStocks);

          lastStockPrice = message.data[0].p;
        }
      };
    }
  }, [stocks])

  return { socket };
};
