"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import { Badge } from "./ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Control } from "react-hook-form";

type TagInputFieldProps = {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
};

export default function TagInputField({
  name,
  control,
  label,
  placeholder,
}: TagInputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const [inputValue, setInputValue] = useState("");

        const addTag = (tag: string) => {
          tag = tag.trim();
          if (tag && !field.value.includes(tag)) {
            field.onChange([...field.value, tag]);
          }
        };

        const removeTag = (tagToRemove: string) => {
          field.onChange(
            field.value.filter((tag: string) => tag !== tagToRemove)
          );
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            addTag(inputValue);
            setInputValue("");
          }
        };

        // Keep inputValue in sync when field.value changes externally
        useEffect(() => {
          if (!field.value.includes(inputValue)) {
            setInputValue("");
          }
        }, [field.value]);

        return (
          <FormItem className="py-3">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                placeholder={placeholder ?? "Type tag and press space or Enter"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </FormControl>
            <div className="mt-2 flex flex-wrap gap-2">
              {field.value.map((tag: string) => (
                <Badge
                  key={tag}
                  className="flex items-center space-x-1 cursor-pointer select-none bg-blue-500 text-white hover:bg-blue-600"
                  title="Click to remove"
                  onClick={() => removeTag(tag)}
                >
                  <span>{tag}</span>
                  <span className="font-bold">×</span>
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
