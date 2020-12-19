const express = require("express");
const router = express.Router();
const axios = require('axios');


const headers = {
    'Content-Type': 'application/json',
    'Authorization': process.env.NODE_ENV_AUTH,
}


var translatedLyrics = {

}


function searchSong(language,author,song){

    if(translatedLyrics[language]){
        if(translatedLyrics[language][author]){
            if(translatedLyrics[language][author][song]) return true
            else return false
        }
        else return false
    }
    else{
        return false
    }  
}


function saveNewSong(language,translation, author, song){

    if(!translatedLyrics[language])translatedLyrics[language] = {}

    if(!translatedLyrics[language][author])translatedLyrics[language][author] = {}

    translatedLyrics[language][author][song] = translation
    
}

router.post('/translate', (req, res) => {

    var author = req.body.author;
    var song = req.body.song;
    var language = req.body.language;

    if(searchSong(language,author,song)){
        console.log("ENTROOOOOOO")
        return res.json({spanishLyrics:translatedLyrics[language][author][song]})
    }
    else{

        if(req.body.lyrics!==""){
            axios.post('https://api-b2b.backenster.com/b1/api/v3/translate',{
                from: "en_GB",
                to: req.body.language,//"es_CO",de_DE
                data: req.body.lyrics,
                platform: "api"
            },{
                headers: headers
            })
            .then(result => {
                saveNewSong(language,result.data.targetTransliteration,author,song)
                
                return res.json({spanishLyrics:result.data.targetTransliteration})
            })
            .catch((error) => {
                console.log(error)
                return res.json({spanishLyrics:"error"})
            })
        }
        else{
            return res.json({spanishLyrics:""})
        }

    }


});

module.exports = router;
