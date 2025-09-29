let globalData = [];
let anomalyTrace = null;
let regressionTrace = null;

// All previous functions: loadGraph, analyzeData, showSummary, etc.

window.loadGraph = loadGraph;
window.analyzeData = analyzeData;
window.showSummary = showSummary;
window.toggleAnomalies = toggleAnomalies;
window.downloadCSV = downloadCSV;
window.onload = loadGraph;



async function loadGraph() {
    const res = await fetch('/graph-data');
    const data = await res.json();
    globalData = data;

    const timestamps = data.map(d => d.timestamp);
    const temps = data.map(d => d.temperature);
    const humidity = data.map(d => d.humidity);
    const soil = data.map(d => d.soil_moisture);

    const traces = [
      { x: timestamps, y: temps, name: "Temp (°C)", type: 'scatter' },
      { x: timestamps, y: humidity, name: "Humidity (%)", type: 'scatter' },
      { x: timestamps, y: soil, name: "Soil Moisture", type: 'scatter' }
    ];

    Plotly.newPlot('chart', traces, {
      title: "Sensor Data Over Time",
      xaxis: { title: "Timestamp" },
      yaxis: { title: "Sensor Values" }
    });
  }

  async function analyzeData() {
    if (globalData.length === 0) return;

    const temps = globalData.map(d => d.temperature);
    const timestamps = globalData.map((d, i) => i); // index as x-value for regression

    const result = regression.linear(timestamps.map((x, i) => [x, temps[i]]));
    const regressionY = result.points.map(p => p[1]);

    regressionTrace = {
      x: globalData.map(d => d.timestamp),
      y: regressionY,
      name: "Trendline",
      line: { color: 'orange', dash: 'dash' },
      type: "scatter"
    };

    Plotly.addTraces('chart', regressionTrace);
  }

  function showSummary() {
    const stats = calculateStats();
    const html = `
      <ul>
        <li><strong>Temp:</strong> avg ${stats.temp.mean.toFixed(2)}°C, min ${stats.temp.min}, max ${stats.temp.max}, σ = ${stats.temp.std.toFixed(2)}</li>
        <li><strong>Humidity:</strong> avg ${stats.hum.mean.toFixed(2)}%, σ = ${stats.hum.std.toFixed(2)}</li>
        <li><strong>Soil Moisture:</strong> avg ${stats.soil.mean.toFixed(2)}, σ = ${stats.soil.std.toFixed(2)}</li>
      </ul>
    `;
    document.getElementById("summary-content").innerHTML = html;
    new bootstrap.Modal(document.getElementById('summaryModal')).show();
  }

  function calculateStats() {
    const temps = globalData.map(d => d.temperature);
    const hums = globalData.map(d => d.humidity);
    const soils = globalData.map(d => d.soil_moisture);

    function calc(arr) {
      const mean = arr.reduce((a,b) => a + b, 0) / arr.length;
      const std = Math.sqrt(arr.reduce((a,b) => a + (b - mean) ** 2, 0) / arr.length);
      return { mean, std, min: Math.min(...arr), max: Math.max(...arr) };
    }

    return {
      temp: calc(temps),
      hum: calc(hums),
      soil: calc(soils)
    };
  }

  function toggleAnomalies() {
    if (!globalData.length) return;
    const show = document.getElementById("toggle-anomalies").checked;
    const stats = calculateStats();
    const lower = stats.temp.mean - 2 * stats.temp.std;
    const upper = stats.temp.mean + 2 * stats.temp.std;

    const anomalyPoints = globalData
      .map((d, i) => ({...d, index: i}))
      .filter(d => d.temperature < lower || d.temperature > upper);

    if (show) {
      anomalyTrace = {
        x: anomalyPoints.map(d => d.timestamp),
        y: anomalyPoints.map(d => d.temperature),
        name: "Anomalies",
        mode: 'markers',
        marker: { color: 'red', size: 10, symbol: "x" },
        type: 'scatter'
      };
      Plotly.addTraces('chart', anomalyTrace);
    } else {
      Plotly.deleteTraces('chart', -1); // assumes it's last trace
    }
  }

  async function downloadCSV() {
    window.location.href = "/data.csv";
  }

  async function fetchLatestData() {
    try {
      const response = await fetch('/latest');
      const data = await response.json();
  
      if (data.error) {
        console.error("Error fetching latest data:", data.error);
        return;
      }
  
      document.getElementById('current-temp').textContent = data.temperature;
      document.getElementById('current-humidity').textContent = data.humidity;
      document.getElementById('current-soil').textContent = data.soil_moisture;
      document.getElementById('current-time').textContent = new Date(data.timestamp).toLocaleString();
    } catch (err) {
      console.error("Failed to fetch latest data:", err);
    }
  }


  async function updateHighsLows() {
    try {
      const localDate = new Date().toLocaleDateString('en-CA');
      const url = `/highs_lows?date=${localDate}`;
      const res = await fetch(url);
  
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  
      const data = await res.json();  // ✅ Needed to read the JSON
  
      document.getElementById('high-temp').textContent = data.high_temp;
      document.getElementById('low-temp').textContent = data.low_temp;
      document.getElementById('high-humidity').textContent = data.high_humidity;
      document.getElementById('low-humidity').textContent = data.low_humidity;
      document.getElementById('high-soil').textContent = data.high_soil;
      document.getElementById('low-soil').textContent = data.low_soil;
    } catch (err) {
      console.error("Failed to load highs and lows:", err);
    }
  }
  function toYMDLocal(dateObj) {
    return dateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD in local tz
  }
  
  function parseYMDLocal(str) {
    // str like "2025-08-06" → local Date at 00:00
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  
  function inRange(tsStr, startDate, endDate) {
    // Compare by local date boundaries (inclusive)
    const dt = new Date(tsStr); // assumes ISO timestamps
    return dt >= startDate && dt <= endDate;
  }
  function drawGraphFromData(data) {
    const timestamps = data.map(d => d.timestamp);
    const temps = data.map(d => d.temperature);
    const humidity = data.map(d => d.humidity);
    const soil = data.map(d => d.soil_moisture);
  
    const traces = [
      { x: timestamps, y: temps, name: "Temp (°F)", type: 'scatter' },
      { x: timestamps, y: humidity, name: "Humidity (%)", type: 'scatter' },
      { x: timestamps, y: soil, name: "Soil Moisture", type: 'scatter' }
    ];
  
    Plotly.newPlot('chart', traces, {
      title: "Sensor Data Over Time",
      xaxis: { title: "Timestamp" },
      yaxis: { title: "Sensor Values" }
    });
  }
  
  function filterAndRedraw(startStr, endStr) {
    if (!globalData.length) return;
  
    const startDate = parseYMDLocal(startStr);
    // End of day (23:59:59) for inclusive filtering
    const endDate = new Date(parseYMDLocal(endStr).getTime());
    endDate.setHours(23, 59, 59, 999);
  
    const filtered = globalData.filter(d => inRange(d.timestamp, startDate, endDate));
    drawGraphFromData(filtered);
  }
  async function updateCardsForRange(startStr, endStr) {
    // Weekly/Range card: use the whole range
    try {
      const res = await fetch(`/weekly_highs_lows?start=${startStr}&end=${endStr}`);
      if (res.ok) {
        const data = await res.json();
        document.getElementById('week-range').textContent = `${data.start} → ${data.end}`;
        document.getElementById('week-count').textContent = data.count ?? 0;
  
        document.getElementById('week-high-temp').textContent = data.high_temp ?? '--';
        document.getElementById('week-low-temp').textContent = data.low_temp ?? '--';
        document.getElementById('week-high-humidity').textContent = data.high_humidity ?? '--';
        document.getElementById('week-low-humidity').textContent = data.low_humidity ?? '--';
        document.getElementById('week-high-soil').textContent = data.high_soil ?? '--';
        document.getElementById('week-low-soil').textContent = data.low_soil ?? '--';
      } else {
        console.warn('No range stats available for', startStr, endStr);
      }
    } catch (e) {
      console.error('Range stats error:', e);
    }
  
    // Daily card: show highs/lows for the END date of the range
    try {
      const resDay = await fetch(`/highs_lows?date=${endStr}`);
      if (resDay.ok) {
        const day = await resDay.json();
        document.getElementById('high-temp').textContent = day.high_temp ?? '--';
        document.getElementById('low-temp').textContent = day.low_temp ?? '--';
        document.getElementById('high-humidity').textContent = day.high_humidity ?? '--';
        document.getElementById('low-humidity').textContent = day.low_humidity ?? '--';
        document.getElementById('high-soil').textContent = day.high_soil ?? '--';
        document.getElementById('low-soil').textContent = day.low_soil ?? '--';
      } else {
        // Clear daily if no data
        ['high-temp','low-temp','high-humidity','low-humidity','high-soil','low-soil']
          .forEach(id => document.getElementById(id).textContent = '--');
      }
    } catch (e) {
      console.error('Daily stats error:', e);
    }
  }
  
    
  
  async function updateWeeklyStats() {
    try {
      const end = new Date();
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
  
      const url = `/weekly_highs_lows?start=${toYMDLocal(start)}&end=${toYMDLocal(end)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  
      const data = await res.json();
      document.getElementById('week-range').textContent = `${data.start} → ${data.end}`;
      document.getElementById('week-count').textContent = data.count ?? 0;
  
      document.getElementById('week-high-temp').textContent = data.high_temp ?? '--';
      document.getElementById('week-low-temp').textContent = data.low_temp ?? '--';
      document.getElementById('week-high-humidity').textContent = data.high_humidity ?? '--';
      document.getElementById('week-low-humidity').textContent = data.low_humidity ?? '--';
      document.getElementById('week-high-soil').textContent = data.high_soil ?? '--';
      document.getElementById('week-low-soil').textContent = data.low_soil ?? '--';
    } catch (e) {
      console.error("Failed to load weekly stats:", e);
    }
  }

  function setDefaultRangeInputs() {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 6); // last 7 days by default
    document.getElementById('range-start').value = toYMDLocal(start);
    document.getElementById('range-end').value = toYMDLocal(end);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // Existing initializers you already have:
    fetchLatestData();
    updateHighsLows();      // daily (today)
    updateWeeklyStats();    // last 7 days
    loadGraph();            // full graph
  
    // Set default inputs on first load
    setDefaultRangeInputs();
  
    // Apply: validate, filter graph, refresh cards for chosen range
    document.getElementById('apply-range').addEventListener('click', () => {
      const startStr = document.getElementById('range-start').value;
      const endStr   = document.getElementById('range-end').value;
  
      if (!startStr || !endStr) {
        alert('Please select both start and end dates.');
        return;
      }
      if (parseYMDLocal(startStr) > parseYMDLocal(endStr)) {
        alert('Start date must be on or before end date.');
        return;
      }
  
      // Redraw graph with filtered data
      filterAndRedraw(startStr, endStr);
  
      // Refresh weekly/range card & daily card (for end date)
      updateCardsForRange(startStr, endStr);
    });
  
    // Clear: reset inputs, redraw full graph, reload default cards
    document.getElementById('clear-range').addEventListener('click', async () => {
      setDefaultRangeInputs();
  
      // Redraw full graph from globalData
      drawGraphFromData(globalData);
  
      // Reload defaults (today for daily, last 7 days for weekly)
      updateHighsLows();
      updateWeeklyStats();
    });
  });
  
  

  document.addEventListener('DOMContentLoaded', () => {
    fetchLatestData();      // current stats
    updateHighsLows();      // daily highs/lows
    updateWeeklyStats();    // weekly highs/lows (the function we added earlier)
    loadGraph();            // plotly chart
  });
  
  
  // Call it on page load
  fetchLatestData();
  updateHighsLows();      // daily highs/lows
  updateWeeklyStats(); 
  loadGraph();