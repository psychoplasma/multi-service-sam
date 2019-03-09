const fs = require('fs');
const setValue = require('set-value');


function extractDependencies(dir) {
  const packageJson = JSON.parse(fs.readFileSync(`${dir}/package.json`, 'utf8'));
  return packageJson.dependencies;
}

function mergeDependencies(src, dest) {
  const srcDependencies = extractDependencies(src);
  const destDependencies = extractDependencies(dest);
  const mergedDependencies = Object.assign(destDependencies, srcDependencies);

  let destPackageJson = JSON.parse(fs.readFileSync(`${dest}/package.json`, 'utf8'));

  setValue(destPackageJson, 'dependencies', mergedDependencies);

  const content = JSON.stringify(destPackageJson);

  fs.writeFileSync(dest, content);
}

console.log('Merging dependencies...');
mergeDependencies(process.env.DEPENDENCIES_SRC, process.env.DEPENDENCIES_DEST);
console.log('Dependencies have been merged successfully.');
