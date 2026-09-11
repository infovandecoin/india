const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');

const token = process.env.GITHUB_TOKEN || process.argv[2] || '';

const options = {
  hostname: 'api.github.com',
  path: '/repos/infovandecoin/india/actions/artifacts/10153253401/zip',
  headers: {
    'User-Agent': 'NodeJS',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
};

function download(url, isRedirect) {
  const opts = isRedirect ? url : options;
  https.get(opts, function(res) {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return download(res.headers.location, true);
    }
    const file = fs.createWriteStream('apk-download.zip');
    res.pipe(file);
    file.on('finish', function() {
      file.close(function() {
        console.log('ZIP downloaded. Extracting...');
        try {
          execSync('powershell -Command "Expand-Archive -Path apk-download.zip -DestinationPath . -Force"');
          if (fs.existsSync('apk-download.zip')) fs.unlinkSync('apk-download.zip');
          if (fs.existsSync('app-debug.apk')) {
            fs.renameSync('app-debug.apk', 'VandeCoin-debug.apk');
            const stat = fs.statSync('VandeCoin-debug.apk');
            console.log('EXTRACTED_APK_SUCCESS:', (stat.size / (1024 * 1024)).toFixed(2) + ' MB');
          }
        } catch (err) {
          console.error('Extract error:', err);
        }
      });
    });
  }).on('error', function(err) {
    console.error('Download error:', err);
  });
}

download(options, false);
