
import express from 'express';
import osprey from 'osprey'; // the RAML api engine
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
var cookieParser = require('cookie-parser');
var session = require('express-session');
const logger = require('./server/utils/logger').logger;
process.env["NODE_CONFIG_DIR"] = __dirname + "/server/config/";
let config = require('config').get('development');
let sessionSecret = require('config').get('SECRET_SESSION');

var ramlFile = config.ramlPath; // RAML file path

const ramlConfig = {
  "server": {
    "notFoundHandler": false
  },
  "disableErrorInterception": true
};

const errorChecker = (err, req, res, next) => {
  if (err) {
    let _err;
      _err = "ERROR: Validation failed. ";    
    logger.error(`Error in errorchecker `+ err.stack);
    res.status(400);
    return res.json({
      status: "failure",
      "message": _err
    });
  } else {
    return next();
  }
}

const customNotFoundHandler = (req, res, next) => {
    if (req.resourcePath) {
      return next()
    } else {
      logger.error(`The path ${req.path} is not found`);
      res.status(404);
      return res.json({
        status: "failure",
        "message": `The path ${req.path} is not found`
      });
    }
  }

initServer();


function initServer() {
  osprey.loadFile(ramlFile, ramlConfig)
    .then(function (middleware) {

      //Instantiate the app.
      const app = express();

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({
        extended: true
      }));
      app.use(cookieParser());
      app.use(session({
        key: 'test',
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        // cookie: {
        //     expires: 600000
        // }
      }));
    
    
      app.use(express.static(__dirname + '/client'));
      var router = osprey.Router();

      app.get('/', function(req, res){
        res.sendfile('./client/index.html');
       });
      // set up all the routes found in the routes directory
      var routes = require('./server/routes')(router);

      // Mount the RAML middleware at our base /api/v1
      app.use(middleware, routes);

      app.use(customNotFoundHandler);
      app.use(errorChecker);
      mongoose.connect(config.database,(err) => {       //Database Connection 
        if(err){
          logger.error(err);
        }else{
          logger.info("database successfully connected");
          var server = app.listen((process.env.PORT || config.port), () => {
            logger.info(`Server running at http://localhost:${server.address().port}`);
          });
        }
      });
  })
    .catch(function (e) {
      logger.error("Error: %s", e.stack);
      process.exit(1)
    });
}
