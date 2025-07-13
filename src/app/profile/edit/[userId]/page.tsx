import EditProfilePage from "./edit-profile-client";

interface Props {
  params: { userId: string };
}

export default async function EditPage({ params }: Props) {
  const { userId } = await params;
  return <EditProfilePage userId={userId} />;
}