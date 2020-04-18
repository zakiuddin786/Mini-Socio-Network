const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname+'/dist/network'));

app.get('/', function(req,res) {
    
res.sendFile(path.join(__dirname, '/dist/network/index.html'));
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`socio network listening on port ${PORT}!`));
