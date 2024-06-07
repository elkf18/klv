import { Button, Icon, Text, View } from "libs/ui";
import { dateFormat } from "libs/utils/date";
import { action } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";

export default observer(({ filter }: any) => {
  const meta = useLocalObservable(() => ({
    filter: [] as any,
  }));

  const handleClrDate = action(() => {
    filter.date = "";
  });

  const handleClrSearch = action(() => {
    filter.search = "";
  });

  const setFilter = action((filter: any[]) => {
    meta.filter = filter;
  });

  useEffect(() => {
    const filterArr = [];
    if (!!filter?.date)
      filterArr.push({
        label: dateFormat(filter.date, "d MMM yyyy"),
        action: handleClrDate,
      });
    if (!!filter?.search)
      filterArr.push({
        label: filter.search,
        action: handleClrSearch,
      });
    setFilter(filterArr);
  }, [filter?.date, filter?.search]);

  return (
    <>
      {meta.filter.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            padding: 15,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {meta.filter.map((item: any, key: number) => (
            <View
              key={key}
              style={{
                borderRadius: 99,
                flexDirection: "row",
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 10,
                borderColor: "#d2d2d2",
                borderStyle: "solid",
                borderWidth: 1,
                overflow: "hidden",
                marginRight: 5,
              }}
            >
              <Text>{item.label}</Text>
              <Button
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  margin: 0,
                  backgroundColor: "transparent",
                  minHeight: 30,
                  minWidth: 30,
                }}
                onPress={() => item.action()}
              >
                <Icon name={"ios-close-circle"} style={{ margin: 0 }} />
              </Button>
            </View>
          ))}
        </View>
      )}
    </>
  );
});
