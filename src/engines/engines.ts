import { query as jsonpathly } from "jsonpathly";
import { JSONPath as jsonpathplus } from "jsonpath-plus";
const jpfaster = require("jsonpath-faster");
//Brunered engine .js file has to be manually updated because it is not published in any registry. I tried to to use the repo as a git submodule but that didn't work because the the functions are not exported / the files are not set up as modules.
//https://github.com/brunerd/jsonpath/blob/main/jsonpath.min.js
import { jpbrunerd } from "./brunerd-jsonpath/jsonpath.min.js";

export type EngineRunner = {
  id: string;
  name: string;
  query: (document: any, expression: string) => any;
};

export const engines: EngineRunner[] = [
  {
    id: "JSONPath-Plus/JSONPath",
    name: "JSONPath Plus",
    query: (document, expression) =>
      jsonpathplus({ path: expression, json: document }),
  },
  {
    id: "atamano/jsonpathly",
    name: "jsonpathly",
    query: (document, expression) =>
      jsonpathly(document, expression, {
        hideExceptions: true,
        returnArray: true,
      }),
  },
  {
    id: "AndyA/jsonpath-faster",
    name: "jsonpath-faster",
    query: (document, expression) => jpfaster.query(document, expression),
  },
  {
    id: "brunerd/jsonpath",
    name: "brunerd JSONPath",
    query: (document, expression) => jpbrunerd(document, expression),
  },
];
