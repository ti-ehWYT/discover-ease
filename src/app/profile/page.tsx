import ProfileClient from "./profile-client";

interface PageProps {
  params: {
    userId: string;
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  return <ProfileClient userId={userId} />;
}