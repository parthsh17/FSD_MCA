document.getElementById('menuBtn').onclick = () => {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
};

const apiKey = "d1ov281r01qi9vk1lh10d1ov281r01qi9vk1lh1g"; 
const stockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

async function fetchStock(symbol) {
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    const data = await res.json();
    console.log(`Response for ${symbol}:`, data);
    return data;
  } catch (error) {
    console.error("Error fetching data for", symbol, error);
    return null;
  }
}

async function displayStocks() {
  const container = document.getElementById("stocks");
  container.innerHTML = "<p>Loading stock data...</p>";

  let html = "";

  for (const symbol of stockSymbols) {
    const quote = await fetchStock(symbol);

    if (!quote || !quote.c) {
      html += `
        <div class="bg-red-700 p-4 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold">${symbol}</h3>
          <p class="text-red-300">No data available.</p>
        </div>
      `;
    } else {
      html += `
        <div class="bg-gray-700 p-4 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold">${symbol}</h3>
          <p>Price: $${quote.c.toFixed(2)}</p>
          <p>Change: ${quote.d.toFixed(2)} (${quote.dp.toFixed(2)}%)</p>
        </div>
      `;
    }
  }

  container.innerHTML = html;
}

displayStocks();
