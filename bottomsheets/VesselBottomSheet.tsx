import BBPressable from "@/components/BBPressable";
import {
  getNavigationalStatusShortDescription,
  getTimeAgo,
} from "@/services/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import { Clipboard, Linking, StyleSheet, Text, View } from "react-native";

const VesselBottomSheet = forwardRef(
  ({ vessel }: { vessel: any }, ref: any) => {
    const snapPoints = useMemo(() => ["30%", "100%"], []);

    const handleCloseBottomSheet = () => {
      ref.current?.close();
    };

    const handleViewOnMarineTraffic = () => {
      const url = `https://www.marinetraffic.com/en/ais/details/ships/mmsi:${vessel?.mmsi}`;
      Linking.openURL(url);
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text numberOfLines={1} style={styles.vesselName}>
                {vessel?.name}
              </Text>
              <BBPressable onPress={handleCloseBottomSheet}>
                <AntDesign name="close" size={32} color="#FEFEFE" />
              </BBPressable>
            </View>
            <Text style={styles.updatedText}>
              {`Updated ${getTimeAgo(vessel?.updatedAt, true)}`}
            </Text>
          </View>

          <ViewButton
            onPress={handleViewOnMarineTraffic}
            icon="pentagon-outline"
            text="View on Marine Traffic"
          />

          <View style={styles.propertyContainer}>
            {Object.entries(vessel ?? {}).map(([key, value]) => {
              if (key === "updatedAt" || key === "name") return null;
              let formatedValue = value;
              if (key === "status") {
                formatedValue = getNavigationalStatusShortDescription(
                  value as number
                );
              }
              return (
                <VesselPropertyRow
                  key={key}
                  title={key}
                  value={formatedValue}
                />
              );
            })}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const ViewButton = ({
  onPress,
  icon,
  text,
}: {
  onPress: () => void;
  icon: string;
  text: string;
}) => (
  <BBPressable onPress={onPress} style={styles.viewButton}>
    <MaterialCommunityIcons name={icon as any} size={18} color="white" />
    <Text style={styles.viewButtonText}>{text}</Text>
  </BBPressable>
);

const VesselPropertyRow = ({ title, value }: { title: string; value: any }) => {
  const handleCopyToClipboard = () => {
    // This is deprecated however it will work for the demo
    Clipboard.setString(value.toString());
  };

  return (
    <BBPressable onPress={handleCopyToClipboard} style={styles.propertyRow}>
      <Text style={styles.propertyTitle}>{title}</Text>
      <Text style={styles.propertyValue}>{value}</Text>
    </BBPressable>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#101214",
  },
  handleIndicator: {
    backgroundColor: "#FEFEFE",
  },
  scrollView: {
    backgroundColor: "#101214",
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
    padding: 16,
    minHeight: 400,
    gap: 16,
  },
  header: {
    gap: 12,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  vesselName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FEFEFE",
    flex: 1,
  },
  updatedText: {
    fontSize: 12,
    color: "#FEFEFE",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: "#4b45ff",
    borderRadius: 40,
    padding: 16,
  },
  viewButtonText: {
    fontSize: 16,
    color: "#FEFEFE",
  },
  propertyContainer: {
    backgroundColor: "#212529",
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  propertyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  propertyTitle: {
    color: "#FEFEFE",
    fontSize: 12,
    fontWeight: "300",
  },
  propertyValue: {
    color: "#FEFEFE",
    fontSize: 12,
    fontWeight: "800",
  },
});

export default VesselBottomSheet;
