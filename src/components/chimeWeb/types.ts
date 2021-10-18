export type Attendee = {
	AttendeeId: string;
	JoinToken: string;
}

export type JoinInfo = {
	Attendee: Attendee;
	PlaybackURL: string;
	Meeting: any;
	Title: string;
}

export type EmojiReactionTransferObject = {
	attendeeId: string;
	emoji: string;
}