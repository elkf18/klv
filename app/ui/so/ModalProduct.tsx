import ProductStore, { Product } from "app/model/product";
import SalesStore from "app/model/sales";
import { Button, FlatList, Icon, Modal, SectionList, Text, TextInput, View } from "libs/ui";
import { runInAction, toJS } from "mobx";
import { observer } from "mobx-react";

import { KeyboardAvoidingView, RefreshControl, ScrollView } from "react-native";
import EmptyList from "../utils/EmptyList";
import MainTopBar from "../utils/MainTopBar";
import React, { useEffect, useState } from "react";
import Fonts from "libs/assets/fonts";
import CustomTopBar from "./CustomTopBar";
import { ITheme } from "libs/config/theme";
import { useNavigation, useTheme } from "@react-navigation/native";
import colors from "app/config/colors";
import { moneyFormat } from "libs/utils/string-format";

function useForceUpdate() {

  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default observer((props: any) => {
  const { meta } = props;
  const Theme: ITheme = useTheme() as any;
  const nav = useNavigation();
  
  const dismiss = () => {
    runInAction(() => {
      meta.visible = false;
    });
  };
  const forceUpdate = useForceUpdate();

  const onRefresh = async () => {
    ProductStore.loadCategory();
    SalesStore.tempForm.init();
    SalesStore.tempForm.t_sales_order_lines =
      SalesStore.form.t_sales_order_lines;
    SalesStore.tempForm.sub_total = SalesStore.form.sub_total;
  };

  const refreshControl = (
    <RefreshControl refreshing={ProductStore.loading} onRefresh={onRefresh} />
  );

  function submit() {
    SalesStore.form.t_sales_order_lines =
      SalesStore.tempForm.t_sales_order_lines;
    SalesStore.form.sub_total = SalesStore.tempForm.sub_total;
    SalesStore.form.grand_total = SalesStore.tempForm.grand_total;
    // SalesStore.tempForm.init()
    dismiss();
  }

  return (
    <View>
      <Modal
        visible={meta.visible}
        onDismiss={dismiss}
        onRequestClose={dismiss}
        style={{
          backgroundColor: "#fff",
        }}
      >
        <CustomTopBar
          filter={ProductStore.filterCategory}
          onBack={dismiss}
          disableDate
        />
        <ScrollView
          style={{
            width: "100%",

          }}
          contentContainerStyle={{
            paddingBottom: 100
          }}
        >
          <KeyboardAvoidingView behavior="padding">
            <SectionList
              refreshControl={refreshControl}
              refreshing={true}
              extraData={ProductStore.getCategoryPage}
              sections={ProductStore.getProductModal}
              keyExtractor={(_, index) => String(index)}
              renderItem={(props) => {
                return <RenderItemChild {...props} />;
              }}
              renderSectionHeader={(props) => {
                return <RenderItemHead {...props} forceUpdate={forceUpdate} />;
              }}

              automaticallyAdjustContentInsets={true}
              stickySectionHeadersEnabled
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              renderSectionFooter={() => (
                <View
                  style={{
                    margin: 10,
                  }}
                />
              )}
              ListEmptyComponent={
                <EmptyList text={"Maaf untuk saat ini, tidak ada data produk."} />
              }
              contentContainerStyle={{
                paddingBottom: 80,
              }}
              style={{
                flex: 1,
              }}
            />
          </KeyboardAvoidingView>
        </ScrollView>
        {/* {SalesStore.getQty > 0 && ( */}
        <RenderSubmit handleSubmit={submit} />
        {/* )} */}
      </Modal>
    </View>
  );
});


const RenderSubmit = observer((props: any) => {
  const { handleSubmit, canSubmit } = props;
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as any;

  return (
    <>
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 10,
          borderTopColor: "#cccccc",
          borderTopWidth: 1,
          backgroundColor: "#ffffff",
          width: "100%",
          position: "absolute",
          bottom: 0
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            padding: 5,
          }}
        >
          <Text
            style={{
              color: colors.textBlack,
              fontSize: 16,
            }}
          >
            Subtotal:
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppinsmedium,
              color: colors.textPrimary
            }}
          >
            {moneyFormat(SalesStore.tempForm.sub_total || 0, "Rp. ")}
          </Text>
        </View>
        <View style={{
          flexDirection: "row",
          flex: 1,
          flexGrow: 1,
          marginTop: 16

        }}>
          <Button
            style={{
              margin: 0,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              flexGrow: 1,
              flexBasis: 0,
              backgroundColor: colors.primary
            }}
            onPress={handleSubmit}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontFamily: Fonts.poppinsbold,
              }}
            >
              Tambah Produk
            </Text>
          </Button>
        </View>

      </View>
    </>
  );
});


