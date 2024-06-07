import { Spinner, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";

export default observer(({ loading }: any) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!!loading && (
        <Spinner
          color={"#fff"}
          style={{
            padding: 8,
          }}
        />
      )}
    </View>
  );
});
