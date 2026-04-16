export type SortDirection = "asc" | "desc";

export interface SortConfig<T = string> {
  field: T | null;
  direction: SortDirection;
}

export type ViewMode = "grid" | "list";
