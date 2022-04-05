import React from "react";

export default function FayrLogo(props: React.HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="https://fayr-logo-v001.s3.eu-central-1.amazonaws.com/svg/fayr_logo_main.svg"
            className="h-8 w-auto"
            alt="FAYR TV Logo"
            style={{ border: "none" }}
            {...props}
        />
    );
}
