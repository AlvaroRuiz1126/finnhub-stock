import { useCallback, useEffect, useState } from "react";

let lastStockPrice = 0;

// This hook manages the WebSocket connection to receive real-time stock updates
export const useWebSocket = (
  wssPath: string,
  stocks: any[],
  handleUpdateStocks: (traceStock: any) => void
) => {
  const [socket, setSocket] = useState<WebSocket>();

  // Function to create a new WebSocket connection
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

      // Check if the message type is 'trade' and handle the stock price update
      if (message.type === "trade") {
        console.log("trade event received");
        // Calculate the percentage change from the last stock price
        const percentageChange =
          ((message.data[0].p - lastStockPrice) / lastStockPrice) * 100;

        // Update the stock data with the new price and percentage change
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

        // Call the provided function to update the stocks in the context
        handleUpdateStocks(newStocks);

        // Update the last stock price for future calculations
        lastStockPrice = message.data[0].p;
      }
    };

    connection.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    connection.onclose = () => {
      console.log("WebSocket connection closed");
      localStorage.removeItem("subscribedStocks");
    };

    setSocket(connection);
  }, [wssPath, handleUpdateStocks]);

  useEffect(() => {
    // Create the WebSocket connection when the component mounts
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

    // Add event listener for visibility change to manage WebSocket connection
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function to close the WebSocket connection and remove event listener
    return () => {
      if (socket) {
        socket.close();
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [wssPath]);

  return { socket };
};
