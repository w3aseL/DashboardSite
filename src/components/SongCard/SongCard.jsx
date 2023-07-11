import React from "react"
import PropTypes from "prop-types"
import { Card, Container, Row, Col } from "reactstrap"

const SongCard = props => {
  const { song, cardTitle } = props

  var albumArtwork = "", title = ""

  if(song.albums && song.albums.length > 0)
    albumArtwork = song.albums[0].artworkUrl
  else if(song.album)
    albumArtwork = song.album.artworkURL

  if(song.title)
    title = song.title
  else if(song.name)
    title = song.name

  return (
    <Card>
      <Container>
        <Row className="d-flex">
          <h3 className="w-100 text-center mb-0">{cardTitle}</h3>
          <hr className="mt-1 w-100" />
          <Col md="4" className="ml-auto mr-auto d-flex mb-3">
            <img
              src={albumArtwork}
              style={{ maxWidth: "100%", alignSelf: "center" }}
              alt="albumArtwork"
            />
          </Col>
          <Col md="8" className="ml-auto mr-auto d-flex flex-column mb-3">
            <h4 className="mb-2"><em>{title}</em></h4>
            <p className="mb-2">{song.artists.map((artist, i) => (artist.name + (song.artists.length-1 > i ? ", " : "")))}</p>
            {song.albums && song.albums.length > 0 ?
              <p className="mb-2">{song.albums[0].title}</p>
              : null}
            {song.album ?
              <p className="mb-2">{song.album.name}</p>
            : null}
          </Col>
        </Row>
      </Container>
    </Card>
  )
}

SongCard.propTypes = {
  song: PropTypes.object.isRequired,
  cardTitle: PropTypes.string.isRequired
}

export { SongCard }

export default SongCard