import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsBellFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { Burger } from "@mantine/core";
// import { Sidebar } from '../components/Sidebar'

function Header() {
  const [opened, setOpened] = useState(false);
  const title = opened ? 'Close navigation' : 'Open navigation';
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  },[])
  
  return (
    <header className={`${isScrolled && 'backdrop-blur-xl bg-black/50'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <img 
          src="https://fayr-logo-v001.s3.eu-central-1.amazonaws.com/svg/fayr_logo_main.svg"
          width={50}
          height={50}
          className="cursor-pointer object-contain"
        />
        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">Home</li>
          <li className="headerLink">Live</li>
          <li className="headerLink">Movies</li>
          <li className="headerLink">Matches</li>
          <li className="headerLink">Schedule</li>
          <li className="headerLink">Watch List</li>
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="signup"
        >
          Sign up
        </button>
        {/* <BiSearch className="hidden h-6 w-6 sm:inline"/>
        <BsBellFill className="hidden h-6 w-6 sm:inline"/>
        <Link href="/account">
          <MdAccountCircle className="hidden h-6 w-6 sm:inline"/>
        </Link> */}
        <Burger
            color="#D9D9D9"
            size="sm"
            opened={opened}
            onClick={(Sidebar) => setOpened((o) => !o)}
            title="Menu"
          />
      </div>
    </header>
  )
}

export default Header