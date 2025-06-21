import { Card, CardContent } from "@/components/ui/card";
import { getPosts } from "../../data/posts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export default async function Home() {
  const { data } = await getPosts("");
  
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 p-4">
      {data.map((item, i) => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <Card className="mb-4 break-inside-avoid cursor-pointer">
              <CardContent>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{item.title}</DialogTitle>
              <DialogDescription>{item.description}</DialogDescription>
            </DialogHeader>
            <p>{item.country}</p>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
