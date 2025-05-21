const PreHarvestingCard = ({ capitalGains }) => {
  if (!capitalGains) return null;

  const stcgNet = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const ltcgNet = capitalGains.ltcg.profits - capitalGains.ltcg.losses;
  const realizedGains = stcgNet + ltcgNet;

  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Pre Harvesting</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium">Short-term</h3>
          <p>Profits: {formatCurrency(capitalGains.stcg.profits)}</p>
          <p>Losses: -{formatCurrency(capitalGains.stcg.losses)}</p>
          <p>Net Capital Gains: {formatCurrency(stcgNet)}</p>
        </div>
        <div>
          <h3 className="font-medium">Long-term</h3>
          <p>Profits: {formatCurrency(capitalGains.ltcg.profits)}</p>
          <p>Losses: -{formatCurrency(capitalGains.ltcg.losses)}</p>
          <p>Net Capital Gains: {formatCurrency(ltcgNet)}</p>
        </div>
      </div>
      <p className="mt-4 font-semibold">Realised Capital Gains: {formatCurrency(realizedGains)}</p>
    </div>
  );
};

export default PreHarvestingCard;