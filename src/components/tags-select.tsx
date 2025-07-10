import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { tagOptions } from "../lib/tags";
import { Control } from "react-hook-form";

type TagMultiSelectProps = {
  control: Control<any>;
  name: string;
};

export function TagMultiSelect({ control, name }: TagMultiSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="py-3">
          <FormLabel>Tags</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-full justify-between ${
                  !Array.isArray(field.value) || field.value.length === 0
                    ? "text-muted-foreground"
                    : ""
                }`}
              >
                {Array.isArray(field.value) && field.value.length > 0
                  ? field.value.join(", ")
                  : "Select tags"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-h-[200px] overflow-y-auto">
              <div className="flex flex-col space-y-2">
                {tagOptions.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={field.value?.includes(tag)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(field.value || []), tag]
                          : (field.value || []).filter((t: string) => t !== tag);
                        field.onChange(newValue);
                      }}
                    />
                    <label
                      htmlFor={tag}
                      className="text-sm font-medium leading-none"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}