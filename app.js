const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');


const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to monogoose
mongoose.connect('mongodb://localhost/idea-dev', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log('MongoDb connected...'))
	.catch(err => console.log(err));

// Load Idea Mode
require('./models/Idea');
const Idea = mongoose.model('ideas');



// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override middleware for put requests
app.use(methodOverride('_method'));





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
});

// Idea Index page
app.get('/ideas', (req, res) => {
	Idea.find({})
		.lean()	// resolve the error : Access has been denied to resolve the property "title" because it is not an "own property" of its parent.
		.sort({ date: 'desc' })
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			});
		});
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.lean()
		.then(idea => {
			res.render('ideas/edit', {
				idea: idea
			});
		});
});

// Process the Add form
app.post('/ideas', (req, res) => {
	let errors = [];
	if (!req.body.title) {
		errors.push({ text: 'Please add a title.' });
	}
	if (!req.body.details) {
		errors.push({ text: 'Please add some details' });
	}

	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details
		}

		new Idea(newUser)
			.save()
			.then(idea => {
				res.redirect('/ideas');
			})
	}
});

// Edit Form Process
app.put('/ideas/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			// New values
			idea.title = req.body.title;
			idea.details = req.body.details;

			idea.save()
				.then(idea => {
					res.redirect('/ideas');
				})
		});
});


// Delete Idea
app.delete('/ideas/:id', (req, res) => {
	Idea.deleteOne({_id: req.params.id})
	.then(() => {
		res.redirect('/ideas');
	});
});

const port = 5000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});