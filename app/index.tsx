import VesselBottomSheet from "@/bottomsheets/VesselBottomSheet";
import { useVessels, ZOOM_LEVEL_THRESHOLD } from "@/hooks/useVessels";
import { padBbox } from "@/services/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Mapbox from "@rnmapbox/maps";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "");

export default function Index() {
  const _mapRef = React.useRef<any>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [vesselGeoJSON, setVesselGeoJSON] = useState<any>(null);
  const [selectedVessel, setSelectedVessel] = useState<any>(null);
  const [cameraPosition, setCameraPosition] = useState<
    | {
        bbox: [number, number, number, number];
        zoom: number;
      }
    | any
  >({
    bbox: null,
    zoom: null,
  });

  // React query to fetch vessels
  const {
    data: vesselsData,
    error,
    isError,
  } = useVessels(cameraPosition?.bbox, cameraPosition?.zoom);

  // This is a debounced function that I will use to demonstrate saving
  // device and network resources for when the user is panning or zooming the map
  // Not required for the demo, but will leave for a proof of concept
  const debouncedSetCameraPosition = useMemo(
    () =>
      debounce((bounds: [number, number, number, number], zoom: number) => {
        // We are padding the values to get a bigger bounding box than what is on the screen
        setCameraPosition({
          bbox: padBbox(bounds, 0.5), // 50% larger - can be adjusted
          zoom,
        });

        // In case the user zooms in, loads vessels, and then zooms out
        // this will clear the vessels past the zoom level threshold
        if (zoom < ZOOM_LEVEL_THRESHOLD) {
          setVesselGeoJSON(null);
        }
      }, 100),
    []
  );

  const onCameraChanged = async (e: any) => {
    const { bounds, zoom } = e?.properties;

    if (!bounds) return;

    // {"ne":[-80.15769662097613,25.830116417421436],"sw":[-80.22670449383632,25.694997155327243]}
    const swLon = bounds?.sw[0];
    const swLat = bounds?.sw[1];
    const neLon = bounds?.ne[0];
    const neLat = bounds?.ne[1];
    const cameraBounds = [swLon, swLat, neLon, neLat];
    // console.log(
    //   `Southwest: [${swLon}, ${swLat}], Northeast: [${neLon}, ${neLat}]`
    // );
    debouncedSetCameraPosition(
      cameraBounds as [number, number, number, number],
      zoom
    );
  };

  const handleVesselPressed = (e: any) => {
    const { coordinates, features, point } = e;
    const { properties } = features[0];
    const { course, mmsi, speed, status, updatedAt, heading, name } =
      properties as any;
    console.log(
      `MMSI: ${mmsi}, Name: ${name}, Course: ${course}, Speed: ${speed}, Status: ${status}, Updated At: ${updatedAt}`
    );

    setSelectedVessel({
      ...properties,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
    });

    bottomSheetModalRef.current?.present();
  };

  useEffect(() => {
    if (isError && error) {
      const { status, message, data } = error as any;
      // Handle error here - e.g. show a toast or alert
      console.log(`Status: ${status} - Message: ${message}`);
    }
  }, [isError, error]);

  useEffect(() => {
    const vesselGeoJSON = vesselsData?.data?.vesselGeoJSON;

    if (!vesselGeoJSON) return;

    setVesselGeoJSON(vesselGeoJSON);
  }, [vesselsData]);

  const vesselIconStyle = {
    iconImage: "ship",
    iconRotate: ["get", "heading"], // Can use course as well however heading seems to be more accurate
    iconAllowOverlap: true,
    iconSize: 0.03, // TODO: Add a size multiplier once I collect the data
    iconOpacityTransition: {
      duration: 1000,
      delay: 0,
    },
    // If they are moving I want to show them at full opacity since they might be actively moving - this could also be good to show a different
    // icon for moving vessels
    iconOpacity: ["case", ["!=", ["get", "speed"], 0], 1, 0.5],
  };

  return (
    <View style={styles.page}>
      <Mapbox.MapView
        ref={_mapRef}
        style={styles.map}
        onCameraChanged={onCameraChanged}
        styleURL={Mapbox.StyleURL.Dark}
      >
        <Mapbox.Images
          images={{
            ship: require("@/assets/images/green-arrow.png"),
          }}
        />

        <Mapbox.Camera
          zoomLevel={8}
          centerCoordinate={[-80.1918, 25.7617]} // Miami
        />

        <Mapbox.ShapeSource
          id="vessels"
          shape={vesselGeoJSON}
          onPress={handleVesselPressed}
        >
          <Mapbox.SymbolLayer id="vesselIcons" style={vesselIconStyle} />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>

      <VesselBottomSheet vessel={selectedVessel} ref={bottomSheetModalRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },
});
