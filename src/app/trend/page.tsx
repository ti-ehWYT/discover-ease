import { getSearchRanking } from "../../../data/trend";

export default async function Trend() {
    const ranking = await getSearchRanking();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top Searched Countries</h2>
      <ul className="space-y-2">
        {ranking.map((item: any, index: number) => (
          <li key={item.country} className="flex justify-between">
            <span>{index + 1}. {item.country}</span>
            <span className="text-muted-foreground">({item.count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}