import { FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { user_preference_list } from "../lib/user-preference";
import { Control } from "react-hook-form";

type UserPreferenceSelectProps = {
  control: Control<any>;
  name: string;
};

export function UserPreferenceMultiSelect({ control, name }: UserPreferenceSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="py-3">
          <FormLabel>User Preference (Choose the charateristic of this post that you think is suit)</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-[250px] justify-between ${
                  !Array.isArray(field.value) || field.value.length === 0
                    ? "text-muted-foreground"
                    : ""
                }`}
              >
                {Array.isArray(field.value) && field.value.length > 0
                  ? field.value.join(", ")
                  : "Select user preference"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] max-h-[200px] overflow-y-auto">
              <div className="flex flex-col space-y-2">
                {user_preference_list.map((preference) => (
                  <div key={preference} className="flex items-center space-x-2">
                    <Checkbox
                      id={preference}
                      checked={field.value?.includes(preference)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(field.value || []), preference]
                          : (field.value || []).filter((t: string) => t !== preference);
                        field.onChange(newValue);
                      }}
                    />
                    <label
                      htmlFor={preference}
                      className="text-sm font-medium leading-none"
                    >
                      {preference}
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