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

type SummaryEntry = {
  testType: string | null;
  percentages: Array<number>;
};

type Compliance = {
  engines: Omit<EngineRunner, 'query'>[];
  results: TestResult[];
  summary: SummaryEntry[];
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


const testTypes = cts.tests.reduce<string[]>((testTypes, test) => {
  const testType = test.name.split(',')[0];
  if(!testTypes.includes(testType)){
    testTypes.push(testType);
  }
  return testTypes
}, [])
testTypes.unshift(null); //add "no testType" special case

for(const testType of testTypes){
  const filteredResults = compliance.results.filter((result) => result.testName.startsWith(testType) || testType === null);
  const nrOfTests = filteredResults.length;
  const summary: SummaryEntry  = {testType, percentages: []};
  for (const engineIndex of engines.keys()){
    const nrOfCompliantTests = filteredResults.reduce<number>((prev, cur) => cur.engineCompliance[engineIndex] ? prev + 1 : prev, 0);
    summary.percentages.push(nrOfCompliantTests / nrOfTests);
  }
  compliance.summary.push(summary);
}

console.log(compliance.summary);