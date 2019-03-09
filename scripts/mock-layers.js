const jsYaml = require('js-yaml');
const getValue = require('get-value');
const scan = require('object-scan');
const fs = require('fs');
const { execSync } = require('child_process');

function parser(filename) {
  return jsYaml.safeLoad(fs.readFileSync(filename, 'utf8'));
}

function extractLayers(dir) {
  const layerConfig = parser(`${dir}/serverless.yml`);
  const layerNode = getValue(layerConfig, 'layers');

  let pathNames = scan(['*.path'])(layerNode);
  let paths = pathNames.map(path => getValue(layerNode, path));
  let layers = scan(['*'])(layerNode);

  return {layers, paths};
}

async function mockLayers(layers, paths) {
  for (let i = 0; i < paths.length; i++) {
    console.log(`Layer ${layers[i]}: Copying services/layers/${paths[i]} directory to /opt`);
    execSync(`cp -r ./services/layers/${paths[i]} /opt/`);
  }
}

const {layers, paths} = extractLayers('resources/layers');
mockLayers(layers, paths);