import { Tag } from 'modules/app/types/tag';
import { PollVoteType } from './pollVoteType';

export type Poll = {
  title: string;
  multiHash: string;
  content: string;
  pollId: number;
  summary: string;
  options: Record<any, any>;
  endDate: Date;
  startDate: Date;
  discussionLink: string | null;
  voteType: PollVoteType;
  tags: Tag[];
  slug: string;
  ctx: {
    prev: PartialPoll | null;
    next: PartialPoll | null;
  };
  url?: string;
};

export type PartialPoll = {
  multiHash: string;
  pollId: number;
  slug: string;
  startDate: Date;
  endDate: Date;
  url: string;
};
