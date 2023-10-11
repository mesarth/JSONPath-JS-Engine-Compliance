import cts from '../jsonpath-compliance-test-suite/cts.json';
import {query} from 'jsonpathly';
import {JSONPath} from 'jsonpath-plus';
import {isEqual } from 'lodash'
var jpfaster = require('jsonpath-faster');

type EngineRunner = {
  id: string;
  name: string;
  query: (document: any, expression: string) => any;
};

const engines: EngineRunner[] = [
  {
    id: 'JSONPath-Plus/JSONPath',
    name: 'JSONPath Plus',
    query: (document, expression) => JSONPath({path: expression, json: document})
  },
  {
    id: 'atamano/jsonpathly',
    name: 'jsonpathly',
    query: (document, expression) => query(document, expression, { hideExceptions: true, returnArray: true})
  },
  {
    id: 'AndyA/jsonpath-faster',
    name: 'jsonpath-faster',
    query: (document, expression) => jpfaster.query(document, expression)
  }
]

type TestResult = {
  testName: string;
  engineCompliance: Array<boolean>;
};

type Compliance = {
  engines: Omit<EngineRunner, 'query'>[];
  results: TestResult[];
  summary: Array<number>;
}

const compliance: Compliance = {
  engines: engines,
  results: [],
  summary: []
}

for(const test of cts.tests){
  const result: TestResult = { testName: test.name, engineCompliance: [] };
  for (const engine of engines){
    try{
      const output = engine.query(test.document, test.selector);
      // if(!isEqual(test.result,output)){
      //   console.log(`-- ${test.name} --`)
      //   console.log('standard');
      //   console.log(test.result)
      //   console.log(`Not correct: ${engine.name}`)
      //   console.log(output);
      // }

      result.engineCompliance.push(isEqual(test.result,output));
    }
    catch(e){
    }
  }
  // console.log();
  compliance.results.push(result);
}

const nrOfTests = compliance.results.length;
for (const index of engines.keys()){
  const nrOfCompliantTests = compliance.results.reduce<number>((prev, cur) => cur.engineCompliance[index] ? prev + 1 : prev, 0);
  compliance.summary.push(nrOfCompliantTests / nrOfTests);
  // console.log(nrOfCompliantTests);
}

console.log(compliance);