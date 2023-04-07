const express = require('express');
const app = express();
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { handleApiLoaded, MapComponent } = require('./server/googleplaces');

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
