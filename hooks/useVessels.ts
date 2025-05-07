import fetchClient from "@/services/fetchClient";
import { useQuery } from "@tanstack/react-query";

export const ZOOM_LEVEL_THRESHOLD = 12; // Minimum zoom level to show vessels

export const useVessels = (bbox: number[], zoom: number) => {
  return useQuery({
    queryKey: ["vessels", bbox],
    queryFn: async () => {
      if (!bbox) return null;
      const params = new URLSearchParams({
        bbox: bbox.join(","),
      });
      return await fetchClient.get(`/vessels?${params}`);
    },
    enabled: !!bbox && zoom >= ZOOM_LEVEL_THRESHOLD,
    // enabled: !!bbox && (zoom ?? 15) >= 8, // For testing
    refetchInterval: 5000, // every 5 seconds - can be adjusted
    refetchOnWindowFocus: true,
    staleTime: 5000, // Half of the 10 second max - can be adjusted
  });
};
