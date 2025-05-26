import { useCallback, useEffect, useState } from "react";

export const useWebSocket = (wssPath: string) => {
  const [socket, setSocket] = useState<WebSocket>();

  const createSocketConnection = useCallback(() => {
    const connection = new WebSocket(wssPath);

    connection.onopen = () => {
      console.log("WebSocket connected");
      //   connection.send(JSON.stringify({ type: "subscribe", symbol: "AAPL" }));
      connection.send(
        JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })
      );
      //   connection.send(
      //     JSON.stringify({ type: "subscribe", symbol: "IC MARKETS:1" })
      //   );
    };

    connection.onmessage = (event) => {
      console.log("Message from websocket", event);
    };

    connection.onerror = (error) => {
      console.error("WebSocket error: ", error);
      //   connection.close();
    };

    connection.onclose = () => {
      console.log("WebSocket connection closed");
      //   createSocketConnection();
    };

    setSocket(connection);
  }, [wssPath]);

  useEffect(() => {
    createSocketConnection();

    return () => {
      if (socket) {
        socket.send(
          JSON.stringify({ type: "unsubscribe", symbol: "BINANCE:BTCUSDT" })
        );
        socket.close();
      }
    };
  }, [wssPath]);

  console.log("socket", socket);

  return { socket };
};
