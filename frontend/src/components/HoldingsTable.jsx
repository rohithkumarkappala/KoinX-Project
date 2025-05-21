import { useState } from 'react';

const HoldingsTable = ({ holdings, selectedHoldings, setSelectedHoldings }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedHoldings = showAll ? holdings : holdings.slice(0, 3);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedHoldings(holdings.map(holding => holding._id));
    } else {
      setSelectedHoldings([]);
    }
  };

  const handleSelectHolding = (id) => {
    if (selectedHoldings.includes(id)) {
      setSelectedHoldings(selectedHoldings.filter(hid => hid !== id));
    } else {
      setSelectedHoldings([...selectedHoldings, id]);
    }
  };

  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Holdings</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedHoldings.length === holdings.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3">Asset</th>
              <th className="p-3">Current Market Rate</th>
              <th className="p-3">Total Current Value</th>
              <th className="p-3">Short-term</th>
              <th className="p-3">Long-term</th>
              <th className="p-3">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {displayedHoldings.map(holding => {
              const totalValue = holding.currentPrice * holding.totalHolding;
              return (
                <tr key={holding._id} className="border-t">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedHoldings.includes(holding._id)}
                      onChange={() => handleSelectHolding(holding._id)}
                    />
                  </td>
                  <td className="p-3 flex items-center">
                    <img src={holding.logo} alt={holding.coin} className="w-6 h-6 mr-2" />
                    {holding.coin}
                    <span className="ml-2 text-gray-500">{holding.coin}</span>
                  </td>
                  <td className="p-3">{holding.totalHolding.toFixed(6)} {holding.coin}</td>
                  <td className="p-3">{formatCurrency(totalValue)}</td>
                  <td className={`p-3 ${holding.stcg.gain < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(holding.stcg.gain)}
                  </td>
                  <td className={`p-3 ${holding.ltcg.gain < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(holding.ltcg.gain)}
                  </td>
                  <td className="p-3">-</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {holdings.length > 3 && (
        <button
          className="mt-4 text-blue-600 underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'View Less' : 'View All'}
        </button>
      )}
    </div>
  );
};

export default HoldingsTable;