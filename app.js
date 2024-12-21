const express = require('express');
const path = require('path');
const app = express();
const { logRequest } = require('./middlewares');
const { connectMongoDb } = require("./models/connection-string");
const PORT = process.env.PORT || 3000;

const ejsMate = require('ejs-mate');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const customerRouter = require('./routes/customer');
const productRouter = require('./routes/product');
const ledgerRouter = require('./routes/ledger');



connectMongoDb('mongodb://localhost:27017/invoicesDb');

// Middleware to serve static files from the assets folder
app.use('/assets', express.static(path.join(__dirname, 'assets/assets')));
app.use('/plugins', express.static(path.join(__dirname, 'assets/plugins')));

// Set the view engine (EJS example, but works with plain HTML too)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

// Middleware to parse JSON requests
app.use(express.json());



app.use(express.urlencoded({ extended: false }));
app.use(logRequest('log.txt'));
app.use("/", indexRouter);
app.use("/customer", customerRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/ledger", ledgerRouter);



// Handle 404 - Serve custom HTML page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
