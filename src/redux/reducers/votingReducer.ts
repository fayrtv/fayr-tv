import { ReducerAction } from "../types";
import { AttendeeVote, VotingData } from "components/chimeWeb/Voting/types";

const VOTING_CREATED = "VOTING_CREATED";
const VOTING_UPDATE_VOTE = "VOTING_UPDATE_VOTE";

export const createVoting = (votingData: VotingData): ReducerAction<VotingData> => ({
    type: VOTING_CREATED,
    payload: votingData,
});

export const updateVote = (attendeeVote: AttendeeVote): ReducerAction<AttendeeVote> => ({
    type: VOTING_UPDATE_VOTE,
    payload: attendeeVote,
});

export type VotingReducerState = Array<VotingData>;

const initialState: VotingReducerState = [
    {
        hostTeam: {
            identifier: "vfb",
            teamIconSource:
                "https://iconape.com/wp-content/files/hu/323161/png/vfb-stuttgart-1960-logo.png",
        },
        guestTeam: {
            identifier: "b04",
            teamIconSource:
                "https://icons.iconarchive.com/icons/giannis-zographos/german-football-club/256/Bayer-Leverkusen-icon.png",
        },
        votes: [],
        votingId: "215235235",
    },
];

export const reducer = (
    state = initialState,
    action: ReducerAction<VotingData | AttendeeVote>,
): VotingReducerState => {
    switch (action.type) {
        case VOTING_CREATED:
            return [...state, action.payload as VotingData];
        case VOTING_UPDATE_VOTE:
            const attendeeVote = action.payload as AttendeeVote;
            const correspondingVoteIndex = state.findIndex(
                (x) => x.votingId === attendeeVote.votingId,
            );

            if (correspondingVoteIndex === -1) {
                return state;
            }

            const newVotingInfo: VotingData = { ...state[correspondingVoteIndex] };
            const existingVoteIndex = newVotingInfo.votes.findIndex(
                (x) => x.name === attendeeVote.name,
            );

            if (existingVoteIndex === -1) {
                newVotingInfo.votes = [...newVotingInfo.votes, attendeeVote];
            } else {
                newVotingInfo.votes[existingVoteIndex].hostTeam = attendeeVote.hostTeam;
                newVotingInfo.votes[existingVoteIndex].guestTeam = attendeeVote.guestTeam;
            }

            const newVoteArray = [...state];
            newVoteArray[correspondingVoteIndex] = newVotingInfo;

            return newVoteArray;
        case "RESET":
            return [];
        default:
            return state;
    }
};
