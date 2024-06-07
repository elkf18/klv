import { Button, Icon, Spinner, TopBar, View } from "libs/ui";
import Fonts from "libs/assets/fonts";
import { observer } from "mobx-react";
import React from "react";
import colors from "app/config/colors";

export default observer((props: any) => {
  const { loading, onEdit, title, onBack, onDelete, onPrint } = props;
  return (
    <TopBar
      backButton={true}
      actionBackButton={onBack}
      rightAction={
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!!loading ? (
            <Spinner
              color={"#000"}
              style={{
                padding: 8,
              }}
            />
          ) : (
            <View style={{ flexDirection: "row" }}>
            {!!onEdit && (
              <Button
                mode={"clean"}
                style={{
                  margin: 0,
                  paddingHorizontal: 0,
                  marginRight: 15,
                }}
                onPress={onEdit}
              >
                <Icon source="FontAwesome" name="pencil" size={18} color={colors.black} />
              </Button>
            )}
            {!!onDelete && (
                <Button
                  mode={"clean"}
                  style={{
                    margin: 0,
                    paddingHorizontal: 0,
                    marginRight: 15,
                    marginLeft:5,
                  }}
                  onPress={onDelete}
                >
                  <Icon source="FontAwesome" name="trash" size={18} color={colors.black} />
                </Button>
              )}
{/* 
              {(!!onPrint && (
                <Button
                mode={"clean"}
                style={{
                  margin: 0,
                  paddingHorizontal: 0,
                  marginRight: 15,
                }}
                onPress={onPrint}
              >
                <Icon name={"md-print"} size={24} color={"#000"} />
              </Button>
              )

              )} */}
              </View>
          )}
          
        </View>
      }
      styles={{
        title:{
          paddingTop: 3,
          textAlign:"center",
          fontFamily:Fonts.poppinsmedium,
        }
      }}
    >
      {title}
    </TopBar>
  );
});
