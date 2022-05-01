import React from "react";
import ReactSlider from "react-slider";

const Slider = (
    props: Omit<
        React.ComponentProps<typeof ReactSlider>,
        "className" | "thumbClassName" | "trackClassName" | "renderThumb"
    >,
) => (
    <ReactSlider
        className="block h-4 my-3"
        thumbActiveClassName="ring-2 ring-primary"
        thumbClassName="radius-full bg-blueish border-1 w-6 h-6 rounded-full cursor-pointer hover:ring-2 hover:ring-primary border-primary text-center text-sm align-baseline"
        trackClassName="mt-2 mb-2 block bg-primary border-1 border-neutral h-2"
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        {...props}
    />
);

export default Slider;