const RenderItemHead = observer((props: any) => {
  const { section } = props;
  let item = section

  const forceUpdate = props.forceUpdate;

  const siwtchExpand = () => {
    runInAction(() => (item.expand = !item.expand));
    ProductStore.onExpand(item.id)
    forceUpdate()
  };
  let selected = item.selected;

  //let vary=item.vary;
  const expand = item.expand;

  return (
    <View>
      <Button
        style={{
          flexDirection: "row",
          //backgroundColor: !!vary  ?  (vary.length>0?"#c6ebc9":"#efefef") : "#efefef",
          backgroundColor: selected ? colors.hoverPrimary : colors.surfaceGrey, //#c6ebc9
          borderColor: selected ? colors.primary : "#cccccc",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingVertical: 10,
          paddingHorizontal: 10,
          margin: 0,
          flex: 1,
          flexGrow: 1,
          borderRadius: 5,
          borderWidth: 1,
          marginBottom: 10

        }}
        onPress={siwtchExpand}
      >

        <Text
          style={{
            flexGrow: 1,
            fontFamily: Fonts.RobotoBold,
          }}
        >
          {item.category}  ({item.data.length})
        </Text>


        <Icon name={expand ? "chevron-up" : "chevron-down"} />
      </Button>
      <View
        style={{
          height: expand ? undefined : 0,
        }}
      >
        {/* {item.product.map((i: Product, key: number) => (
          <RenderItemChild key={key} section={item} item={i} />
        ))} */}
      </View>
    </View>
  );
});

