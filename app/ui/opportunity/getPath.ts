export const getPath = (stage: any) => {
  let path = String(stage.value + "_" + stage.label.replace(/ /g, "_"));
  return path;
};
