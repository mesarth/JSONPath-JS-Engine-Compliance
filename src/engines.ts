import {query as jsonpathly} from 'jsonpathly';
import {JSONPath as jsonpathplus} from 'jsonpath-plus';
var jpfaster = require('jsonpath-faster');

export type EngineRunner = {
  id: string;
  name: string;
  query: (document: any, expression: string) => any;
};

export const engines: EngineRunner[] = [
  {
    id: 'JSONPath-Plus/JSONPath',
    name: 'JSONPath Plus',
    query: (document, expression) => jsonpathplus({path: expression, json: document})
  },
  {
    id: 'atamano/jsonpathly',
    name: 'jsonpathly',
    query: (document, expression) => jsonpathly(document, expression, { hideExceptions: true, returnArray: true})
  },
  {
    id: 'AndyA/jsonpath-faster',
    name: 'jsonpath-faster',
    query: (document, expression) => jpfaster.query(document, expression)
  }
]