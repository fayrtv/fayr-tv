import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as config from '../../config';
import React, {useEffect, useRef} from 'react';


function VideoPlayer(options) {
    const divEl = useRef(null);
    const videoEl = useRef(null);

    useEffect(() => {

            const script = document.createElement('script');

            script.src = 'https://player.live-video.net/1.2.0/amazon-ivs-player.min.js';
            script.async = true;

            document.body.appendChild(script);

            script.onload = () => {
                // eslint-disable-next-line no-undef
                if (IVSPlayer.isPlayerSupported) {
                    // eslint-disable-next-line no-undef
                    const player = IVSPlayer.create();
                    player.attachHTMLVideoElement(document.getElementById('video-player'));
                    player.load("https://mcdn.daserste.de/daserste/de/master.m3u8");
                    player.play();
                }
            }

            return () => {
                document.body.removeChild(script);
            }

        },
        []
    )

    return (
        <div ref={divEl}>
            <video
                id="video-player"
                ref={videoEl}
                playsInline
                autoPlay
                height={'max'}
                controls
            />
        </div>
    );
}


VideoPlayer.propTypes = {
  setMetadataId: PropTypes.func,
  videoStream: PropTypes.string,
};

export default VideoPlayer;