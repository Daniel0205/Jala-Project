
const Pool = require('pg-pool');

//////////////////////////////////////////////////////
/////CONFIGURACION DE LA PISCINA DE USUARIOS//////////
//////////////////////////////////////////////////////
var config = {
  user: process.env.NODE_ENV_USER, //env var: PGUSER
  database: process.env.NODE_ENV_DATABASE, //env var: PGDATABASE
  password: process.env.NODE_ENV_PASSWORD, //env var: PGPASSWORD
  host: process.env.NODE_ENV_HOST, // Server hosting the postgres database
  port: process.env.NODE_ENV_PORTDB, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

const pool = new Pool(config);
pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})


//export the query method for passing queries to the pool
function query(text, values, callback) {
  
  return pool.query(text, values, callback);
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
function connect(callback) {
  return pool.connect(callback);
};


/*
let str ='SELECT * from cliente WHERE true=$1';

connect(function(err, client, done) {
    if(err) {
        return console.error('error fetching client from pool', err);
        }
    //use the client for executing the query
     
     client.query(str,[true],(err, result)=> {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);

      if(err) {
          
          return console.error('error running query', err);
      }
      else{
        console.log(result)
      }
    });
  });

*/

module.exports.pool= pool;
module.exports.query = query;
module.exports.connect = connect;
