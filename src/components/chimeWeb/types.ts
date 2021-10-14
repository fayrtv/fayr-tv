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