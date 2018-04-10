const express = require('express'),
    bodyParser = require('body-parser');    

const app = express();
const PORT = process.env.PORT || 1313;

const routes = require('./app/routes/routes');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(routes);
app.use(express.static("app/public"));

const exphbs = require('express-handlebars');


app.set('view engine', 'handlebars');
app.set("views", 'app/views');

app.engine('handlebars', exphbs({
    extname: 'handlebars',
    defaultLayout: 'main.handlebars',
    layoutsDir: 'app/views/layouts',
    partialsDir: 'app/views/partials'
}));


app.listen(PORT, () => {
    console.log('App listening on PORT ' + PORT);
});