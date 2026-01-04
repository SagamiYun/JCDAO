const fs = require('fs');
const path = require('path');

const contracts = ['JCDMembership', 'JCDToken'];
const outDir = path.join(__dirname, '../frontend/src/lib/abi');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

contracts.forEach(c => {
    const artifactPath = path.join(__dirname, `../artifacts/contracts/${c}.sol/${c}.json`);
    if (fs.existsSync(artifactPath)) {
        const artifact = require(artifactPath);
        fs.writeFileSync(path.join(outDir, `${c}.json`), JSON.stringify(artifact.abi, null, 2));
        console.log(`Extracted ABI for ${c}`);
    } else {
        console.error(`Artifact not found: ${artifactPath}`);
    }
});
