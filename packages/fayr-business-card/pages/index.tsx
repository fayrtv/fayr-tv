import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ContactsBlock from '../components/ContactsBlock'
import Header from '../components/Header'
import InfoBlock from '../components/InfoBlock'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>FAYR | Tin Votan</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center">

       <Header/>

        <InfoBlock/>

        {/* <ContactsBlock/> */}
        
      </main>
    </div>
  )
}

export default Home
