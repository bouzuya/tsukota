import React from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FAB, DeleteOwnerDialog, Screen, List } from "@/components";
import { useOwnerIndex } from "@/components/pages/OwnerIndex/hooks";

export function OwnerIndex(): JSX.Element {
  const {
    deleteModalVisible,
    handleDeleteOwnerClickCancel,
    handleDeleteOwnerClickOk,
    handleFABPress,
    handleOwnerListLongPress,
    ownerId,
    owners,
    t,
  } = useOwnerIndex();

  if (owners === null) return <></>;
  return (
    <Screen>
      <FlatList
        data={owners}
        keyExtractor={(owner) => owner}
        renderItem={({ item: owner }) => (
          <List.Item
            key={owner}
            onLongPress={() => handleOwnerListLongPress(owner)}
            title={owner}
          />
        )}
        style={[{ flex: 1, width: "100%" }]}
      />
      <FAB
        accessibilityLabel={t("owner.new")}
        icon="plus"
        onPress={handleFABPress}
        style={styles.fab}
      />
      <DeleteOwnerDialog
        id={ownerId}
        onClickCancel={handleDeleteOwnerClickCancel}
        onClickOk={handleDeleteOwnerClickOk}
        visible={deleteModalVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
