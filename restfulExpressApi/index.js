const debug = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const  express = require('express');
const logger = require('./middleware/logger');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

const courses = require('./routes/courses');
const home = require('./routes/home');

app.set('view engine', 'pug');
app.set('views', './views'); //default


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);

app.use('/api/courses',courses);
app.use('/',home);

//Configuration
debug(`App Name: ${config.get('name')} - ${config.get('environment')}`);
debug('Mail Name: '+ config.get('mail.host'));
debug(`Mail password: ${config.get('mail.password')}`);

if(app.get('env') === 'development'){
	app.use(morgan('tiny'));
	debug('Morgan enabled...');
}

dbDebugger('Connected to the Database');

app.use(function(req, res, next){
	console.log('Authenticating...');
	next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));