import NodeGeocoder from "node-geocoder";
import fetch from "node-fetch";
import { BadRequestError } from "../errors/customErrors.js";

const options = {
  provider: "openstreetmap",
};

const geocoder = NodeGeocoder(options);

export async function geoCodeAddress(address) {
  const res = await geocoder.geocode(address);

  if (!res.length) throw new BadRequestError("Unable to geocode address");

  const r = res[0];
  return {
    lat: r.latitude,
    lng: r.longitude,
    formattedAddress: r.formattedAddress || address,
    city: r.city || r.administrativeLevels?.level2long || r.state || "",
    country: r.country || "",
  };
}

export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "events-app/1.0" },
  });

  if (!res.ok) throw new Error("Failed to fetch city");
  const data = await res.json();

  // City can be under different keys depending on country
  return (
    data.address.city ||
    data.address.town ||
    data.address.village ||
    data.address.county ||
    null
  );
}
