import { StockCard, StockForm, StockGraph } from "./components";
import { SocketProvider, StockProvider } from "./context";
import "./styles/App.css";

function App() {
  return (
    <StockProvider>
      <SocketProvider>
        <div className="container">
          <div className="stock-header">
            <StockCard />
          </div>
          <div className="stock-content">
            <StockForm />
            <StockGraph />
          </div>
        </div>
      </SocketProvider>
    </StockProvider>
  );
}

export default App;
