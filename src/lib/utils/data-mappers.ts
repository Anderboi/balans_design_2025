import { Participant, Comment } from "@/types";

/**
 * Interface for raw observer data from Supabase
 */
interface RawObserver {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

/**
 * Interface for raw comment data from Supabase
 */
interface RawComment {
  id: string;
  content: string;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

/**
 * Interface for raw assignee data from Supabase
 */
interface RawAssignee {
  full_name: string;
}

/**
 * Maps a raw observer object from Supabase to a Participant
 */
export const mapObserverToParticipant = (
  observer: RawObserver
): Participant => ({
  id: observer.user.id,
  name: observer.user.full_name,
  avatar: observer.user.avatar_url,
  role: "observer",
});

/**
 * Maps an array of observers to Participant array
 */
export const mapObserversToParticipants = (
  observers?: RawObserver[]
): Participant[] => {
  return observers?.map(mapObserverToParticipant) || [];
};

/**
 * Maps a raw comment object from Supabase to a Comment
 */
export const mapCommentData = (comment: RawComment): Comment => ({
  id: comment.id,
  userName: comment.user?.full_name || "Unknown",
  userAvatar: comment.user?.avatar_url,
  text: comment.content,
  createdAt: comment.created_at,
});

/**
 * Maps an array of comments to Comment array
 */
export const mapCommentsData = (comments?: RawComment[]): Comment[] => {
  return comments?.map(mapCommentData) || [];
};

/**
 * Maps assignee data to assignee name
 */
export const mapAssigneeName = (assignee?: RawAssignee): string | undefined => {
  return assignee?.full_name;
};
