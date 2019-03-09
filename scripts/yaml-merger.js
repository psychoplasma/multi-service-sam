const getValue = require('get-value');
const setValue = require('set-value');
const unsetValue = require('unset-value');
const scan = require('object-scan');
const { ymlWriter, ymlParser, listFiles } = require('./file-utils');


function extractDynamoDbTables(dir) {
  const dbConfig = ymlParser(`${dir}/serverless.yml`);
  const tableNames = getValue(dbConfig, 'custom.tableName');

  const tableDefinitions = ymlParser(`${dir}/tables.yml`);

  return {tableNames, tableDefinitions};
}

function extractFunctions(dir) {
  const fnConfig = ymlParser(`${dir}/serverless.yml`);
  const tableExports = getValue(fnConfig, 'provider.environment');
  const iamRoles = getValue(fnConfig, 'provider.iamRoleStatements');

  const functionYmlFiles = listFiles(`${dir}`, 'functions.yml');
  let fnDefinitions = {};

  for (let i = 0; i < functionYmlFiles.length; i++) {
    fnDefinitions = Object.assign(fnDefinitions, ymlParser(functionYmlFiles[i]));

    // Get rid of layers in function definitions if there is,
    // because there is no actual layers deployed in local tests.
    let layers = scan(['*.layers'])(fnDefinitions);
    layers.forEach(layer =>  unsetValue(fnDefinitions, layer));
  }

  return {tableExports, iamRoles, fnDefinitions};
}

function mergeFunctionAndDynamoDbServices(fnDir, dbDir) {
  let {tableNames, tableDefinitions} = extractDynamoDbTables(dbDir);
  let {tableExports, fnDefinitions, iamRoles} = extractFunctions(fnDir);

  let layout = ymlParser('test/layout.yml');

  setValue(layout, 'custom.tableName', tableNames);
  setValue(layout, 'provider.environment', tableNames);
  setValue(layout, 'provider.iamRoleStatements', iamRoles);
  setValue(layout, 'functions', fnDefinitions);
  setValue(layout, 'resources', tableDefinitions);

  return layout;
}

console.log('Merging services...');
let mergedYml = mergeFunctionAndDynamoDbServices(process.env.FUNC_DIR, process.env.DYNAMODB_DIR);
ymlWriter('test/serverless.yml', mergedYml);
console.log('Services has been merged successfully.');
