import { query as jsonpathly } from "jsonpathly";
import { JSONPath as jsonpathplus } from "jsonpath-plus";
const jpfaster = require("jsonpath-faster");
//Brunered engine .js file has to be manually updated because it is not published in any registry. I tried to to use the repo as a git submodule but that didn't work because the the functions are not exported / the files are not set up as modules.
//https://github.com/brunerd/jsonpath/blob/main/jsonpath.min.js
import { jpbrunerd } from "./brunerd-jsonpath/jsonpath.min.js";
import { jsonpath as jsonp3 } from "json-p3";

export type EngineRunner = {
  repo: string;
  version?: string;
  name: string;
  query: (document: any, expression: string) => any;
};

const getInstalledPackageVersion = (name: string): string => {
  const fs = require('fs');
  const path = require('path');
  try {
    const json = JSON.parse(
      fs.readFileSync(path.join('node_modules', name, 'package.json'), 'utf8')
    );
    return json.version;
  } catch (e) {
    console.log(`failed to read/parse package.json for ${name}`, e);
  }
};

export const engines: EngineRunner[] = [
  {
    name: "json-p3",
    repo: "jp-rp/json-p3",
    version: getInstalledPackageVersion("json-p3"),
    query: (document, expression) => jsonp3.query(expression, document).values()
  },
  {
    name: "JSONPath Plus",
    repo: "JSONPath-Plus/JSONPath",
    version: getInstalledPackageVersion("jsonpath-plus"),
    query: (document, expression) =>
      jsonpathplus({ path: expression, json: document }),
  },
  {
    name: "jsonpathly",
    repo: "atamano/jsonpathly",
    version: getInstalledPackageVersion("jsonpathly"),
    query: (document, expression) =>
      jsonpathly(document, expression, {
        hideExceptions: true,
        returnArray: true,
      }),
  },
  {
    name: "jsonpath-faster",
    repo: "AndyA/jsonpath-faster",
    version: getInstalledPackageVersion("jsonpath-faster"),
    query: (document, expression) => jpfaster.query(document, expression),
  },
  {
    repo: "brunerd/jsonpath",
    name: "brunerd JSONPath",
    version: "0.9.19",
    query: (document, expression) => jpbrunerd(document, expression),
  },
];
