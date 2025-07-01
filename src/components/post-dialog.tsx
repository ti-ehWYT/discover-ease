import { PencilIcon } from "lucide-react";
import { Post } from "../../type/post";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

export default function PostDialog({
  postItem,
  allowEdit = false,
}: {
  postItem: Post;
  allowEdit: boolean;
}) {
  return (
    <Dialog key={postItem.id}>
      <DialogTrigger asChild>
        <Card className="mb-4 break-inside-avoid cursor-pointer">
          <CardHeader>
            {postItem.images?.length! > 0 ? (
              <Image
                src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                  postItem.images![0]
                )}?alt=media`}
                alt="cover"
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-auto max-w-full rounded-md"
              />
            ) : (
              "Default Image here..."
            )}
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold">{postItem.title}</h2>
            <p className="text-sm text-muted-foreground">
              {postItem.description}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader></DialogHeader>
        <Carousel>
          <CarouselContent>
            {postItem.images?.map((image, index) => {
              return (
                <CarouselItem key={image} className="w-full h-auto">
                  <Image
                    src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                      image
                    )}?alt=media`}
                    alt={`Image ${index + 1}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-auto w-auto max-w-full rounded-md"
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        {allowEdit && (
          <Link href={`/edit-post/${postItem.id}`}>
            <PencilIcon />
          </Link>
        )}

        <DialogTitle>{postItem.title}</DialogTitle>
        <DialogDescription>{postItem.description}</DialogDescription>
        <p>{postItem.country}</p>
      </DialogContent>
    </Dialog>
  );
}
