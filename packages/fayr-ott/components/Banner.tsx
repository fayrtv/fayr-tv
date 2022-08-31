import Image from "next/image"
import { useEffect, useState } from "react"
import { baseUrl } from "../constants/movie"
import { Movie } from "../typing"

interface Props {
    netflixOriginals: Movie[]
}

function Banner({ netflixOriginals }: Props) {
    const [movie, setMovie] = useState<Movie | null>(null)

    // useEffect(() => {
    //     setMovie(netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)])
    // },[netflixOriginals])

    return (
        <div>
            <div className="absolute top-0 left-0 h-[95vh] w-screen">
                <video 
                    src="https://share-videos.s3.amazonaws.com/development/00006/00006.mp4"
                    typeof="mp4"
                    autoPlay
                    muted
                    loop
                >

                </video>
                <h1>Schau dir das Training jetzt live an!</h1>
                <p>Test</p>
            </div>
        </div>
  )
}

export default Banner