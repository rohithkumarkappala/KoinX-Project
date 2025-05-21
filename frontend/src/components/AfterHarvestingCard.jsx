const AfterHarvestingCard = ({ capitalGains, savings }) => {
  if (!capitalGains) return null;

  const stcgNet = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const ltcgNet = capitalGains.ltcg.profits - capitalGains.ltcg.losses;
  const effectiveGains = stcgNet + ltcgNet;

  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">After Harvesting</h2>
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
      <p className="mt-4 font-semibold">Effective Capital Gains: {formatCurrency(effectiveGains)}</p>
      {savings > 0 && (
        <p className="mt-2 text-yellow-300 flex items-center">
          <span className="mr-2">💡</span> You're going to save {formatCurrency(savings)}
        </p>
      )}
    </div>
  );
};

export default AfterHarvestingCard;