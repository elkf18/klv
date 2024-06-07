import { Field, FlatList, SectionList, Select, Text, View } from "libs/ui";
import ProductStore, { Product } from "app/model/product";
import EmptyList from "app/ui/utils/EmptyList";
import MainTopBar from "app/ui/utils/MainTopBar";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { RefreshControl, ToastAndroid } from "react-native";
import RenderItem from "../ui/product/RenderItem";
import Fab from "app/ui/utils/Fab";
import { useNavigation } from "@react-navigation/core";
import SessionStore from "app/model/session";
import Fonts from "libs/assets/fonts";
import colors from "app/config/colors";
import ProductTypeStore from "app/model/product_type";
import styles from "app/config/styles";
import { number } from "yup";
import { limitDialog } from "app/model/utils";

export default observer(() => {
  const onRefresh = async () => {
    ProductStore.loadCategory();
  };
  const nav = useNavigation();
  const refreshControl = (
    <RefreshControl refreshing={ProductStore.loading} onRefresh={onRefresh} />
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <>
      <MainTopBar filter={ProductStore.filterCategory} disableDate={true} />

      {ProductStore.categories.length > 1 &&
        <Select
          placeholder={"Semua Kategori"}
          items={ProductStore.getCategorySelect}
          labelPath={"category"}
          valuePath={"id"}
          value={ProductStore.filterCategory.tab}
          onChangeValue={(item: string) => {
            ProductStore.filterCategory.tab = item
          }}
          style={{
            ...styles.field,
            marginTop: 10,
            marginHorizontal: 16
          }}
        />
      }


      {/* <FlatList
        refreshControl={refreshControl}
        data={ProductStore.getCategoryPage}
        renderItem={({ item }: any) => {
          return <RenderItemHead item={item} />;
        }}
        keyExtractor={(item: any) => String(item.id)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data produk."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
          marginHorizontal: 16,
          paddingTop:16
        }}
      /> */}
      <SectionList
        refreshControl={refreshControl}
        refreshing={true}
        extraData={ProductStore.getCategoryPage}
        sections={ProductStore.getProduct}
        keyExtractor={(_, index) => String(index)}
        renderItem={(props) => {
          return <RenderItem {...props} />;
        }}
        renderSectionHeader={(props) => {
          return <RenderItemHead {...props} />;
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
          //paddingTop: !!ProductStore.filter.search ? 0 : 110,
          paddingBottom: 80,
        }}
        style={{
          flex: 1,
        }}
      />
      {SessionStore.role.role_name.toLowerCase() != "sales" &&
        !!SessionStore.user.id_outlet &&
        <Fab
          onPress={() => {
            ProductStore.form.init();
              nav.navigate("user/product/Form");
          //   let limit = SessionStore.getConfig("m_product")
          //   if (!!limit) {
          //     if(limit!=null){
          //       if (ProductStore.list.length >= (limit - 1)) {
          //         limitDialog()
          //       } else {
  
          //         ProductStore.detail.init();
          //         nav.navigate("user/product/Form");
          //       }
          //     }else{
          //       ProductStore.detail.init();
          //     nav.navigate("user/product/Form");
          //     }
             
          //   } else {
          //     ProductStore.detail.init();
          //     nav.navigate("user/product/Form");
          //   }
          }}
        />
      }
    </>
  );
});


const RenderItemHead = observer((props: any) => {
  const { section } = props;

  return (
    <View>
      <Text
        style={{
          flexGrow: 1,
          fontFamily: Fonts.poppinsmedium,
          color: colors.grey,
          backgroundColor: "white"
        }}
      >
        {section.category}
      </Text>
      <View
      >
        {/* {item.product.map((i: Product, key: number) => (
          <RenderItem key={key} section={item} item={i} />
        ))} */}

        {/* <FlatList
          data={item.product}
          renderItem={({ item }: any) => {
            return <RenderItem item={item} />;
          }}
          keyExtractor={(item: any) => String(item.id)}
          contentContainerStyle={{
            paddingBottom: 80,
          }}
        /> */}
      </View>
    </View>
  );
});