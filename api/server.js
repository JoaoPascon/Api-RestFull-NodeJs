const   express = require('express'),
        bodyParser = require('body-parser'),
        multiparty = require('connect-multiparty'),
        mongodb = require('mongodb'),
        objectId = require('mongodb').ObjectId,
        fs = require('fs');
// git teste

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(multiparty());

app.use(function(req, res, next){ // next é usado para após a impletação do middleware a função ser executada 

    res.setHeader("Access-Control-Allow-Origin", "*"); // Habilida requisição de dominios diferentes
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // pre configura que a origem pode requisitar (GET, PUT etc...)
    res.setHeader("Access-Control-Allow-Headers", "content-type"); //Habilita a possibilidade da origem resscrever as propriedades headers do request
    res.setHeader("Access-Control-Allow-Credentials", true); //
    next();
})

const port = 8080;

app.listen(port);

const db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}),
    {}
);

console.log("O servidor HTTP está ouvindo a porta " + port);

app.get('/', function(req, res){
    res.send({msg: 'Olá Postman'});
})

app.post('/api', function(req, res){

    const date = new Date();
    const time_stamp = date.getTime();
    const url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename; // inclusão do time stamp para garantir arquivo com urls/nomes diferentes

    const path_origem = req.files.arquivo.path;
    const path_destino = './uploads/' + url_imagem;
    

    fs.rename(path_origem, path_destino, function(err){
         if(err){
            res.status(500).json({error: err});
            return;
        }

        const data = {
            url_imagem: url_imagem,
            titulo: req.body.titulo
        } 

        db.open(function(err, mongoClient){
            mongoClient.collection('postagens', function(err, collection){
                collection.insert(data, function(err, records){
                    if(err){
                        res.json(err)
                    }else{
                        res.status(200).json({'status': 'Req realizada com sucesso !!!'})
                    }
                    mongoClient.close();
                })
            })
        })

    });
})

app.get('/imagens/:imagem', function(req, res){

    const img = req.params.imagem;

    fs.readFile('./uploads/' + img, function(err, content){
            if(err){
                res.status(400).json(err);
                return;
            }
            res.writeHead(200, {'content-type' : 'image/jpg' });
            res.end(content);

    });

})

app.get('/api', function(req, res){


    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.find().toArray(function(err, results){
                if(err){
                    res.json(err);
                }else{
                    res.json(results);
                }
                mongoClient.close();
            })
        })
    })
})

app.get('/api/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.find(objectId(req.params.id)).toArray(function(err, results){
                if(err){
                    res.json(err);
                }else{
                    res.json(results);
                 }
                mongoClient.close();
            })
        })
    })
})

app.put('/api/coments/:id', function(req, res){
    console.log(req.params.id)
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.update(
                { _id: objectId(req.params.id)},
                { $push : {
                        comentarios : {
                                id_comentario : new objectId(),
                                comentario : req.body.comentario
                        }
                         }
                },
                {},
                 function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                }
            )
             mongoClient.close();
        })
    })


})

app.put('/api/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.update(
                { _id: objectId(req.params.id)},
                { $set: {titulo: req.body.titulo}},
                {},
                 function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                }
            )
             mongoClient.close();
        })
    })
})

app.delete('/api/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.remove({ _id: objectId(req.params.id)}, function(err, result){
                if(err){
                    res.json(err);
                }else{
                    res.json(result);
                }
                 mongoClient.close();
            });
        })
    })
})

app.delete('/api/coments/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.update(
            { }, /*sem um elemento especifico para poder percorrer todos*/
            { $pull: {
                        comentarios : { id_comentario : objectId(req.params.id) }
                     }
            },
            {multi: true},
            function(err, result){
                if(err){
                    res.json(err);
                }else{
                    res.json(result);
                }
            mongoClient.close();
            });
        })
    }) 
})