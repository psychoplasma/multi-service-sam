const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');


function ymlParser(filename) {
  return jsYaml.safeLoad(fs.readFileSync(filename, 'utf8'));
}

function ymlWriter(filename, obj) {
  let yml = jsYaml.safeDump(obj);
  fs.writeFileSync(filename, yml);
}

function listFiles(dir, extension) {
  if (!fs.existsSync(dir)){
    console.log(`${dir} directory does not exist!`);
    return;
  }

  const files = fs.readdirSync(dir);

  let yamlFiles = [];

  for (let i = 0; i < files.length; i++) {
    let filename = path.join(dir, files[i]);
    let stat = fs.lstatSync(filename);

    if (stat.isDirectory()) { continue; } 
    
    if (filename.indexOf(extension) >= 0) {
        console.log(`-- ${extension} file found:`, filename);
        yamlFiles.push(filename);
    }
  }

  return yamlFiles;
}

module.exports = {
  ymlParser,
  ymlWriter,
  listFiles
}