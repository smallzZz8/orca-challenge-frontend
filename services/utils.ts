export const pxGetNextPageParam = (
  pageParam: { size: number; page: number; filters?: any },
  results: any[],
  limit?: any
) => {
  return results?.length === 0 || results?.length < pageParam?.size
    ? undefined
    : { page: pageParam?.page + 1, size: limit || 20 };
};

export const pxInitialPageParam = (
  page: any = 0,
  size: any = 20,
  filters?: any
) => {
  return {
    page: page || 0,
    size: size || 20,
    ...(filters || {}),
  };
};

export const padBbox = (
  bbox: [number, number, number, number],
  paddingFactor: number = 0.3 // 30% larger
): [number, number, number, number] => {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const lngPadding = (maxLng - minLng) * paddingFactor;
  const latPadding = (maxLat - minLat) * paddingFactor;

  return [
    minLng - lngPadding,
    minLat - latPadding,
    maxLng + lngPadding,
    maxLat + latPadding,
  ];
};

export const getTimeAgo = (time: number, includeAgo?: boolean) => {
  if (!time) {
    return "";
  }
  const seconds = (Date.now() - time) / 1000;
  if (seconds < 5) return "Now";
  if (seconds < 60) return `${Math.floor(seconds)}s${includeAgo ? " ago" : ""}`;
  if (seconds < 60 * 60)
    return `${Math.floor(seconds / 60)} min${includeAgo ? " ago" : ""}`;
  if (seconds < 3600 * 24)
    return `${Math.floor(seconds / 3600)}h${includeAgo ? " ago" : ""}`;
  if (seconds < 86400 * 7)
    return `${Math.floor(seconds / 86400)}d${includeAgo ? " ago" : ""}`;
  if (seconds < 604800 * 5)
    return `${Math.floor(seconds / 604800)}w${includeAgo ? " ago" : ""}`;

  // ECMA-262 Date.toString() format: Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)
  const timeFormat = new Date(time).toString().split(" ");
  if (seconds < 2592000 * 12) return `${timeFormat[1]} ${timeFormat[2]}`;
  return `${timeFormat[1]} ${timeFormat[2]} ${timeFormat[3]}`;
};

export const getNavigationalStatusShortDescription = (status: number) => {
  switch (status) {
    case 1:
      return "At Anchor";
    case 2:
      return "Not Under Command";
    case 3:
      return "Restricted Maneuverability";
    case 4:
      return "Constrained by Draught";
    case 5:
      return "Moored";
    case 6:
      return "Aground";
    case 7:
      return "Engaged in Fishing";
    case 8:
      return "Underway Sailing";
    case 9:
      return "Reserved for DG/HS/C";
    case 10:
      return "Reserved for DG/HS/MP/A";
    case 11:
      return "Towing Astern";
    case 12:
      return "Pushing/Towing Alongside";
    case 13:
      return "Reserved for Future Use";
    case 14:
      return "AIS-SART Active";
    case 15:
      return "15";
    default:
      return "0";
  }
};
