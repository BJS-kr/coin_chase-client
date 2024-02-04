import { getFunction } from './util';

export const SendStatus = (status:{id:number, x:number, y:number, items:number[]}) => getFunction("SendStatus")(status)