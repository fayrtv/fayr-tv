import React from 'react'

function Block() {
  return (
    <div className="fixed w-10/12 pt-14 items-center justify-around text-base font-sfproregular bg-[#141A24]">

      <img
        src="https://fayr-image-library.s3.eu-central-1.amazonaws.com/team-pictures/profil_pic.png"
        width="30%"
        className="inline-flex items-center justify-center rounded-full p-3"
      />
          <a
            href="https://vcard.link/card/DC3r.vcf"
            className="px-6 pb-8 text-left"
          >
            
            <h3 className="text-lg mx-8 font-sfprobold">
              Tin Votan
            </h3>

            <p className="mt-1 mx-8">
              CEO & Founder
            </p>

            <p className="mt-1 mx-8">
              FAYR GmbH
            </p>
            
          </a>
    </div>
  )
}

export default Block