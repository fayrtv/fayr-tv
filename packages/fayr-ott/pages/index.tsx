import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/Banner'
import Header from '../components/Header'
import { Movie } from '../typing'
import requests from '../utils/requests'

interface Props {
  netflixOriginals: Movie[]
  trendingNow: Movie[]
  topRated: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaries: Movie[]
}

const Home= ({   
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  
}: Props) => {
  return (
    <div className="relative h-screen bg-gradient-to-b from-[#07090C] to-[#07090C] lg:h-[200vh]">
      <Head>
        <title>FAYR | OTT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header/>

      <main>
        <Banner netflixOriginals={netflixOriginals}/>

        <section>

        </section>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ])

  return {
    props: {
      netflixOriginals: netflixOriginals.results || null,
      trendingNow: trendingNow.results || null,
      topRated: topRated.results || null,
      actionMovies: actionMovies.results || null,
      comedyMovies: comedyMovies.results || null,
      horrorMovies: horrorMovies.results || null,
      romanceMovies: romanceMovies.results || null,
      documentaries: documentaries.results || null,
    },
  }
}