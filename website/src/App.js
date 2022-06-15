import './App.css';
import {useEffect, useState} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';

const randNum = Math.floor(Math.random() * 100)
const randomOffset = Math.floor(Math.random() * randNum);

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function App() {

  const CLIENT_ID = "3f95c02bbe114a0ab91b09552fedb230"
  const REDIRECT_URI = "https://spotinder.dickey.gg"
  // const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  let [token, setToken] = useState("")
  const [songs, setArtists ] = useState([])

  useEffect(() => {
    
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)

  }, [])

  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token")
  }

  const getSong = async () => {

    const token = window.localStorage.getItem("token")

    const letterList = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    const letter = letterList[Math.floor(Math.random() * letterList.length)]
  
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: getRandomSearch(),
            type: "track",
            limit: 1,
            offset: randomOffset
        }
    })

    setArtists(data.tracks.items)
    // console.log(data.tracks.items)
    
  }

  const renderSongData = () => {

    if (songs === []) {
      getSong().then(() => {
        return songs.map( songs => (

          // {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
          // {artist.name}


      <div className="songContainer">

    
    
        <div className="imgCont">
          <img alt='Album Cover' className="albumCover" src={songs.album.images[0].url}></img>
        </div>

      <p className="songTite">{songs.name}</p>

      <p className="songArtist">{songs.artists[0].name}</p>

        <div className="likeContainer">

        <button className="fa fa-solid fa-ban fa-5x dislikeBtn" onClick={getSong}></button>

                <a href={songs.external_urls.spotify} target='_blank' class="icon" title="Play on Spotify">
                  <i class="fa fa-play fa-5x"></i>
                </a>
       
        <button className="fa fa-solid fa-heart fa-5x heartBtn" onClick={getSong}></button>

        </div>

      </div>

  ))
      })
    } 

    return songs.map( songs => (

            // {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
            // {artist.name}


        <div className="songContainer">

      
      
          <div className="imgCont">
            <img alt='Album Cover' className="albumCover" src={songs.album.images[0].url}></img>
          </div>

        <p className="songTite">{songs.name}</p>

        <p className="songArtist">{songs.artists[0].name}</p>

          <div className="likeContainer">

          <button className="fa fa-solid fa-ban fa-5x dislikeBtn" onClick={getSong}></button>

                  <a href={songs.external_urls.spotify} target='_blank' class="icon" title="Play on Spotify">
                    <i class="fa fa-play fa-5x"></i>
                  </a>
         
          <button className="fa fa-solid fa-heart fa-5x heartBtn" onClick={getSong}></button>

          </div>

        </div>

    ))
  }

  useEffect(() => {
    const onPageLoad = () => {

      sleep(100).then(() => {

        const hash = window.location.hash
             let token = window.localStorage.getItem("token")
       
             if (!token && hash) {
                 token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
       
                 window.location.hash = ""
                 window.localStorage.setItem("token", token)
             }
       
             setToken(token)

             sleep(200).then(() => {
               getSong().then(() => {
                 console.log('ok')
               })
             })

      })

    };
    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);


  // getSong()

  return (
    <div className="App">
      <script src="https://sdk.scdn.co/spotify-player.js"></script>
      <script src='https://kit.fontawesome.com/764149e8dd.js'></script>
      <header className="App-header">
        <p className="HeaderText">
          Spotify Tinder
        </p>
        
        <br></br>
        <br></br>
        <br></br>

        {renderSongData()}

          {!token ?
          <a className="login" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>: <button className="logout" onClick={logout}>Logout</button>}
       
            

        <br>
        </br>
        <br></br>
        <br>
        </br>
        <br></br>
        <br>
        </br>
        <br></br>
      </header>
    </div>
  );
}

export default App;

// Functions

function getRandomSearch() {
  // A list of all characters that can be chosen.
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  // Gets a random character from the characters string.
  const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));

  return randomCharacter;
}