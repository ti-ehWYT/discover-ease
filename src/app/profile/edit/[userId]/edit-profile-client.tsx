"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../context/auth";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../../firebase/client";
import { apiFetch } from "@/lib/apiFetch";

interface EditProfileProps {
  userId: string;
}

export default function EditProfilePage({ userId }: EditProfileProps) {
  const auth = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [nickname, setNickname] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

useEffect(() => {
  if (!auth?.currentUser) return; // wait until auth is ready
  if (auth.currentUser.uid !== userId) {
    router.replace(`/profile/${userId}`); // faster redirect with replace
  }
}, [auth?.currentUser, userId]);

  useEffect(() => {
    if (!userId) return;
    apiFetch(`/api/profile?userId=${userId}`)
      .then((res) => {
        const profile = res.data;
        setBio(profile.bio || "");
        setGender(profile.gender || "");
        setNickname(profile.nickname || "");
        setPhotoURL(profile.photoURL || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error", { description: "Failed to load user profile" });
        setLoading(false);
      });
  }, [userId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth?.currentUser) return;

    setUploading(true);
    const imageRef = ref(
      storage,
      `profileImages/${auth.currentUser.uid}/avatar.jpg`
    );

    try {
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setPhotoURL(url);
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/api/profile/update-profile", {
        method: "PATCH",
        body: JSON.stringify({ bio, gender, photoURL, nickname, userId }),
        successMessage: "Profile updated successfully!",
        errorMessage: "Failed to update profile",
      });

      router.push(`/profile/${userId}`);
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      {/* Avatar Upload */}
      <div className="flex justify-center">
        <div
          className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:opacity-80"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={photoURL || "/default-avatar.png"}
            alt="Avatar"
            className="object-cover w-full h-full"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm">
              Uploading...
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Nickname */}
      <label className="block">
        Nickname:
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>

      {/* Gender */}
      <label className="block">
        Gender:
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>

      {/* Bio */}
      <label className="block">
        Bio:
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded"
          placeholder="Write something about yourself"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
      >
        Save Profile
      </button>
    </form>
  );
}
