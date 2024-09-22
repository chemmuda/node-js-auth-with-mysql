
const express = require('express');
const app = express();

const PORT = process.env.PORT || 7500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



