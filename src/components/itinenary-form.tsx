"use client";

import React from "react";
import { z } from "zod";
import { itinenarySchema } from "../../validation/itinenarySchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { TagMultiSelect } from "./tags-select";
import { CountrySelect } from "./country-select";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MultiImageUploader, { ImageUpload } from "./multi-image-uploader";
import DescriptionInput from "./description-input";

type Props = {
  submitButtonLabel: React.ReactNode;
  handleSubmit: (data: z.infer<typeof itinenarySchema>) => void;
  defaultValues?: z.infer<typeof itinenarySchema>;
};

export default function itinenaryForm({
  handleSubmit,
  submitButtonLabel,
  defaultValues,
}: Props) {
  const combinedDefaultValues: z.infer<typeof itinenarySchema> = {
    ...{
      title: "",
      description: "",
      country: "",
      tags: [],
      coverImage: [],
      itinenary: [
        {
          day: 1,
          images: [],
          activity: [""],
        },
      ],
    },
    ...defaultValues,
  };
  const form = useForm<z.infer<typeof itinenarySchema>>({
    resolver: zodResolver(itinenarySchema),
    defaultValues: combinedDefaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormControl>
                <MultiImageUploader
                  onImagesChange={(images: ImageUpload[]) => {
                    form.setValue("coverImage", images);
                  }}
                  images={field.value}
                  urlFormatter={(image) => {
                    if (!image.file) {
                      return `https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                        image.url
                      )}?alt=media`;
                    }
                    return image.url;
                  }}
                  multiple={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <DescriptionInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TagMultiSelect control={form.control} name="tags" />
        <CountrySelect control={form.control} name="country" />
        {form.watch("itinenary").map((item, index) => (
          <div key={index} className="border p-4 my-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Day {index + 1}</h3>
              {form.watch("itinenary").length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const current = form.getValues("itinenary");
                    const updated = current.filter((_, i) => i !== index);
                    form.setValue("itinenary", updated);
                  }}
                >
                  Remove Day
                </Button>
              )}
            </div>
            {/* Images for the day */}
            <FormField
              control={form.control}
              name={`itinenary.${index}.images`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <MultiImageUploader
                      images={field.value}
                      onImagesChange={(images: ImageUpload[]) => {
                        form.setValue(`itinenary.${index}.images`, images);
                      }}
                      urlFormatter={(image) => {
                        if (!image.file) {
                          return `https://firebasestorage.googleapis.com/v0/b/discover-ease-ee29d.firebasestorage.app/o/${encodeURIComponent(
                            image.url
                          )}?alt=media`;
                        }
                        return image.url;
                      }}
                      multiple={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activities */}
            <FormField
              control={form.control}
              name={`itinenary.${index}.activity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activities</FormLabel>
                  <div className="space-y-2">
                    {field.value.map(
                      (activity: string, activityIndex: number) => (
                        <div
                          key={activityIndex}
                          className="flex gap-2 items-center"
                        >
                          <Input
                            value={activity}
                            onChange={(e) => {
                              const updated = [...field.value];
                              updated[activityIndex] = e.target.value;
                              field.onChange(updated);
                            }}
                          />
                          {field.value.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updated = field.value.filter(
                                  (_, i) => i !== activityIndex
                                );
                                field.onChange(updated);
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      )
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        field.onChange([...field.value, ""]);
                      }}
                    >
                      + Add Activity
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="my-4"
          onClick={() => {
            const current = form.getValues("itinenary");
            form.setValue("itinenary", [
              ...current,
              {
                day: current.length + 1,
                images: [],
                activity: [""],
              },
            ]);
          }}
        >
          + Add Day
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
}
