import { firestore } from "../../../../firebase/server";
import { ItinenaryType } from "../../../../type/itinenary";
import Image from "next/image";

type Props = {
  params: {
    itinenaryId: string;
  };
};

export default async function itinenaryDetailPage({ params }: Props) {
  const docRef = firestore.collection("itineraries").doc(params.itinenaryId); // ✅ correct usage
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return <div className="p-4 text-red-500">itinenary not found.</div>;
  }

  const itinenary = snapshot.data() as ItinenaryType;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{itinenary.title}</h1>
      <p className="text-muted-foreground mb-4">{itinenary.description}</p>

      {Array.isArray(itinenary.coverImage) && itinenary.coverImage[0] && (
        <Image
          src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
            itinenary.coverImage[0]
          )}?alt=media`}
          alt={itinenary.title}
          className="w-full max-w-2xl rounded-md shadow mb-6"
          width={0}
          height={0}
        />
      )}

      <h2 className="text-xl font-semibold mb-2">itinenary</h2>
      {itinenary.itinenary.map((day) => (
        <div key={day.day} className="mb-6 border p-4 rounded">
          <h3 className="font-semibold mb-2">Day {day.day}</h3>
          {day.images?.length! > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              {day.images?.map((img, index) => {
                return (
                  <Image
                    key={index}
                    src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                      img
                    )}?alt=media`}
                    alt={`Day ${day.day} image ${index + 1}`}
                    width={300}
                    height={200}
                    className="rounded object-cover"
                  />
                );
              })}
            </div>
          )}
          <ul className="list-disc list-inside text-sm">
            {day.activity.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
