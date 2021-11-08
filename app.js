const express=require('express')
const bodyParser=require('body-parser')
const mysql=require('mysql')
const handlebars=require('express-handlebars')
const app=express()
const urlencodeParser=bodyParser.urlencoded({extended:false})
const sql=mysql.createPool({
  user: 'bc9c55280dd00b',
  password: '15e9f459',
  host: 'us-cdbr-east-04.cleardb.com',
  database: 'heroku_0a37439edd2efc4',
})

let port = process.env.PORT || 3000

// Template engine
app.engine("handlebars", handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Routes and Templates
app.get("/", function(req, res) {res.render('index')})

app.use("/js", express.static('js'))
app.use("/img", express.static('img'))
app.use("/css", express.static('css'))

app.get("/inserir", function(req, res) { res.render("inserir")})

app.post("/inserir", urlencodeParser, function(req, res) {
  sql.getConnection(function(err, connection) {
      connection.query("insert into biblioteca values (?,?,?,?,?,?,?)", [req.body.isbn, req.body.nome, req.body.autor, req.body.edicao, req.body.categoria,  req.body.editora,req.body.local])
      res.render('inserir')
  })
})

app.get("/select/:isbn?", function(req, res) { 
  if(!req.params.isbn) {
    sql.getConnection(function(err, connection) {
      connection.query("select * from biblioteca", function(err,results,fields) {
      res.render('select', {data: results})
    })
    })
  }
})

app.get("/delete/:isbn?", function(req, res) { 
  sql.getConnection(function(err, connection) {
    connection.query("delete from biblioteca where isbn=?", [req.params.isbn])
    res.render('delete')
  })
})

app.get("/update/:isbn?", function(req, res) { 
  sql.getConnection(function(err, connection) {
  connection.query("select * from biblioteca where isbn=?", [req.params.isbn], function(err, results, fields) {
    res.render("update", {isbn:req.params.isbn, nome: results[0].nome, autor: results[0].autor, edicao: results[0].edicao, categoria: results[0].categoria, editora: results[0].editora, local: results[0].local})
  })
})
})

app.post("/select/:isbn?", urlencodeParser, function(req, res) {
  sql.getConnection(function(err, connection) {
  connection.query("update biblioteca set nome=?, autor=?, edicao=?, categoria=?, editora=?, local=? where isbn=? ", [ req.body.nome, req.body.autor, req.body.edicao, req.body.categoria,  req.body.editora,req.body.local, req.body.isbn])
 
  if(!req.params.isbn) {
    sql.getConnection(function(err, connection) {
    connection.query("select * from biblioteca", function(err,results,fields) {
    res.render('select', {data: results})
    })
  })
  }
  
})
})
// Start server
app.listen(port, function(req, res) {console.log("Servidor rodando 🚀")})