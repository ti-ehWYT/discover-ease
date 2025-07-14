"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical, HeartIcon } from "lucide-react";
import { Post } from "../../type/post";
import { Card, CardContent, CardHeader } from "./ui/card";
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
} from "firebase/firestore";
import { auth, db } from "../../firebase/client";
import LoginRegisterDialog from "./login-register-dialog";
import { formatTimestamp } from "@/lib/utils";
import CommentsSection from "./comments-section";

export default function PostDialog({
  postItem,
  allowEdit = false,
}: {
  postItem: Post;
  allowEdit: boolean;
}) {

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
                <div className="w-full bg-gray-200 flex items-center justify-center">
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
                <Link href={`/profile/${postItem.authorId}`}>
                  <div className="block w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={postItem.avatar}
                      alt="Post avatar"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                </Link>
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

          <CommentsSection postId={postItem.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

