const express = require('express');
const path = require('path');
const app = express();
const { logRequest } = require('./middlewares');
const { connectMongoDb } = require("./connection");
const PORT = process.env.PORT || 3000;

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');



connectMongoDb('mongodb://localhost:27017/invoiceDb');

// Middleware to serve static files from the assets folder
app.use('/assets', express.static(path.join(__dirname, 'assets/assets')));
app.use('/plugins', express.static(path.join(__dirname, 'assets/plugins')));

// Set the view engine (EJS example, but works with plain HTML too)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON requests
// app.use(express.json());




// Define some sample routes
// app.get('/', (req, res) => {
//     res.send('Welcome to the homepage!');
// });

// app.get('/about', (req, res) => {
//     res.send('This is the about page.');
// });



app.use(express.urlencoded({ extended: false }));
app.use(logRequest('log.txt'));
app.use("/", indexRouter);
// app.use("/user", userRouter);



// Handle 404 - Serve custom HTML page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
