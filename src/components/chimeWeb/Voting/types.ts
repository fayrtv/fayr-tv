export type Team = {
	identifier: string;
	teamIconSource: string;
}

export type AttendeeVote = {
	votingId: string;
	name: string;
	hostTeam: number;
	guestTeam: number;
}

export type AttendeeVoteDto = {
	votingId: string;
	attendeeId: string;
	hostTeam: number;
	guestTeam: number;
}

export type VotingData = {
	hostTeam: Team;
	guestTeam: Team;
	votes: Array<AttendeeVote>;
	votingId: string;
}

export enum VotingPage {
	Vote,
	Overview,
	Survey,
}