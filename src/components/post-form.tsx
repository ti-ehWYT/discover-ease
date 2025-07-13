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
import { Button } from "./ui/button";
import MultiImageUploader, { ImageUpload } from "./multi-image-uploader";
import { CountrySelect } from "./country-select";
import { UserPreferenceMultiSelect } from "./user-preference-select";
import DescriptionInput from "./description-input";
import TagInputField from "./tag-input";

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
      user_preference: [],
    },
    ...defaultValues,
  };

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: combinedDefaultValues,
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full max-w-4xl mx-auto"
      >
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
                  <DescriptionInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TagInputField
            name="tags"
            control={form.control}
            label="Tags"
            placeholder="Type tag and press space or Enter"
          />
          <UserPreferenceMultiSelect
            control={form.control}
            name="user_preference"
          />
          <CountrySelect control={form.control} name="country" />
        </fieldset>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
}