const RenderItemChild = observer(({ section, item }: any) => {

  //const { section } = props;
  //console.log(toJS(item))
  const forceUpdate = useForceUpdate();
  const selected = SalesStore.tempForm.t_sales_order_lines.findIndex(
    (x) => x.id_product === item.id
  );
  const SOLine = SalesStore.tempForm.t_sales_order_lines.find(
    (x) => x.id_product === item.id
  );
  const check = (key = -1) => {
    if (key == -1) {
      SalesStore.tempForm.changeToNumber(selected);
      SalesStore.tempForm.calculate(selected);
    } else {
      SalesStore.tempForm.changeToNumber(key);
      SalesStore.tempForm.calculate(key);
    }
    forceUpdate()
    ProductStore.onSelectX(section)

  };
  const minus = () => {
    
    if (selected > -1) {
      if (SOLine) {
        if (SOLine.qty > 0) {
          SOLine.qty -= 1;
        }
        if (SOLine.qty === 0) {
          SalesStore.tempForm.deleteProduct(selected);
        } else {
          // SOLine.qty -= 1;
          runInAction(
            () => (SalesStore.tempForm.t_sales_order_lines[selected] = SOLine)
          );
        }
      }
    }
    check();
  };

  const plus = () => {
    console.log("section:::")
    console.log(JSON.stringify(section))
    console.log("item:::")
        console.log(JSON.stringify(item))
    let key = -1;
    if (selected > -1) {
      if (SOLine) {
        SOLine.qty += 1;
        runInAction(
          () => (SalesStore.tempForm.t_sales_order_lines[selected] = SOLine)
        );
      }
    } else {
      key = SalesStore.tempForm.addProduct({
        ...toJS(section),
        ...toJS(item),
      });
      
    }

    check(key);
  };

  const onChange = (e: any) => {
    let key = -1;
    const value = Number(e.nativeEvent.text);
    if (selected > -1) {
      if (Number(value) === 0) {
        SalesStore.tempForm.deleteProduct(selected);
      } else {
        runInAction(
          () => (SalesStore.tempForm.t_sales_order_lines[selected].qty = value)
        );
      }
    } else {
      if (value > 0) {
        key = SalesStore.tempForm.addProduct({
          ...toJS(section),
          ...toJS(item),
        });

        

        runInAction(
          () => (SalesStore.tempForm.t_sales_order_lines[key].qty = value)
        );
      }
    }
    check(key);
  };

  useEffect(() => {
    // if (!section.selected) {
    //   runInAction(() => (section.selected = selected > -1));
    // } else {
    //   runInAction(() => (section.selected = selected > -1));
    // }
    ProductStore.onSelectX(section)
    //ProductStore.onSelect(item,section)

    
    //var exists = section.vary.some(o => o.objectId === data.objectId);

    //let mark = item.varian+item.responsibility_center
    //   if(!!section.vary){
    //     if (!section.selected) {

    //       let index: number = section.vary.findIndex((c:String) => c === mark);
    //       if (index != -1) {
    //         section.vary.splice(index, 1);
    //     }

    //      // section.vary =  section.vary.filter((ite:String) => ite !== item.varian);
    //     }else{
    //       if(!section.vary.includes(mark)){
    //         section.vary.push(mark)
    //       }else{

    //       }
    //     }
    //   }else{
    //     if (section.selected) {
    //         section.vary=[mark];
    //     }
    //   }
  }, [selected]);

  if (!section.expand) return null;

  if (item.normal_price == null) return null;

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        flexGrow: 1,
        padding: 5,
        width: "100%",

      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-end",
          alignItems: "center",
          padding: 10,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignSelf: "flex-end",
            flex: 1,
            flexGrow: 1,
            width: "100%"

          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.poppins,
              flex: 1,
              flexGrow: 1,
              textAlign: "left",
            }}
            numberOfLines={2}
          >{item.product_name}</Text>

          <Text
            style={{
              fontFamily: Fonts.poppinsbold,
              fontSize: 12,
              color: colors.black
            }}
          >
            {moneyFormat(item.normal_price || 0, "Rp. ")}

          </Text>
        </View>
        {/* {!!item.price && ( */}

        {/* )} */}
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Button
            style={{
              paddingHorizontal: 5,
              paddingVertical: 0,
              margin: 0,
              height: 35,
              borderRadius: 4,
              backgroundColor: selected === -1 ? colors.inactive : colors.primary,

            }}
            disabled={selected === -1}
            onPress={minus}
            disableOpacity={100}
          >
            <Icon name="remove" color="white" />
          </Button>
          <RenderInput onChange={onChange} selected={selected} />
          <Button
            style={{
              paddingHorizontal: 5,
              paddingVertical: 0,
              margin: 0,
              height: 35,
              borderRadius: 4
            }}
            onPress={plus}
          >
            <Icon name="add" color="white" />
          </Button>
        </View>
      </View>
      <View
        style={{
          marginTop: 12,
          borderBottomColor: "#cccccc",
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
});

const RenderInput = observer((props: any) => {
  const { selected, onChange, item } = props;

  return (
    <View>
      <TextInput
        type={"decimal"}
        value={String(
          SalesStore.tempForm.t_sales_order_lines[selected]?.qty || 0
        )}
        onChange={onChange}
        style={{
          height: 35,
          width: 35,
          borderWidth: 1,
          borderColor: colors.primary,
          color: colors.primary,
          textAlign: "center",
          marginHorizontal: 5,
          borderRadius: 4,
        }}
      />
    </View>
  );
});
