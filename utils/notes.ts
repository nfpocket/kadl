import type { Enums, Tables } from "~/types/supabase";
import { type DropdownItem } from "#ui/types/dropdown";

export enum AddPanelsNote {
  LeftMost = -1,
  RightMost = -2,
  CenterMost = -3,
}

export const leftMostAddNote = { id: AddPanelsNote.LeftMost } as const as Tables<"notes">;
export const rightMostAddNote = { id: AddPanelsNote.RightMost } as const as Tables<"notes">;
export const centerMostAddNote = { id: AddPanelsNote.CenterMost } as const as Tables<"notes">;

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
