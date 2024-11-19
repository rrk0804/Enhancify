const fs = require('fs');

// Load the SBOM JSON file
const sbomFile = 'sbom.json';

try {
  const data = fs.readFileSync(sbomFile, 'utf8');
  const sbom = JSON.parse(data);

  // Extract all licenses from the components
  const components = sbom.components || [];
  const licensesSet = new Set();

  components.forEach((component) => {
    if (component.licenses) {
      component.licenses.forEach((license) => {
        const licenseName = license.license?.id || license.license?.name || 'Unknown license';
        licensesSet.add(licenseName);
      });
    }
  });

  // Convert the Set to an array for JSON output
  const uniqueLicenses = Array.from(licensesSet);

  console.log('Unique Licenses:', uniqueLicenses);

  // Save the result to a file
  fs.writeFileSync('unique-licenses.json', JSON.stringify(uniqueLicenses, null, 2), 'utf8');
  console.log('Unique licenses saved to unique-licenses.json');
} catch (error) {
  console.error('Error reading or parsing SBOM file:', error);
}