const express = require("express");
const router = express.Router();
const axios = require('axios');


const headers = {
    'Content-Type': 'application/json',
    'Authorization': process.env.NODE_ENV_AUTH,
}


var translatedLyrics = {}


function searchAuthor(author){
    if(translatedLyrics[author]) return true
    else return false
}


function searchSong(author,song){

    if(searchAuthor(author)){
        if(translatedLyrics[author][song]) return true
        else return false
    }
    else return false
}


function saveNewSong(translation, author, song){
    
    if(!searchAuthor(author))translatedLyrics[author] = {}
    translatedLyrics[author][song] = translation
    
}

router.post('/translate', (req, res) => {

    var author = req.body.author;
    var song = req.body.song;

    if(searchSong(author,song)){
        return res.json({spanishLyrics:translatedLyrics[author][song]})
    }
    else{

        if(req.body.lyrics!==""){
            axios.post('https://api-b2b.backenster.com/b1/api/v3/translate',{
                from: "en_GB",
                to: "es_CO",
                data: req.body.lyrics,
                platform: "api"
            },{
                headers: headers
            })
            .then(result => {
                saveNewSong(result.data.targetTransliteration,author,song)
                
                return res.json({spanishLyrics:result.data.targetTransliteration})
            })
            .catch((error) => {
                return res.json({spanishLyrics:"error"})
            })
        }
        else{
            return res.json({spanishLyrics:""})
        }

    }


});

module.exports = router;
