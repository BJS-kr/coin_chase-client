export function getFunction(f:string, module:string = "App"):Function {
  return (window as any)['go']['main'][module][f]
}