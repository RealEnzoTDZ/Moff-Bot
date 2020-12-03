const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const crypto = require('crypto');
const { execSync } = require('child_process');

app.post('/git', (req, res) => {
  const hmac = crypto.createHmac('sha1', process.env.SECRET);
  const sig  = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  if (req.headers['x-github-event'] === 'push' &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(req.headers['x-hub-signature']))) {
    res.sendStatus(200);
    const commands = ['git fetch https://github.com/RealEnzoTDZ/Moff-Bot.git',
                      'git reset --hard https://github.com/RealEnzoTDZ/Moff-Bot.git',
                      'git pull https://github.com/RealEnzoTDZ/Moff-Bot.git --force',
                      'npm install',
                      // your build commands here
                      'refresh']; // fixes glitch ui
    for (const cmd of commands) {
      console.log(execSync(cmd).toString());
    }
    console.log('updated with origin/master!');
    return;
  } else {
    console.log('webhook signature incorrect!');
    return res.sendStatus(403);
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
