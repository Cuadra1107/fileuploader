const fs = require('fs')
var express = require('express');
var cors = require('cors')
const fileUpload = require('express-fileupload');

var app = express();

app.use(cors());

app.use(fileUpload({
    createParentPath:true,
    abortOnLimit:true,
    responseOnLimit:'{"message":"File size limit has been reached"}',
    limits: {
        fileSize: 52428800000 //52GB
    }
}));

app.use('/files',express.static('files'));

app.get('/', function (req, res) {
    res.send('{"version":"0.0.1"}');
});


app.post('/upload', function(req, res) {
    let document;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({"message":"no files were uploaded"});
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    document = req.files.document;

    md5Token = req.files.document.md5;

    uploadPath = __dirname + '/files/'+md5Token+'/' + document.name;
    staticUrl = "/files/"+md5Token+"/"+document.name;
    // Use the mv() method to place the file somewhere on your server
    document.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send({error:err});
  
      res.status(200).send({"message":"File uploaded!","fileUrl":staticUrl});
      console.log("Archivo subido a "+staticUrl);
    });
  });
  

app.listen(5050, function () {
    console.log('listening on port 5050!');
});