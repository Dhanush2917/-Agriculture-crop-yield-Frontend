// 🌾 Crop Yield Estimator — Frontend Logic
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('agriForm');
  const resultBox = document.getElementById('resultBox');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // === 1️⃣ Collect Input Values ===
    const region = document.getElementById('region').value.trim();
    const soil = document.getElementById('soil_type').value.trim();
    const crop = document.getElementById('crop').value.trim();
    const rainfall = parseFloat(document.getElementById('rainfall').value);
    const temp = parseFloat(document.getElementById('temperature').value);
    const fertilizer = document.getElementById('fertilizer').value === 'true';
    const irrigation = document.getElementById('irrigation').value === 'true';
    const weather = document.getElementById('weather').value.trim();
    const days = parseFloat(document.getElementById('days_to_harvest').value);

    // === 2️⃣ Input Validation ===
    if (!region || !soil || !crop || !weather || isNaN(rainfall) || isNaN(temp) || isNaN(days)) {
      show("⚠️ Please fill all fields correctly.", "error");
      return;
    }

    // === 3️⃣ Base Scores (same as ML logic) ===
    const SOIL = { Loam: 1, Clay: 1, Silt: 0.5, Peaty: 1, Chalky: 0.2, Sandy: 0.4 };
    const CROP = { Rice: 2, Wheat: 1.5, Maize: 2, Barley: 1.5, Soybean: 1.2, Cotton: 1.3 };
    const WEATHER = { Sunny: 0.5, Rainy: 1.5, Cloudy: 2 };
    const REGION = { North: 1, East: 1, South: 2, West: 1.3 };

    // === 4️⃣ Continuous Scores ===
    // Rainfall: Ideal 800–1200 mm
    let rainfallScore;
    if (rainfall < 200) rainfallScore = 0.1;
    else if (rainfall < 500) rainfallScore = 1.5;
    else if (rainfall >= 800) rainfallScore = 3.5;
    else if (rainfall > 900) rainfallScore = 2;
    else rainfallScore = 2.5;

    // Temperature: Ideal 25°C
    const tempDiff = Math.abs(temp - 25);
    let tempScore = 3 - tempDiff * 0.1;
    if (tempScore < 0) tempScore = 0;

    // Days to harvest: Ideal ~90
    const dayDiff = Math.abs(days - 90);
    let daysScore = 2 - dayDiff * 0.02;
    if (daysScore < 0) daysScore = 0;

    // === 5️⃣ Management Scores ===
    const fertilizerScore = fertilizer ? 2.5: 0.1;
    const irrigationScore = irrigation ? 2 : 0.2;

    // === 6️⃣ Combine All Scores ===
    let total =
      (SOIL[soil] || 0) +
      (CROP[crop] || 0) +
      (WEATHER[weather] || 0) +
      (REGION[region] || 0) +
      rainfallScore +
      tempScore +
      daysScore +
      fertilizerScore +
      irrigationScore;

    // === 7️⃣ Final Yield Calculation ===
    let yieldTons = (total / 2.2).toFixed(2);
    if (yieldTons > 10) yieldTons = 10;
    if (yieldTons < 0.5) yieldTons = 0.5;

    // === 8️⃣ Display Result with Animation ===
    show(`🌾 Estimated Crop Yield: ${yieldTons} tons/ha`, "success");
  });

  // === Function: Display Message ===
  function show(message, type = "info") {
    resultBox.textContent = message;
    resultBox.style.transition = "all 0.4s ease";
    resultBox.style.padding = "10px";
    resultBox.style.marginTop = "10px";
    resultBox.style.borderRadius = "10px";
    resultBox.style.fontWeight = "bold";
    resultBox.style.fontSize = "18px";
    resultBox.style.textAlign = "center";

    if (type === "error") {
      resultBox.style.backgroundColor = "#ffcccc";
      resultBox.style.color = "#b71c1c";
    } else if (type === "success") {
      resultBox.style.backgroundColor = "#e8f5e9";
      resultBox.style.color = "#2e7d32";
    } else {
      resultBox.style.backgroundColor = "#fff3cd";
      resultBox.style.color = "#856404";
    }

    // subtle animation
    resultBox.style.transform = "scale(1.1)";
    setTimeout(() => (resultBox.style.transform = "scale(1)"), 200);
  }
});
