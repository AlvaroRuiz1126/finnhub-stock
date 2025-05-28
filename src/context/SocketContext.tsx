import { createContext, useContext, type JSX } from "react";
import { useWebSocket } from "../hooks";
import { StockContext } from "./StockContext";

interface SocketContext {
  socket?: WebSocket | undefined;
}

export const SocketContext = createContext({} as SocketContext);

export const SocketProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  const { stocks, handleSetStock } = useContext(StockContext);
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
