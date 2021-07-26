const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
	const title = 'Welcome';
	res.render('index', { title: title });
});

// About route
app.get('/about', (req, res) => {
	res.render('about');
});

// Contactus rout
app.get('/contactus', (req, res) => {
	res.render('contactus');
})

const port = 5000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});