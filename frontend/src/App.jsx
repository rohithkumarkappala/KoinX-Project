import { useState, useEffect } from 'react';
import PreHarvestingCard from '../src/components/PreHarvestingCard';
import AfterHarvestingCard from '../src/components/AfterHarvestingCard';
import HoldingsTable from '../src/components/HoldingsTable';
import { baseUrl } from './utils/constants';

const App = () => {
  const [initialCapitalGains, setInitialCapitalGains] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [selectedHoldings, setSelectedHoldings] = useState([]);
  const [updatedCapitalGains, setUpdatedCapitalGains] = useState(null);
  const [savings, setSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false); // State for toggling notes

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch capital gains
        const gainsRes = await fetch(`${baseUrl}/api/capital-gains`);
        const gainsData = await gainsRes.json();
        setInitialCapitalGains(gainsData.capitalGains);
        setUpdatedCapitalGains(gainsData.capitalGains); // Initially mirror pre-harvesting

        // Fetch holdings
        const holdingsRes = await fetch(`${baseUrl}/api/holdings`);
        const holdingsData = await holdingsRes.json();
        setHoldings(holdingsData);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Update capital gains when selected holdings change
  useEffect(() => {
    const updateCapitalGains = async () => {
      if (selectedHoldings.length === 0) {
        setUpdatedCapitalGains(initialCapitalGains);
        setSavings(0);
        return;
      }

      try {
        const ids = selectedHoldings.join(',');
        const res = await fetch(`${baseUrl}/api/calculate-capital-gains/${ids}`);
        const data = await res.json();
        setUpdatedCapitalGains(data.capitalGains);
        setSavings(data.savings);
      } catch (err) {
        console.error('Error calculating capital gains:', err);
      }
    };
    updateCapitalGains();
  }, [selectedHoldings, initialCapitalGains]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600">KoinX</h1>
        <h2 className="text-xl font-semibold mt-2">
          Tax Harvesting{' '}
          <span className="text-blue-600 underline cursor-pointer">How it works?</span>
        </h2>
      </header>

      {/* Important Notes Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 border border-gray-300">
        <h3
          className="text-lg font-semibold mb-2 flex items-center cursor-pointer"
          onClick={() => setIsNotesExpanded(!isNotesExpanded)}
        >
          <span className="mr-2">ℹ️</span> Important Notes & Disclosures
          <span className="ml-2">{isNotesExpanded ? '▼' : '▶'}</span>
        </h3>
        {isNotesExpanded && (
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Tax-loss harvesting is currently not allowed under Indian tax regulations.
              Please consult your tax advisor before making any decisions.
            </li>
            <li>
              Tax harvesting does not apply to derivatives or futures. These are handled
              separately as business income under tax rules.
            </li>
            <li>
              Price and market value data is fetched from CoinGecko, not from individual
              exchanges. As a result, values may slightly differ from the ones on your
              exchange.
            </li>
            <li>
              Some countries do not have a short-term/long-term bifurcation. For now, we are
              calculating everything as long-term.
            </li>
            <li>
              Only unrealized losses are shown in short-term/long-term bifurcation.
              Unreleased losses in held assets are not calculated here.
            </li>
          </ul>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PreHarvestingCard capitalGains={initialCapitalGains} />
            <AfterHarvestingCard capitalGains={updatedCapitalGains} savings={savings} />
          </div>

          <HoldingsTable
            holdings={holdings}
            selectedHoldings={selectedHoldings}
            setSelectedHoldings={setSelectedHoldings}
          />
        </>
      )}
    </div>
  );
};

export default App;