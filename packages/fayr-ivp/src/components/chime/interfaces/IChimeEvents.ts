import Event from "@fayr/common/src/events/event";

export default interface IChimeEvents {
    roomLeft: Event<void>;
}
