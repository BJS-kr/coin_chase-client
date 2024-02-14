const App = (window as any)["go"]["main"]["App"];

function func(name: string) {
  return App[name];
}
export const SendStatus = (status: {
  id: number;
  x: number;
  y: number;
  items: number[];
}) => func("SendStatus")(status);

export const SetId = (id: string) => func("SetId")(id);
export const GetId = () => func("GetId")();
