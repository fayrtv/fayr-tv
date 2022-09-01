import { useEffect, useState } from "react"
import { Movie } from "../typing"
import Video from "next/"

interface Props {
    netflixOriginals: Movie[]
}

function Banner({ netflixOriginals }: Props) {
    const [movie, setMovie] = useState<Movie | null>(null)

    return (
        <div>
            <div className="absolute top-0 left-0 w-fill">
                <video 
                    src="https://share-videos.s3.amazonaws.com/development/00006/00006.mp4"
                    typeof="mp4"
                    autoPlay
                    muted
                    loop
                />
                <div className="heroslide">
                {/* <div className="absolute drop-shadow-lg lg:inset-x-0 lg:bottom-80 lg:left-20 md:inset-x-0 md:bottom-90 md:left-10"> */}
                {/* <div className="absolute drop-shadow-lg lg:inset-x-0 lg:bottom-80 lg:left-20 md:inset-x-0 md:bottom-90 md:left-10"> */}
                    <h1 className="text-xl lg:text-5xl">
                        Training - Saison 22/23
                    </h1>
                    <p className="text-sm lg:text-2xl">
                        Vorbereitung auf das Spiel am
                    </p>
                    <button
                        type='button'
                        className="inline-flex font-winnersansbold items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-[#07090C] bg-[#FA7751] hover:bg-[#07090C] hover:text-[#FA7751] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#07090C]"
                    >
                    PLAY
                    </button>
                </div>
            </div>
            
        </div>
  )
}

export default Banner