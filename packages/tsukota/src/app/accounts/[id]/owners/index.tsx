import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { List } from "@/components";
import { Screen } from "@/components/Screen";
import { useOwnerIndex } from "@/components/pages/OwnerIndex/hooks";
import { DeleteOwnerDialog } from "@/components/DeleteOwnerDialog";

export function OwnerIndex(): JSX.Element {
  const {
    deleteModalVisible,
    fab,
    handleDeleteOwnerClickCancel,
    handleDeleteOwnerClickOk,
    handleOwnerListLongPress,
    ownerId,
    owners,
  } = useOwnerIndex();

  if (owners === null) return <></>;
  return (
    <Screen fab={fab}>
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
      <DeleteOwnerDialog
        id={ownerId}
        onClickCancel={handleDeleteOwnerClickCancel}
        onClickOk={handleDeleteOwnerClickOk}
        visible={deleteModalVisible}
      />
    </Screen>
  );
}
