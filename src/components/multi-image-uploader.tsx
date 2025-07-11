"use client";

import { useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { MoveIcon, XIcon, PlusIcon } from "lucide-react";

export type ImageUpload = {
  id: string;
  url: string;
  file?: File;
};

type Props = {
  images?: ImageUpload[];
  onImagesChange: (images: ImageUpload[]) => void;
  urlFormatter?: (image: ImageUpload) => string;
  multiple: boolean;
};

export default function MultiImageUploader({
  images = [],
  onImagesChange,
  urlFormatter,
  multiple,
}: Props) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Total size of new + existing images
    const totalSize = [...images, ...files.map((file) => ({ file }))].reduce(
      (sum, img) => sum + (img.file?.size || 0),
      0
    );
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (totalSize > MAX_SIZE) {
      toast.error("Error!", {
        description:
          "Total image size exceeds 5MB. Please upload smaller files.",
      });

      return;
    }
    const newImages = files.map((file, index) => {
      return {
        id: `${Date.now()}-${index}-${file.name}`,
        url: URL.createObjectURL(file),
        file,
      };
    });
    onImagesChange([...images, ...newImages]);
  };
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const items = Array.from(images);
      const [reorderedImage] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedImage);
      onImagesChange(items);
    },
    [onImagesChange, images]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updatedImages = images.filter((image) => image.id !== id);
      onImagesChange(updatedImages);
    },
    [onImagesChange, images]
  );

  return (
    <div>
      <input
        className="hidden"
        ref={uploadInputRef}
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleInputChange}
      />
      <Button
        className="w-full"
        variant="outline"
        type="button"
        onClick={() => uploadInputRef?.current?.click()}
      >
        Upload Image<PlusIcon />
      </Button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="property-images" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="relative p-2"
                    >
                      <div className="bg-gray-100 rounded-lg flex gap-2 items-center overflow-hidden">
                        <div className="size-16 w-16 h-16 relative">
                          <Image
                            src={urlFormatter ? urlFormatter(image) : image.url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">
                            Image {index + 1}
                          </p>
                          {index === 0 && <div>Featured Image</div>}
                        </div>
                        <div className="flex items-center p-2">
                          <button
                            className="text-red-500 p-2"
                            onClick={() => handleDelete(image.id)}
                          >
                            <XIcon />
                          </button>
                          <div className="text-gray-500">
                            <MoveIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
