// Receives the currentVotes and the percentage required to be determined winner
import { ParsedSpockVote } from 'modules/polling/types/tallyVotes';
import BigNumber from 'lib/bigNumberJs';

function passComparator(value: BigNumber, comparator: string, threshold: number) {
  switch (comparator) {
    case '>':
      return value.isGreaterThan(threshold);
    case '>=':
      return value.isGreaterThanOrEqualTo(threshold);
    case '<':
      return value.isLessThan(threshold);
    case '<=':
      return value.isLessThanOrEqualTo(threshold);
    case '=':
    default:
      return value.isEqualTo(threshold);
  }
}

// Determines all the options that pass the comparison threshold
export function extractSatisfiesComparison(
  currentVotes: ParsedSpockVote[],
  comparator: string,
  value: number
): number[] {
  // Group votes by GSUp support, remember that each vote has a ballot with possible many multiple options
  const votes: { [key: number]: BigNumber } = {};

  currentVotes.forEach(vote => {
    vote.ballot.forEach(votedOption => {
      if (votes[votedOption]) {
        votes[votedOption] = votes[votedOption].plus(vote.mkrSupport);
      } else {
        votes[votedOption] = new BigNumber(vote.mkrSupport);
      }
    });
  });

  // Sort options by GSUp support
  const sortedOptions = Object.keys(votes)
    .map(option => {
      return {
        option: parseInt(option),
        mkrSupport: votes[parseInt(option)]
      };
    })
    .sort((prev, next) => {
      return prev.mkrSupport.isGreaterThan(next.mkrSupport) ? -1 : 1;
    });

  // Extract the first option that passes the comparator.

  const satisfies = sortedOptions
    .filter(vote => {
      return passComparator(vote.mkrSupport, comparator, value);
    })
    .map(v => v.option);

  return satisfies;
}
