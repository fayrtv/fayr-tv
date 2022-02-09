export type Attendee = {
    AttendeeId: string;
    JoinToken: string;
};

export type JoinInfo = {
    Attendee: Attendee;
    PlaybackURL: string;
    Meeting: any;
    Title: string;
};

export type EmojiReactionTransferObject = {
    attendeeId: string;
    emoji: string;
    clickPosition?: {
        relativeX: number;
        relativeY: number;
    };
};

type ForceAttendeeDeviceChangeDto = {
    attendeeId: string;
};

export type ForceMicChangeDto = ForceAttendeeDeviceChangeDto & {
    isForceMuted: boolean;
};
