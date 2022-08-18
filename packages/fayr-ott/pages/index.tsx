import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="relative h-[140vh]">
      <Head>
        <title>FAYR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header/>

      <main>
        <section>

        </section>
      </main>
    </div>
  )
}

export default Home
