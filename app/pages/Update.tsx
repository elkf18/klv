import React from "react";
import { observer } from "mobx-react";
import { Modal, View, Text } from "libs/ui";

export default observer(({ meta }: any) => {
  return (
    <Modal visible={meta.checkUpdate}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text>
            {!meta.update ? "Checking new update..." : "Downloading update..."}
            {meta.progress}
          </Text>
        </View>
      </View>
    </Modal>
  );
});
