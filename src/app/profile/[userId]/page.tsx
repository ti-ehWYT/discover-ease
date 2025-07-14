
import ProfileClient from "../profile-client";

export default async function UserProfilePage({ params }: { params: Promise<{ userId: string}>}) {
  const { userId } = await params;
  return <ProfileClient userId={userId} />;
}