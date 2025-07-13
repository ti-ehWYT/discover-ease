// src/app/profile/[userId]/page.tsx
import ProfileClient from "../profile-client"; // Adjust path if needed

interface PageProps {
  params: {
    userId: string;
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  // params.userId comes from the route [userId]
  const { userId } = await params;
  return <ProfileClient userId={userId} />;
}