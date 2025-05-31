import { useCallback, useEffect, useState } from "react";

let lastStockPrice = 0;

export const useWebSocket = (
  wssPath: string,
  stocks: any[],
  handleUpdateStocks: (traceStock: any) => void
) => {
  const [socket, setSocket] = useState<WebSocket>();

  const createSocketConnection = useCallback(() => {
    const connection = new WebSocket(wssPath);

    connection.onopen = () => {
      console.log("WebSocket connected");
      const subscribedStocks = JSON.parse(
        localStorage.getItem("subscribedStocks") || "[]"
      );

      if (subscribedStocks.length)
        subscribedStocks.forEach((stock: string) => {
          connection.send(JSON.stringify({ type: "subscribe", symbol: stock }));
        });
    };

    connection.onmessage = (event) => {
      console.log("Message from websocket data", JSON.parse(event.data));
      const message = JSON.parse(event.data);

      if (message.type === "trade") {
        console.log("trade event received");
        const percentageChange =
          ((message.data[0].p - lastStockPrice) / lastStockPrice) * 100;

        const newStocks = stocks.map((stock) => {
          if (stock.symbol === message.data[0].s) {
            return {
              ...stock,
              c: message.data[0].p,
              percentageChange: percentageChange.toFixed(2),
            };
          }

          return stock;
        });

        handleUpdateStocks(newStocks);

        lastStockPrice = message.data[0].p;
      }
    };

    connection.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    connection.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(connection);
  }, [wssPath, handleUpdateStocks]);

  useEffect(() => {
    createSocketConnection();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("The document is hidden, close socket connection");
        socket?.close();
        setSocket(undefined);
      } else {
        console.log("The documento is visible, reconnect socket");
        createSocketConnection();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (socket) {
        socket.close();
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [wssPath]);

  // useEffect(() => {
  //   if (socket) {

  //   }
  // }, [stocks]);

  return { socket };
};
