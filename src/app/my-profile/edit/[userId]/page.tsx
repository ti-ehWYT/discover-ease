import EditProfilePage from "./edit-profile-client";

interface Props {
  params: { userId: string };
}

export default function EditPage({ params }: Props) {
  return <EditProfilePage userId={params.userId} />;
}