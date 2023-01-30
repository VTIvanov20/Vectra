/* tslint:disable */
/* eslint-disable */
/**
*/
export class JsEvalexprContext {
  free(): void;
/**
*/
  constructor();
/**
* @param {string} line
* @returns {any}
*/
  eval(line: string): any;
/**
* @param {string} id
* @param {any} v
*/
  set_value(id: string, v: any): void;
/**
* @param {string} id
* @returns {any}
*/
  get_value(id: string): any;
}
