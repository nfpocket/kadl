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

export const getPriorityLabel = (priority: Priority) => priorities[priority];
export const getPriotiryNumber = (priority: Priority) => {
  return Object.keys(priorities).indexOf(priority);
};

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

export const getPriorityBackgroundClass = (priority: Priority, withHover: boolean) => {
  const getBaseClass = () => {
    switch (priority) {
      case "above all":
        return "bg-red-700/25 text-red-700 shadow-[inset_0_0_4px_rgb(185,28,28)]";
      case "high":
        return "bg-red-500/25 text-red-500";
      case "middle":
        return "bg-yellow-500/25 text-yellow-500";
      case "low":
        return "bg-green-500/25 text-green-500";
      case "none":
        return "";
    }
  };

  const getHoverClass = () => {
    switch (priority) {
      case "above all":
        return "hover:bg-red-700/30";
      case "high":
        return "hover:bg-red-500/30";
      case "middle":
        return "hover:bg-yellow-500/30";
      case "low":
        return "hover:bg-green-500/30";
      case "none":
        return "";
    }
  };

  const baseClass = getBaseClass();

  if (!withHover) return baseClass;

  return `${baseClass} ${getHoverClass()}`;
};

export const priorityOptions = Object.entries(priorities).map(([value, label]) => {
  return {
    value,
    label,
    icon: "i-tabler-exclamation-mark",
    iconClass: getPriorityIconClass(value as Priority),
  } as DropdownItem & { value: Priority };
});
