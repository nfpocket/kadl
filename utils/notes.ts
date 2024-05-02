import { type DropdownItem } from "#ui/types/dropdown";
import type { Enums } from "~/types/supabase";

type Priority = Enums<"priority">;
export const priorities = {
  none: "None",
  low: "Low",
  middle: "Middle",
  high: "High",
  "above all": "Above All",
} as const satisfies Record<Priority, string>;

export const getPriorityIconClass = (priority: Priority) => {
  switch (priority) {
    case "none":
      return "!text-gray-400";
    case "low":
      return "!text-green-500";
    case "middle":
      return "!text-yellow-500";
    case "high":
      return "!text-red-500";
    case "above all":
      return "!text-red-700 font-bold animate-pulse";
  }
};

export const priorityOptions = Object.entries(priorities).map(([value, label]) => {
  return {
    value,
    label,
    icon: "i-tabler-exclamation-mark",
    iconClass: getPriorityIconClass(value as Priority),
  } as DropdownItem & { value: Priority };
});
