// Astronomy helpers — observer at Boston, computations in plain JS.
// Algorithms from Meeus, "Astronomical Algorithms" (2nd ed.), simplified.

export const BOSTON_LAT = 42.3601;
export const BOSTON_LON = -71.0589;

const DEG = Math.PI / 180;

// Julian Date from a JS Date (UTC).
export function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

// Greenwich Mean Sidereal Time in degrees (Meeus 12.4).
function gmstDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  gmst = ((gmst % 360) + 360) % 360;
  return gmst;
}

// Local Sidereal Time at longitude lon (deg, east positive), in degrees.
export function lstDeg(date: Date, lonDeg: number): number {
  return (gmstDeg(julianDate(date)) + lonDeg + 360) % 360;
}

// RA (hours) + Dec (deg) -> { alt, az } in degrees for observer at (lat, lon).
// az measured clockwise from north (0 = N, 90 = E, 180 = S, 270 = W).
export function raDecToAltAz(
  raHours: number,
  decDeg: number,
  date: Date,
  latDeg: number,
  lonDeg: number,
): { alt: number; az: number } {
  const ctx = altAzContext(date, latDeg, lonDeg);
  return altAzWith(ctx, raHours, decDeg);
}

// Precompute LST + lat trig once when batch-projecting many stars in a single frame.
export type AltAzContext = {
  lstDeg: number;
  sinLat: number;
  cosLat: number;
};

export function altAzContext(date: Date, latDeg: number, lonDeg: number): AltAzContext {
  return {
    lstDeg: lstDeg(date, lonDeg),
    sinLat: Math.sin(latDeg * DEG),
    cosLat: Math.cos(latDeg * DEG),
  };
}

export function altAzWith(
  ctx: AltAzContext,
  raHours: number,
  decDeg: number,
): { alt: number; az: number } {
  const haDeg = (((ctx.lstDeg - raHours * 15) % 360) + 540) % 360 - 180;
  const ha = haDeg * DEG;
  const dec = decDeg * DEG;
  const sinDec = Math.sin(dec);
  const cosDec = Math.cos(dec);
  const cosHa = Math.cos(ha);
  const sinAlt = sinDec * ctx.sinLat + cosDec * ctx.cosLat * cosHa;
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAz = (sinDec - Math.sin(alt) * ctx.sinLat) / (Math.cos(alt) * ctx.cosLat);
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
  if (Math.sin(ha) > 0) az = 2 * Math.PI - az;
  return { alt: alt / DEG, az: az / DEG };
}

// Moon phase. Returns:
//   age      — days since last new moon (0..29.53)
//   fraction — illuminated fraction (0..1)
//   glyph    — one of 🌑🌒🌓🌔🌕🌖🌗🌘 (Unicode moon)
//   name     — human-readable phase
// Conway-style approximation; accurate within a few hours, perfect for a UI glyph.
const SYNODIC_MONTH = 29.530588853;
const KNOWN_NEW_MOON_JD = 2451550.1; // 2000-01-06 18:14 UTC

export type MoonPhase = {
  age: number;
  fraction: number;
  glyph: string;
  name: string;
};

export function moonPhase(date: Date = new Date()): MoonPhase {
  const jd = julianDate(date);
  let age = ((jd - KNOWN_NEW_MOON_JD) % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phaseAngle = (age / SYNODIC_MONTH) * 2 * Math.PI;
  const fraction = (1 - Math.cos(phaseAngle)) / 2;

  // 8 buckets across the cycle.
  const bucket = Math.floor(((age / SYNODIC_MONTH) * 8 + 0.5)) % 8;
  const glyphs = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  const names = [
    "new moon",
    "waxing crescent",
    "first quarter",
    "waxing gibbous",
    "full moon",
    "waning gibbous",
    "last quarter",
    "waning crescent",
  ];

  return { age, fraction, glyph: glyphs[bucket], name: names[bucket] };
}
