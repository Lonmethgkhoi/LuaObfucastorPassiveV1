const express = require('express');
const bodyParser = require('body-parser');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json({ limit: '1mb' }));

app.post('/obfuscate', (req, res) => {
  const luaCode = req.body.code;
  if (!luaCode) return res.status(400).json({ error: 'No Lua code provided.' });

  // Save code to a temporary file
  const inputPath = path.join(__dirname, 'input.lua');
  fs.writeFileSync(inputPath, luaCode);

  // Call the super strong Lua obfuscator script
  execFile('lua', ['super_obfuscator.lua', 'input.lua'], { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: stderr || error.message });
    } else {
      res.json({ obfuscated: stdout });
    }
    // Clean up temp file (optional)
    fs.unlinkSync(inputPath);
  });
});

app.get('/', (req, res) => {
  res.send('Lua Obfuscator API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});