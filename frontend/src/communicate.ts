const App = (window as any)["go"]["main"]["App"];

function func(name: string) {
  return App[name];
}
export const SendStatus = (status: {
  id: string;
  currentPosition: {
    x: number;
    y: number;
  };
  items: { id: string; name: string; amount: string }[];
}) => func("SendStatus")(status);

export const LogIn = (id: string) => func("LogIn")(id);
export const GetId = (): string => func("GetId")();
export const StartUpdateMapStatus = () => func("StartUpdateMapStatus")();
