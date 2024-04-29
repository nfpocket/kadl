import type { Tables } from "~/types/supabase";

export enum AddPanelsNote {
  LeftMost = -1,
  RightMost = -2,
  CenterMost = -3,
}

export const leftMostAddNote = { id: AddPanelsNote.LeftMost } as const as Tables<"notes">;
export const rightMostAddNote = { id: AddPanelsNote.RightMost } as const as Tables<"notes">;
export const centerMostAddNote = { id: AddPanelsNote.CenterMost } as const as Tables<"notes">;
