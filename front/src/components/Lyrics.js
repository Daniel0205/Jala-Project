import {React,useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import SnackbarMesssages from './SnackbarMesssages';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Lyrics() {
    const classes = useStyles();
    const [author,setAuthor] = useState("");
    const [song,setSong] = useState("");
    const [lyrics,setLyrics] = useState("");
    const [spanishLyrics,setSpanishLyrics] = useState("");
    const [words,setWords] = useState(0);
    const [lines,setLines] = useState(0);

    const [msj, setMsj] = useState("");
    const [language, setLanguage] = useState("es_CO");
  
    //Solicitar sonteo de lineas y palabras al backend
    useEffect(()=>{
       
        axios.post('http://localhost:8000/count',{
            lyrics: lyrics
        })
        .then(res => {
            if(res.status===200){
                setLines(res.data.lines)
                setWords(res.data.words)
            }            
        })
        .catch((error) => {
            setMsj('there was an error while the lines and words were being counted!')
        })
    }
    ,[lyrics])

   //Realizar Traduccion cuando cambia la variable de estado lyrics
    useEffect(()=>{
       
        axios.post('http://localhost:8000/translate',{
            lyrics: lyrics,
            author: author,
            song: song,
            language: language,
        })
        .then(res => {
            if(res.status===200){
                setSpanishLyrics(res.data.spanishLyrics)
            }            
        })
        .catch((error) => {
            setMsj('There was an error while translating the song!')
        })
    }
    ,[lyrics,language])


    //Funcion para solicitar la lyrics a la API 
    function requestLyrics(){
        
        var newAuthor = author.replace(/ /g,"%20");
        var newSong = song.replace(/ /g,"%20");

        let URL = 'https://api.lyrics.ovh/v1/'+newAuthor+"/"+newSong
    
        axios.get(URL)
        .then(res => {
            
            if(res.status===200){
                if(res.data.lyrics!==""){
                    setLyrics(res.data.lyrics)
                }
                else{
                    setMsj('The song could not be found! :(')
                }                
            }            
        })
        .catch((error) => {
            setMsj('There was an error while searching the song!')
        })
    }

    return (
      <Container component="main" maxWidth="xs">          
        <SnackbarMesssages
            onClose={()=>setMsj('')}
            variant="error" 
            message={msj}/>
        <CssBaseline />
        
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LibraryMusicIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Lyrics App
          </Typography>
          
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Author"
              label="Author"
              name="Author"
              autoComplete="Author"
              autoFocus
              value={author}
              onChange={(x)=>setAuthor(x.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="Song"
              label="Song"
              type="Song"
              id="Song"
              autoComplete="current-Song"
              value={song}
              onChange={(x)=>setSong(x.target.value)}
            />
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Language</InputLabel>
                    <Select
                    native
                    value={language}
                    onChange={(x)=>setLanguage(x.target.value)}
                    label="Language"
                    inputProps={{
                        name: 'Language',
                        id: 'outlined-age-native-simple',
                    }}
                    >
                    <option value={"es_CO"}>English</option>
                    <option value={"de_DE"}>German</option>
                    </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={requestLyrics}
              disabled={author==="" || song===""}
            >
              Request Lyrics
            </Button>
          
        </div>

        <TextareaAutosize rowsMax={6} value={lyrics}  rowsMin={3} placeholder="English Lyrics" />

        <Typography component="h3" variant="h6">
        Stats:    This Song has {words}  and  {lines}  lines
        </Typography>
        

        <TextareaAutosize rowsMax={6} value={spanishLyrics} rowsMin={3} placeholder="Spanish Lyrics" />

      </Container>
    );
  }