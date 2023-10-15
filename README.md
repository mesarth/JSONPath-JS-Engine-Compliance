# JSONPath JavaScript Engine Compliance

This project evaluates how well different JavaScript JSONPath engines comply with the [JSONPath standard (wip)](https://datatracker.ietf.org/wg/jsonpath/about/). The compliance tests are provided by [https://github.com/jsonpath-standard/jsonpath-compliance-test-suite](https://github.com/jsonpath-standard/jsonpath-compliance-test-suite).

The project is inspired by [cburgmer's JSONPath comparison](https://cburgmer.github.io/json-path-comparison/) which uses consensus among the engines instead of compliance with the standard.

## Results

The results are published at [https://mesarth.github.io/JSONPath-JS-Engine-Compliance/](https://mesarth.github.io/JSONPath-JS-Engine-Compliance/)

## Run comparison locally

Install Node.js and Yarn

### Clone Repo with Submodules (!)

```bash
git clone --recurse-submodules https://github.com/mesarth/JSONPath-JS-Engine-Compliance.git
```

### Install Dependencies

```bash
yarn install
```

### Generate compliance.json file

```bash
yarn run build
```

or with debug output

```bash
yarn run build --debug
```

and/or ignore test cases wich test againt invalid selectors

```bash
yarn run build --ignore-invalid
```

### Run jekyll site locally

Install [Jekyll](https://jekyllrb.com/docs/installation/)

```bash
yarn run serve
```
