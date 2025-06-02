import { createContext, useContext, type JSX } from "react";
import { useWebSocket } from "../hooks";
import { StockContext } from "./StockContext";

interface SocketContext {
  socket?: WebSocket | undefined;
}

// Create a context for the WebScoket connection
export const SocketContext = createContext({} as SocketContext);

// SocketProvider component to provide the WebSocket connection to the application
export const SocketProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  // Use the StockContext to access stocks and the function to update them
  const { stocks, handleSetStock } = useContext(StockContext);
  // Create a WebSocket connection using the custom hook
  const { socket } = useWebSocket(
    "wss://ws.finnhub.io?token=d0p4mh9r01qr8ds1gd7gd0p4mh9r01qr8ds1gd80",
    stocks,
    handleSetStock
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
