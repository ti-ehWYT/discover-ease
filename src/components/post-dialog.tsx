"use client";

import { HeartIcon, PencilIcon } from "lucide-react";
import { Post } from "../../type/post";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
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
import { useEffect, useState } from "react";
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
export default function PostDialog({
  postItem,
  allowEdit = false,
}: {
  postItem: Post;
  allowEdit: boolean;
}) {
  const [comments, setComments] = useState<
    {
      id: string;
      text: string;
      userId: string;
      userName: string;
      createdAt: any;
    }[]
  >([]);
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
      const commentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as typeof comments;
      setComments(
        commentData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
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
      // Unlike
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likeCount: increment(-1) });
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      // Like
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
      <DialogTrigger asChild>
        <Card className="mb-4 break-inside-avoid cursor-pointer">
          <CardHeader>
            {postItem.images?.length! > 0 ? (
              <Image
                src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                  postItem.images![0]
                )}?alt=media`}
                alt="cover"
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-auto max-w-full rounded-md"
              />
            ) : (
              "Default Image here..."
            )}
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold">{postItem.title}</h2>
          </CardContent>
          <CardFooter>
            {postItem.tags?.length! > 0 &&
              postItem.tags?.slice(0, 3).map((tag, index) => (
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600 mr-1"
                  key={index}
                >
                  {tag}
                </Badge>
              ))}
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent
        className=" flex max-h-3/4 max-w overflow-hidden"
        style={{ minWidth: "60vw" }}
      >
        <div className="flex-1">
          <Carousel className="relative">
            <div className="relative">
              {postItem.images && postItem.images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow" />
                  <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow" />
                </>
              )}
              <CarouselContent>
                {postItem.images?.map((image, index) => (
                  <CarouselItem key={image}>
                    <div className="rounded-md relative h-[70vh] min-h-80">
                      <Image
                        src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                          image
                        )}?alt=media`}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
          </Carousel>
        </div>

        <div className="flex-1 ml-4 flex flex-col overflow-hidden">
          <DialogTitle className="flex justify-between">
            {postItem.title}
            {allowEdit && (
              <Link href={`/edit-post/${postItem.id}`}>
                <PencilIcon />
              </Link>
            )}
          </DialogTitle>

          <div className="text-sm text-muted-foreground">
            {postItem.country}
          </div>
          <div className="flex items-center">
            {!user && (
              <LoginRegisterDialog
                icon={
                  <HeartIcon
                    className={
                      "w-5 h-5 transition-colors text-gray-400 focus:outline-none"
                    }
                  />
                }
              />
            )}
            {user && (
              <button
                onClick={() => toggleLike()}
                className="focus:outline-none"
                title={"Like"}
              >
                <HeartIcon
                  className={clsx(
                    "w-5 h-5 transition-colors",
                    liked ? "fill-red-500 text-red-500" : "text-gray-400"
                  )}
                />
              </button>
            )}

            <span className="text-xs font-medium text-gray-500">
              {likeCount}
            </span>
            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
              <span>👁 {postItem.viewCount ?? 0} views</span>
            </div>
          </div>

          <DialogDescription
            className="mt-2 flex-1 overflow-y-auto whitespace-pre-wrap pr-2"
            style={{ scrollbarWidth: "none" }}
          >
            {postItem.description}
          </DialogDescription>
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold mb-2">Comments</h3>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="text-sm flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{comment.userName}</span>:{" "}
                    <span>{comment.text}</span>
                  </div>
                  {user?.uid === comment.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-red-500 ml-2 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {user ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                  className="flex-1 border px-2 py-1 rounded text-sm"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Post
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-2">
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
