"use client";

import { useEffect, useState } from "react";
import { fetchUserProfile, fetchUserPosts, fetchUserItineraries } from "./action";
import PostDialog from "@/components/post-dialog";
import { useAuth } from "../../../context/auth";
import { Post } from "../../../type/post";
import { EllipsisVertical, Mars, Venus } from "lucide-react";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ItineraryType } from "../../../type/itinerary";
import ItineraryCard from "@/components/itinerary-card";

const breakpointColumnsObj = {
  default: 3,
  1024: 2,
  640: 1,
};

interface ProfileClientProps {
  userId: string;
}

export default function ProfileClient({ userId }: ProfileClientProps) {
  const auth = useAuth();
  const currentUserId = auth?.currentUser?.uid;

  const [userProfile, setUserProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryType[]>([]);
  useEffect(() => {
    if (!userId) return;

    (async () => {
      const [profile, userPosts, userItinerary] = await Promise.all([
        fetchUserProfile(userId),
        fetchUserPosts(userId),
        fetchUserItineraries(userId),
      ]);
      setUserProfile(profile);
      setPosts(userPosts);
      setItinerary(userItinerary);
    })();
  }, [userId]);

  if (!userId || !userProfile || posts.length === 0) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        {/* Profile Skeleton */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 mb-8">
          <Skeleton className="w-32 h-32 rounded-full" />

          <div className="flex-1 sm:ml-6 w-full space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>

        <hr className="my-8 border-t border-gray-300" />

        {/* Masonry Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="rounded-md aspect-[4/3] w-full h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 mb-8">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            src={userProfile?.photoURL || "/default-avatar.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 sm:ml-6 w-full relative">
          {/* Edit Button (only show if viewing own profile) */}
          {currentUserId === userId && (
            <div className="absolute top-0 right-0">
              <Link href={`/profile/edit/${userId}`}>
                <EllipsisVertical className="text-gray-500 hover:text-gray-800" />
              </Link>
            </div>
          )}

          <h2 className="text-2xl font-bold">
            {userProfile?.nickname ||
              userProfile?.displayName ||
              userProfile?.email}
          </h2>

          {userProfile?.bio && (
            <p className="text-gray-600 mt-2 whitespace-pre-wrap">
              {userProfile.bio}
            </p>
          )}

          {/* Gender Icons */}
          {userProfile?.gender && (
            <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm w-fit">
              {userProfile.gender === "male" && (
                <>
                  <Mars className="w-4 h-4 text-blue-500" />
                  <span>Male</span>
                </>
              )}
              {userProfile.gender === "female" && (
                <>
                  <Venus className="w-4 h-4 text-pink-500" />
                  <span>Female</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <hr className="my-8 border-t border-gray-300" />

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="favourite">Favourite</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {posts.map((post, index) => (
              <div key={post.id || index}>
                <PostDialog postItem={post} allowEdit={currentUserId === userId} />
              </div>
            ))}
          </Masonry>
        </TabsContent>

        {/* Itineraries Tab (placeholder for now) */}
        <TabsContent value="itineraries">
          {itinerary.length > 0 ? itinerary.map((iti) => {
            return <ItineraryCard key={iti.id} id={iti.id} title={iti.title} coverImages={iti.coverImage}/>
          }) : 
           <div className="text-center text-gray-500 py-12">
            No Itinerary available yet.
          </div>
          }
        </TabsContent>

        <TabsContent value="favourite">
          <div className="text-center text-gray-500 py-12">
            No favourite available yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}