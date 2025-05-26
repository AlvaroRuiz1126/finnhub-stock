import "./styles/App.css";
import { StockCard, StockForm, StockGraph } from "./components";
import { StockProvider } from "./context";

function App() {
  return (
    <StockProvider>
      <div className="container">
        <div className="stock-header">
          <StockCard />
        </div>
        <div className="stock-content">
          <StockForm />
          <StockGraph />
        </div>
      </div>
    </StockProvider>
  );
}

export default App;
