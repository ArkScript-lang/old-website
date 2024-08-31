const express = require('express');

require('./main');

const app = express();
app.use('/', express.static('.'));
app.listen(3000, () => console.log('ArkScript website is listening on port 3000.'));
