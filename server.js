require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require ('mongoose');
const bodyParser = require("body-parser");
const dns = require ('dns');
const urlparser = require ('url');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI , { useNewUrlParser: true, useUnifiedTopology: true });

const schema = new mongoose.Schema({
  url:'string',
})

const Url = mongoose.model('url',schema)

app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post('/api/shorturl',async (req,res) =>{
  try{
    const bodyurl = req.body.url
    const something = dns.lookup(urlparser.parse(bodyurl).hostname,
    (error,address)=> {
      if(!address){
        res.json({error:'invalid Url'})
      }else{
   const url = new Url({url:bodyurl})
   url.save((err,data) =>{
    res.json({
      original_url : data.url,
      short_url : data.id
    })
   })
        
      }
    })
  } catch(e){
    console.log(e)
  }
  })

app.get('/api/shorturl/:id', function(req, res) {
  const id = req.params.id;
  Url.findById(id,(err,data)=>{
    if(!data){
      res.json({error:"invlid Url"})
    }else{
      res.redirect(data.url)
    }
  })
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

