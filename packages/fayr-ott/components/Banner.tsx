import { useEffect, useState } from "react"
import { Movie } from "../typing"
import Video from "next/"
import { IoMdPlay } from 'react-icons/io';
import { HiOutlineInformationCircle } from 'react-icons/hi';

interface Props {
    netflixOriginals: Movie[]
}

function Banner({ netflixOriginals }: Props) {
    const [movie, setMovie] = useState<Movie | null>(null)

    return (
        <div className="flex flex-col space-y-2 py-16 md:space-y-4 lgh-[65vh] lg:justify-end lg:pb-12">
            {/* <div> */}
            <div className="absolute top-0 left-0 w-fill">
                <video 
                    src="https://share-videos.s3.amazonaws.com/development/00006/00006.mp4"
                    typeof="mp4"
                    autoPlay
                    muted
                    loop
                />
                <div className="heroslide">
                    <h1 className="text-xl lg:text-5xl">
                        Training - Saison 22/23
                    </h1>
                    <p className="text-sm lg:text-2xl my-2">
                        Vorbereitung auf das Spiel am
                    </p>
                    <button
                        className="calltoaction"
                    >
                    <IoMdPlay
                        className="mx-1 lg:mx-2"
                    />
                    PLAY
                    </button>
                    <button
                        className="infobutton"
                    >
                    <HiOutlineInformationCircle
                        className="mx-1 lg:mx-2"
                    />
                    INFO
                    </button>
                </div>
            </div>
            
        </div>
  )
}

export default Banner