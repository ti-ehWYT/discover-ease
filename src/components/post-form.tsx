"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../../validation/postSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import MultiImageUploader, { ImageUpload } from "./multi-image-uploader";
import { CountrySelect } from "./country-select";
import { TagMultiSelect } from "./tags-select";

type Props = {
  submitButtonLabel: React.ReactNode;
  handleSubmit: (data: z.infer<typeof postSchema>) => void;
  defaultValues?: z.infer<typeof postSchema>;
};
export default function PostForm({
  handleSubmit,
  submitButtonLabel,
  defaultValues,
}: Props) {
  const combinedDefaultValues: z.infer<typeof postSchema> = {
    ...{
      title: "",
      description: "",
      country: "",
      tags: [],
      images: [],
    },
    ...defaultValues,
  };

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: combinedDefaultValues,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset disabled={form.formState.isSubmitting}>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="py-3">
                <FormControl>
                  <MultiImageUploader
                    onImagesChange={(images: ImageUpload[]) => {
                      form.setValue("images", images);
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
                    multiple={true}
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
                  <Textarea {...field} rows={5} className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TagMultiSelect control={form.control} name="tags" />
          <CountrySelect control={form.control} name="country"/>
        </fieldset>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
}
