/**
 * Haversine formula to compute geodesic distance between two lat/lng coordinates in km.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * EthnoGuessr scoring algorithm: Max 5000 points.
 * Exponential decay based on distance in km.
 */
export function calculateScore(distanceKm) {
  if (distanceKm <= 3) return 5000;
  // Decay constant: 150km yields ~1839 pts, 300km yields ~676 pts
  const score = Math.round(5000 * Math.exp(-distanceKm / 180));
  return Math.max(0, Math.min(5000, score));
}

/**
 * Returns feedback text & color badge based on score.
 */
export function getScoreGrade(score) {
  if (score >= 4800) return { title: "Tam İsabet! (Körfez Hassasiyeti)", color: "#10b981", badge: "🏆 Mükemmel" };
  if (score >= 4000) return { title: "Harika Tahmin!", color: "#3b82f6", badge: "🌟 Çok Yakın" };
  if (score >= 2500) return { title: "İyi Tahmin (Aynı Bölge)", color: "#f59e0b", badge: "👍 Yaklaştın" };
  if (score >= 1000) return { title: "Komşu Coğrafya", color: "#8b5cf6", badge: "📍 Orta" };
  return { title: "Uzak Kaldın", color: "#ef4444", badge: "🧭 Başka Bölge" };
}
