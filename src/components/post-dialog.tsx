import { PencilIcon } from "lucide-react";
import { Post } from "../../type/post";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import { Button } from "./ui/button";

export default function PostDialog({ postItem }: { postItem: Post }) {
  return (
    <Dialog key={postItem.id}>
      <DialogTrigger asChild>
        <Card className="mb-4 break-inside-avoid cursor-pointer">
          <CardContent>
            <h2 className="text-lg font-semibold">{postItem.title}</h2>
            <p className="text-sm text-muted-foreground">
              {postItem.description}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <Button asChild variant="outline" size="sm"></Button>
          <Link href={`/edit-post/${postItem.id}`}>
            <PencilIcon />
          </Link>
          <DialogTitle>{postItem.title}</DialogTitle>
          <DialogDescription>{postItem.description}</DialogDescription>
        </DialogHeader>
        <p>{postItem.country}</p>
      </DialogContent>
    </Dialog>
  );
}
