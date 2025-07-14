"use-client";

import React, { useEffect, useState } from "react";
import {
  doc,
  deleteDoc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/client";
import Link from "next/link";
import { useAuth } from "../../context/auth";
import LoginRegisterDialog from "./login-register-dialog";
import { formatTimestamp } from "@/lib/utils";
type Comment = {
  id: string;
  text: string;
  userId: string;
  userName: string;
  avatar?: string | null; // ← allow null here
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
};
type UserData = {
  nickname?: string;
  photoURL?: string;
};
export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const auth = useAuth();

  const user = auth?.currentUser;
  useEffect(() => {
    const commentsRef = collection(db, "posts", postId, "comments");

    const unsubscribe = onSnapshot(commentsRef, async (snapshot) => {
      const rawComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));

      // Get unique userIds
      const uniqueUserIds = Array.from(
        new Set(rawComments.map((c) => c.userId))
      );

      // Fetch user data for each unique userId
      const userDocs = await Promise.all(
        uniqueUserIds.map(async (uid) => {
          const userDoc = await getDoc(doc(db, "users", uid));
          return {
            userId: uid,
            ...userDoc.data() as UserData,
          };
        })
      );

      // Create a map of userId → metadata
      const userMap = new Map(
        userDocs.map((u) => [
          u.userId,
          { userName: u.nickname ?? "Unknown", avatar: u.photoURL ?? null },
        ])
      );

      // Enrich comments with user data
      const enrichedComments = rawComments.map((comment) => {
        const userMeta = userMap.get(comment.userId);
        return {
          ...comment,
          userName: userMeta?.userName ?? comment.userName,
          avatar: userMeta?.avatar,
        };
      });

      // Sort and set comments
      setComments(
        enrichedComments.sort(
          (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
        )
      );
    });

    return () => unsubscribe();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!user || !newComment.trim()) return;

    const commentRef = collection(db, "posts", postId, "comments");
    await addDoc(commentRef, {
      text: newComment.trim(),
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      createdAt: serverTimestamp(),
    });

    setNewComment("");
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    const commentRef = doc(db, "posts", postId, "comments", commentId);
    await deleteDoc(commentRef);
  };
  return (
    <div className="mt-6 border-t pt-5">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <div className="space-y-4 max-h-56 overflow-y-auto pr-2 bg-gray-50 rounded-md p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm italic">No comments yet.</p>
        )}
        {comments.map((comment) => {
          const createdAtDate = comment.createdAt
            ? new Date(comment.createdAt.seconds * 1000)
            : null;

          return (
            <div key={comment.id} className="flex gap-3 items-start">
              {/* Avatar */}
              <Link href={`/profile/${comment.userId}`}>
                {comment.avatar ? (
                  <img
                    src={comment.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                )}
              </Link>

              {/* Comment content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${comment.userId}`}>
                    <span className="font-semibold text-gray-900 hover:underline">
                      {comment.userName}
                    </span>
                  </Link>
                  {comment.createdAt && (
                    <span className="text-xs text-gray-400 italic">
                      {formatTimestamp(
                        new Date(comment.createdAt.seconds * 1000)
                      )}
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>

              {/* Delete button */}
              {user?.uid === comment.userId && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-red-600 hover:text-red-800 transition"
                  title="Delete comment"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>

      {user ? (
        <div className="mt-5 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </div>
      ) : (
        <div className="mt-5 text-sm text-gray-500">
          <LoginRegisterDialog
            icon={
              <span className="underline cursor-pointer">Login to comment</span>
            }
          />
        </div>
      )}
    </div>
  );
}
