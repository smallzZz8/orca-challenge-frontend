export interface Vessel {
  mmsi: number;
  name?: string;
  lat: number;
  lon: number;
  cog?: number; // Course Over Ground
  sog?: number; // Speed Over Ground
  heading?: number; // True Heading
  course?: number; // Course
  speed?: number; // Speed
  status?: number; // Navigational Status
  updatedAt: string; // ISO timestamp
}
