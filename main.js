const express = require( 'express' );
const { engine } = require('express-handlebars');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {cors: {origin: "*"}});
const session = require('express-session');
const process = require('process')
const { PORT }  = require('./enviroments/enviroment');
const prodRouter = require('./routes/prodRouter');
const {products} = require('./class/prodClass');
const { chats} = require('./class/chatClass');
const connectToDb = require('./DB/config/connectToDb');
const passport = require('passport')
const { fork } = require('child_process');
const cluster = require('cluster');
const compression = require('compression');
const logger = require('./logger/logger');
const numCPUs = require('os').cpus().length;
const randomNumbers = require('./routes/child/randoms');
const benchmark = require('./autocannon/autocannon');

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use(session({connectToDb, secret: 'secreto1', resave: true, saveUninitialized: true}));
app.use(passport.initialize())
app.use(passport.session())

httpServer.on('error', (error) => {
  logger.error('ocurrio un error: ', error);
});

//HANDLEBARS
app.set('views', './views/hbs/partials');
app.set("view engine", "handlebars");
app.engine("handlebars", engine({
  extname: '.hbs',
  defaultLayout: 'main.handlebars',
  layoutsDir: __dirname + '/views/hbs/layouts',
  partialsDir: __dirname + '/views/hbs/partials'
}));


app.get('/', async (req, res) => {
    res.render('form', {product: products, productExist: true});
  });

  app.get('/info', compression(), (req, res) => {
    const datos = {
      'carpeta de proyecto': process.cwd(),
      'plataforma': process.platform,
      'version de node': process.version,
      'memoria reservada': process.memoryUsage().heapTotal,
      'process id': process.pid,
      'numero de procesadores' : numCPUs,
  
    }
    res.send(JSON.stringify({datos, },null,2))
    logger.info(`Ruta: /info, metodo: ${req.method}`)
  })

  app.get('/api/randoms', (req, res) => {
    const cant = req.query.cant || 100000000;
    
      const results = {};
      for (let i = 0; i < cant; i++) {
        const num = Math.floor(Math.random() * 1000) + 1;
        results[num] = (results[num] || 0) + 1;
      }
      
    
   res.json(JSON.stringify(results, null, 2));
    
    logger.info(`Ruta: /api/randoms, metodo: ${req.method}, data: ${JSON.stringify(results)}`)
    
  });
  
  
//socket
io.on('connection', async socket => {
  console.log(`New connection id: ${socket.id}`);

//tabla productos
  socket.emit('products', await products.getArray())
  

// nuevo producto
  socket.on('newProduct', async (product) => {
    products.add(product);
    await io.sockets.emit('products', products)

  });

  //tabla chat
  socket.emit('chat', await chats.getArray())
  
  //nuevo chat
  socket.on('newMessage', async (msg) => {
    chats.add(msg)
    io.sockets.emit('chat', await chats.getArray())
  });
  
  


})



app.use('/api', prodRouter)

let mode = 'FORK';

if (process.argv.length > 2) {

  const procArgv = process.argv[2].toUpperCase();
  if (procArgv === 'CLUSTER') {
    mode = 'CLUSTER';
  }
}

if (mode === 'CLUSTER') {
  if (cluster.isPrimary) {
  
    const numCPUs = require('os').cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`PRocess ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    
    httpServer.listen(PORT, () => {
      console.log(`Servidor en modo cluster corriendo en el proceso ${process.pid}`);
    });
  }
} else {

  httpServer.listen(PORT, () => {
    benchmark();
    console.log(`Servidor en modo fork corriendo en el proceso ${process.pid}`);
  });
}


