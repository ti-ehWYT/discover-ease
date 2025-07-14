import EditProfilePage from "./edit-profile-client";

export default async function EditPage({ params }: { params: Promise<{ userId: string}>}) {
  const { userId } = await params;
  return <EditProfilePage userId={userId} />;
}