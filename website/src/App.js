import './App.css';
import {useEffect, useState} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function App() {

  const CLIENT_ID = 'YOUR_CLIENT_ID'
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = 'playlist-read-private playlist-modify-private playlist-modify-public'

  let [token, setToken] = useState("")
  const [songs, setArtists ] = useState([])
  let [playlistId, setPlaylist] = useState("")
  const [playlists, setAllPlaylists] = useState([])
  let [genre, setGenres] = useState("")
  const [allGenres, setAllGenres] = useState([])

  useEffect(() => {
    
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")
      let playlistId = window.localStorage.getItem("playlist_id")

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)

  }, [])

  const logout = () => {
      setToken("")
      setPlaylist("")
      setGenres("")
      window.localStorage.removeItem("token")
      window.localStorage.removeItem("playlist_id")
      window.localStorage.removeItem("genre")
      window.location.reload()
  }

  const getSong = async () => {

    const token = window.localStorage.getItem("token")
    var genre = window.localStorage.getItem('genre')

    if (genre == null) genre = 'pop'
  
    const {data} = await axios.get("https://api.spotify.com/v1/recommendations", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            limit: 1,
            seed_genres: genre 
        }
    })

    setArtists(data.tracks)
    console.log(data)
    
  }

  const renderSongData = () => {

    return songs.map( songs => (

        <div className="viewContainer">


          <div className="songContainer">

          <div className="imgCont">
            <img alt='Album Cover' className="albumCover" src={songs.album.images[0].url}></img>
          </div>

          <br></br>

        <a className="songTite" href={songs.external_urls.spotify} target="_blank" rel="noreferrer" title="Open in Spotify">{songs.name}</a>

        <p className="songArtist">{songs.artists[0].name}</p>

        </div>
        </div>

    ))
  }

  const renderButtons = () => {
    return (
      <div className="likeContainer">

          <button className="fa fa-solid fa-ban fa-4x dislikeBtn" onClick={getSong}></button>

          <iframe title="Song Embed" style={{borderRadius: 13}} src={"https://open.spotify.com/embed/track/" + songs[0].id} width="80" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>

          <button className="fa fa-solid fa-heart fa-4x heartBtn" onClick={() => {
              const token = window.localStorage.getItem("token")
              const playlistId = window.localStorage.getItem("playlist_id")
          

              fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?`+ new URLSearchParams({
                uris: songs[0].uri,
                }), {
                method: 'POST',
                headers: new Headers({
                  'Authorization': `Bearer ${token}`
                })
              }).then(() => {
                getSong()
              })
        
          }}></button>

          </div>

    )
  }

  const renderPlaylists = () => { 
    return playlists.map( playlists => (
      <div className="playistCont" key={playlists.id} id={playlists.id} onClick={(e) => {

        let playlistId = window.localStorage.getItem("playlist_id")
        console.log(e.currentTarget.id)

        if (!playlistId) {
          playlistId = e.currentTarget.id

            window.location.hash = ""
            window.localStorage.setItem("playlist_id", playlistId)
        }

        setPlaylist(e.currentTarget.id)
        console.log(window.localStorage.getItem("playlist_id"))


      }}>
        <img src={playlists.images[0].url} className="playlistImage" alt='Playlist Cover'></img>
        <p className="playlistTitle"><span>{playlists.name}</span></p>
      </div>
    ))
   }

  const getPlaylists = async () => {

    const token = window.localStorage.getItem("token")
  
    const {data} = await axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
          limit: 20
        }
    })

    setAllPlaylists(data.items)

  }

  const renderGenres = () => {

    return allGenres.map( genre => (
      <div className="genreCont" key={genre} id={genre} onClick={(e) => {

        let genre = window.localStorage.getItem("genre")
        console.log(e.currentTarget.id)

        if (!genre) {
          genre = e.currentTarget.id

            window.location.hash = ""
            window.localStorage.setItem("genre", genre)
        }

        setGenres(e.currentTarget.id)
        console.log(window.localStorage.getItem("genre"))


      }}>
        <p className="genreTitle">{genre}</p>
      </div>
    ))

  }

  const getAllGenres = async () => {

    const token = window.localStorage.getItem("token")
  
    const {data} = await axios.get("	https://api.spotify.com/v1/recommendations/available-genre-seeds", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    setAllGenres(data.genres)

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
               getAllGenres().then(() => {
                  getPlaylists().then(() => {
                    getSong().then(() => {
                      console.log('ok')
                    })
                  })
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

  return (
    <div className="App">
      <script src="https://sdk.scdn.co/spotify-player.js"></script>
      <script src='https://kit.fontawesome.com/764149e8dd.js'></script>
      <header className="App-header">
        <p className="HeaderText">
          Spotinder
        </p>
        <br></br>
        <br></br>
        <br></br>

      </header>

      <div className="body">

      {!genre?
        renderGenres(): <p style={{ display: 'none' }}></p>
      }

        {!playlistId && genre? 
          renderPlaylists(): <p style={{ display: 'none' }}></p>
        }

        {playlistId? renderSongData(): <p style={{ display: 'none' }}></p>}

      {playlistId?
        renderButtons(): <p style={{ display: 'none' }}></p>
      }

          {!token ?
          <a className="login" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`}>Login to Spotify</a>: <button className="logout" onClick={logout}>Reset</button>}
       
            

        <br>
        </br>
      </div>

    </div>
  );
}

export default App;