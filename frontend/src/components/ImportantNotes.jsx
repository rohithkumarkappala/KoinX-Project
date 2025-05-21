const ImportantNotes = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6 border border-gray-300">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <span className="mr-2">ℹ️</span> Important Notes & Disclosures
      </h3>
      <ul className="list-disc list-inside text-gray-600">
        <li>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
        <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
        <li>Price and market value data is fetched from CoinGecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
        <li>Some countries do not have a short-term/long-term bifurcation. For now, we are calculating everything as long-term.</li>
        <li>Only unrealized losses are shown in short-term/long-term bifurcation. Unreleased losses in held assets are not calculated here.</li>
      </ul>
    </div>
  );
};

export default ImportantNotes;