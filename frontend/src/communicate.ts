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

export const LogIn = (id: string):Promise<number> => func("LogIn")(id);
export const GetId = (): Promise<string> => func("GetId")();
export const StartUpdateMapStatus = ():Promise<void> => func("StartUpdateMapStatus")();
export const SetServerPort = (port: number):Promise<void> => func("SetServerPort")(port);