import { useStockForm } from "../hooks";

export const StockForm = () => {
  const {
    filteredStocks,
    openDropdown,
    referencePrice,
    searchStock,
    stockSelected,
    handleChangeReferencePriceValue,
    handleOpenDropdown,
    handleSearchStock,
    handleSelectStock,
    handleSubmit,
  } = useStockForm();

  return (
    <div className="stock-form__container">
      <form className="sotck-form" onSubmit={handleSubmit}>
        <div
          className="stock-form__select-container"
          onClick={handleOpenDropdown}
        >
          <input
            type="text"
            placeholder="Search a Stock"
            onChange={handleSearchStock}
            value={searchStock}
          />
          <span className="stock-form__select-icon">&#9662;</span>
          {openDropdown && (
            <ul className="stock-form__select-list">
              {filteredStocks.map((stock) => (
                <li
                  className="stock-form__select-item"
                  key={stock?.symbol}
                  onClick={() => {
                    handleSelectStock(stock);
                    handleOpenDropdown();
                  }}
                >
                  {stock?.symbol} - {stock?.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          className="stock-form__input"
          type="text"
          placeholder="Value reference in USD"
          onChange={handleChangeReferencePriceValue}
          value={referencePrice}
        />

        <button
          disabled={
            !stockSelected.trim().length || !referencePrice.trim().length
          }
          className="stock-form__button"
          type="submit"
          onClick={handleSubmit}
        >
          Save Stock
        </button>
      </form>
    </div>
  );
};
