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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "./ui/carousel";

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
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent
        className=" flex max-h-3/4 max-w overflow-hidden"
        style={{ minWidth: "60vw" }}
      >
        <div className="flex-1">
          <Carousel className="relative">
            <div className="relative">
              {postItem.images && postItem.images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow" />
                  <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow" />
                </>
              )}
              <CarouselContent>
                {postItem.images?.map((image, index) => (
                  <CarouselItem key={image}>
                    <div className="rounded-md relative h-[70vh] min-h-80">
                      <Image
                        src={`https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                          image
                        )}?alt=media`}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
          </Carousel>
        </div>

        <div className="flex-1 ml-4 flex flex-col overflow-hidden">
          <DialogTitle className="flex justify-between">
            {postItem.title}
            {allowEdit && (
              <Link href={`/edit-post/${postItem.id}`}>
                <PencilIcon />
              </Link>
            )}
          </DialogTitle>

          <div className="text-sm text-muted-foreground">
            {postItem.country}
          </div>

          <DialogDescription
            className="mt-2 flex-1 overflow-y-auto whitespace-pre-wrap pr-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {postItem.description}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
