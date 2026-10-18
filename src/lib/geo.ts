import type { City } from "./cities";

export interface GeoData {
  regionCode: string; // e.g. "IN-MH"
  stateName: string;
  cityName: string;
  latitude: number;
  longitude: number;
  countryCode: string; // "IN"
  countryName: string; // "India"
}

// ISO 3166-2:IN state codes and geographic centroid coordinates
const STATE_GEO_MAP: Record<string, { code: string; lat: number; lng: number }> = {
  "Andaman & Nicobar Islands": { code: "IN-AN", lat: 11.6234, lng: 92.7265 },
  "Andhra Pradesh": { code: "IN-AP", lat: 15.9129, lng: 79.74 },
  "Arunachal Pradesh": { code: "IN-AR", lat: 28.218, lng: 94.7278 },
  "Assam": { code: "IN-AS", lat: 26.2006, lng: 92.9376 },
  "Bihar": { code: "IN-BR", lat: 25.0961, lng: 85.3131 },
  "Chandigarh": { code: "IN-CH", lat: 30.7333, lng: 76.7794 },
  "Chhattisgarh": { code: "IN-CG", lat: 21.2787, lng: 81.8661 },
  "Dadra and Nagar Haveli and Daman and Diu": { code: "IN-DH", lat: 20.4283, lng: 72.8397 },
  "Delhi": { code: "IN-DL", lat: 28.7041, lng: 77.1025 },
  "Goa": { code: "IN-GA", lat: 15.2993, lng: 74.124 },
  "Gujarat": { code: "IN-GJ", lat: 22.2587, lng: 71.1924 },
  "Haryana": { code: "IN-HR", lat: 29.0588, lng: 76.0856 },
  "Himachal Pradesh": { code: "IN-HP", lat: 31.1048, lng: 77.1734 },
  "Jammu & Kashmir": { code: "IN-JK", lat: 33.7782, lng: 76.5762 },
  "Jharkhand": { code: "IN-JH", lat: 23.6102, lng: 85.2799 },
  "Karnataka": { code: "IN-KA", lat: 15.3173, lng: 75.7139 },
  "Kerala": { code: "IN-KL", lat: 10.8505, lng: 76.2711 },
  "Ladakh": { code: "IN-LA", lat: 34.1526, lng: 77.5771 },
  "Lakshadweep": { code: "IN-LD", lat: 10.5667, lng: 72.6417 },
  "Madhya Pradesh": { code: "IN-MP", lat: 22.9734, lng: 78.6569 },
  "Maharashtra": { code: "IN-MH", lat: 19.7515, lng: 75.7139 },
  "Manipur": { code: "IN-MN", lat: 24.6637, lng: 93.9063 },
  "Meghalaya": { code: "IN-ML", lat: 25.467, lng: 91.3662 },
  "Mizoram": { code: "IN-MZ", lat: 23.1645, lng: 92.9376 },
  "Nagaland": { code: "IN-NL", lat: 26.1584, lng: 94.5624 },
  "Odisha": { code: "IN-OR", lat: 20.9517, lng: 85.0985 },
  "Puducherry": { code: "IN-PY", lat: 11.9416, lng: 79.8083 },
  "Punjab": { code: "IN-PB", lat: 31.1471, lng: 75.3412 },
  "Rajasthan": { code: "IN-RJ", lat: 27.0238, lng: 74.2179 },
  "Sikkim": { code: "IN-SK", lat: 27.533, lng: 88.5122 },
  "Tamil Nadu": { code: "IN-TN", lat: 11.1271, lng: 78.6569 },
  "Telangana": { code: "IN-TG", lat: 18.1124, lng: 79.0193 },
  "Tripura": { code: "IN-TR", lat: 23.9408, lng: 91.9882 },
  "Uttar Pradesh": { code: "IN-UP", lat: 26.8467, lng: 80.9462 },
  "Uttarakhand": { code: "IN-UK", lat: 30.0668, lng: 79.0193 },
  "West Bengal": { code: "IN-WB", lat: 22.9868, lng: 87.855 },
};

// Major Metro precise coordinates
const MAJOR_CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  pune: { lat: 18.5204, lng: 73.8567 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  surat: { lat: 21.1702, lng: 72.8311 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  indore: { lat: 22.7196, lng: 75.8577 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  patna: { lat: 25.5941, lng: 85.1376 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
};

export function getCityGeoData(city: City): GeoData {
  const stateInfo = STATE_GEO_MAP[city.state] || { code: "IN", lat: 20.5937, lng: 78.9629 };
  const cityCoords = MAJOR_CITY_COORDS[city.slug.toLowerCase()];

  return {
    regionCode: stateInfo.code,
    stateName: city.state,
    cityName: city.name,
    latitude: cityCoords?.lat ?? stateInfo.lat,
    longitude: cityCoords?.lng ?? stateInfo.lng,
    countryCode: "IN",
    countryName: "India",
  };
}
