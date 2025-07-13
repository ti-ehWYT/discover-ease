"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical, HeartIcon } from "lucide-react";
import { Post } from "../../type/post";
import { Card, CardContent, CardHeader } from "./ui/card";
import NextImage from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import clsx from "clsx";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase/client";
import LoginRegisterDialog from "./login-register-dialog";
type Comment = {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
};
export default function PostDialog({
  postItem,
  allowEdit = false,
}: {
  postItem: Post;
  allowEdit: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(postItem.likeCount ?? 0);
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLiked(false);
        return;
      }

      const likeDoc = await getDoc(
        doc(db, "posts", postItem.id, "likes", user.uid)
      );
      setLiked(likeDoc.exists());
    });

    return () => unsubscribe();
  }, [postItem.id]);

  useEffect(() => {
    const commentsRef = collection(db, "posts", postItem.id, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const commentData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...(doc.data() as Omit<Comment, "id">), // type assertion here
        };
      });

      setComments(
        commentData.sort(
          (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
        )
      );
    });

    return () => unsubscribe();
  }, [postItem.id]);

  useEffect(() => {
    if (isOpen) {
      const incrementView = async () => {
        const postRef = doc(db, "posts", postItem.id);
        await updateDoc(postRef, { viewCount: increment(1) });
      };
      incrementView();
    }
  }, [isOpen, postItem.id]);

  const toggleLike = async () => {
    if (!user) return;

    const likeRef = doc(db, "posts", postItem.id, "likes", user.uid);
    const postRef = doc(db, "posts", postItem.id);

    if (liked) {
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likeCount: increment(-1) });
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await setDoc(likeRef, { likedAt: Date.now() });
      await updateDoc(postRef, { likeCount: increment(1) });
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user || !newComment.trim()) return;

    const commentRef = collection(db, "posts", postItem.id, "comments");
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

    const commentRef = doc(db, "posts", postItem.id, "comments", commentId);
    await deleteDoc(commentRef);
  };

  return (
    <Dialog key={postItem.id} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild className="gap-1">
        <Card className="mb-4 cursor-pointer p-0 relative w-full transition-transform duration-200 group hover:scale-[1.015]">
          <CardHeader className="p-0 relative overflow-hidden rounded-t-md">
            <div className="relative w-full">
              {postItem.images?.length! > 0 ? (
                <>
                  <Image
                    src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                      postItem.images![0]
                    )}?alt=media`}
                    alt="cover"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay on image hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />
                </>
              ) : (
                <div
                  className="w-full bg-gray-200 flex items-center justify-center"
                >
                  No Image
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute bottom-2 left-0 right-0 bg-grey bg-opacity-50 px-3 py-2 flex justify-between items-center rounded-b-md">
              <div className="flex items-center gap-2 max-w-[70%] truncate">
                {postItem.avatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
                    <Image
                      src={postItem.avatar}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex-shrink-0" />
                )}
                <span className="text-sm font-semibold text-white truncate">
                  {postItem.authorName ?? "Unknown"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-red-500 font-semibold">
                <HeartIcon className="w-5 h-5" />
                <span>{likeCount}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-3 pb-3">
            <h2 className="text-lg font-semibold truncate">{postItem.title}</h2>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent
        className="flex max-h-[80vh] overflow-hidden p-0 border-none shadow-none"
        style={{ minWidth: "70vw", maxWidth: "90vw" }}
      >
        {/* Left: Image Carousel */}
        <div className="flex-shrink-0 w-1/2 bg-black flex items-center justify-center">
          <Carousel className="relative h-full w-full">
            {postItem.images && postItem.images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow" />
                <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow" />
              </>
            )}
            <CarouselContent>
              {postItem.images?.map((image, index) => (
                <CarouselItem key={image}>
                  <div className="relative h-[80vh] w-full rounded-md overflow-hidden">
                    {/* Blurred Background */}
                    <Image
                      src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                        image
                      )}?alt=media`}
                      alt={`Blurred ${index + 1}`}
                      fill
                      className="absolute inset-0 object-cover filter blur-2xl scale-110 opacity-40"
                    />

                    {/* Foreground Image */}
                    <div className="relative z-10 flex items-center justify-center h-full w-full">
                      <Image
                        src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                          image
                        )}?alt=media`}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col flex-1 overflow-hidden p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {postItem.avatar && (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={postItem.avatar}
                    alt="Post avatar"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
              )}
              <div>
                <DialogTitle className="text-xl font-bold">
                  {postItem.title}
                </DialogTitle>
                <div className="text-xs text-gray-500">
                  {postItem.country} •{" "}
                  {postItem.created
                    ? formatTimestamp(new Date(postItem.created))
                    : "Unknown date"}
                </div>
              </div>
            </div>

            {allowEdit && (
              <Link href={`/edit-post/${postItem.id}`}>
                <EllipsisVertical className="text-muted-foreground w-5 h-5 hover:text-black" />
              </Link>
            )}
          </div>
          {postItem.tags && postItem.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {postItem.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  className="bg-blue-500 text-white dark:bg-blue-600 rounded-full px-3 py-1 text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          {/* Like & View */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              {!user ? (
                <LoginRegisterDialog
                  icon={
                    <HeartIcon className="w-6 h-6 text-gray-400 hover:scale-110 transition-transform cursor-pointer focus:outline-none" />
                  }
                />
              ) : (
                <button
                  onClick={toggleLike}
                  title="Like"
                  className="hover:scale-110 transition-transform focus:outline-none"
                >
                  <HeartIcon
                    className={clsx(
                      "w-6 h-6",
                      liked ? "fill-red-600 text-red-600" : "text-gray-400"
                    )}
                  />
                </button>
              )}
              <span className="font-semibold">{likeCount}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              👁 {postItem.viewCount ?? 0} views
            </div>
          </div>

          {/* Description */}
          <DialogDescription className="mt-5 flex-1 overflow-y-auto  whitespace-pre-wrap pr-3 text-gray-800 leading-relaxed">
            {postItem.description}
          </DialogDescription>

          {/* Comments */}
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
                  <div
                    key={comment.id}
                    className="flex justify-between items-start space-x-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {comment.userName}
                        </span>

                        {createdAtDate && (
                          <span className="text-xs text-gray-400 italic ml-2">
                            {formatTimestamp(createdAtDate)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-gray-700">{comment.text}</p>
                    </div>
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
                    <span className="underline cursor-pointer">
                      Login to comment
                    </span>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function DialogTriggerCard({
  postItem,
  userName,
}: {
  postItem: Post;
  userName: string;
}) {
  // Example fixed max width for smaller image
  const maxImageWidth = 280;

  // You could calculate aspect ratio dynamically if you have width/height info
  // For demo, assume width = maxImageWidth and height proportional, or fixed height:
  const imageWidth = maxImageWidth;
  const imageHeight = 180; // or calculate based on ratio

  return (
    <div
      className="cursor-pointer rounded-md overflow-hidden flex flex-col items-center bg-transparent"
      style={{ width: imageWidth }}
    >
      {/* Image */}
      <div
        style={{
          width: imageWidth,
          height: imageHeight,
          position: "relative",
        }}
      >
        <NextImage
          src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
            postItem.images?.[0] ?? ""
          )}?alt=media`}
          alt={postItem.title}
          fill
          style={{ objectFit: "contain" }}
          sizes={`${imageWidth}px`}
          className="rounded-md"
          priority={true}
        />
      </div>

      {/* Text below */}
      <div className="w-full mt-2 px-2 flex justify-between items-center">
        {/* Left: Avatar and Nickname */}
        <div className="flex items-center gap-3">
          {postItem.avatar && (
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
              <NextImage
                src={postItem.avatar}
                alt="Avatar"
                width={40}
                height={40}
                className="object-cover rounded-full"
              />
            </div>
          )}
          <span className="text-sm text-gray-500 italic">{userName}</span>
        </div>

        {/* Right: Likes */}
        <div className="flex items-center gap-1">
          <HeartIcon className="w-5 h-5 text-red-500" />
          <span className="text-sm font-semibold">
            {postItem.likeCount ?? 0}
          </span>
        </div>
      </div>

      {/* Title below the nickname/likes */}
      <h3 className="mt-1 text-lg font-bold text-blue-700 text-center px-2 truncate">
        {postItem.title}
      </h3>
    </div>
  );
}
function formatTimestamp(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    return diffSeconds <= 1 ? "1 sec ago" : `${diffSeconds} secs ago`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 min ago" : `${diffMinutes} mins ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  // Older than 24 hours, show date like "Jul 13, 2025"
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
