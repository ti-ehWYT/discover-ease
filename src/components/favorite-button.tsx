"use client";

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { auth, db } from "../../firebase/client";
import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Button } from "./ui/button";

export default function FavoriteButton({
  itineraryId,
}: {
  itineraryId: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      setLoading(false);
      return;
    }

    const favDocRef = doc(
      db,
      "itineraries",
      itineraryId,
      "favorites",
      user.uid
    );
    getDoc(favDocRef).then((docSnap) => {
      setIsFavorite(docSnap.exists());
      setLoading(false);
    });
  }, [user, itineraryId]);

  const toggleFavorite = async () => {
    if (!user) return alert("Please login to favorite.");

    const favDocRef = doc(
      db,
      "itineraries",
      itineraryId,
      "favorites",
      user.uid
    );
    const itineraryDocRef = doc(db, "itineraries", itineraryId);

    if (isFavorite) {
      await deleteDoc(favDocRef);
      await updateDoc(itineraryDocRef, { favoriteCount: increment(-1) });
      setIsFavorite(false);
    } else {
      await setDoc(favDocRef, { favoritedAt: new Date() });
      await updateDoc(itineraryDocRef, { favoriteCount: increment(1) });
      setIsFavorite(true);
    }
  };

  if (loading) return <button disabled>Loading...</button>;

  return (
    <Button
    variant="ghost"
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Unfavorite" : "Favorite"}
      className={`p-2 rounded transition-colors
    focus:outline-none
    ${
      isFavorite
        ? "text-yellow-400 hover:text-yellow-500"
        : "text-gray-400 hover:text-yellow-400"
    }
  `}
    >
      {isFavorite ? (
        <FaStar className="w-6 h-6" />
      ) : (
        <FaRegStar className="w-6 h-6" />
      )}
    </Button>
  );
}
