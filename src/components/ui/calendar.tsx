import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
    showOutsideDays={showOutsideDays}
    captionLayout="dropdown"
    fromYear={1950}
    toYear={new Date().getFullYear()}
    className={cn("p-3", className)}
    classNames={{
      months: "flex flex-col",
      month: "space-y-4",

      /* HEADER IN ONE ROW */
      caption: "flex justify-center items-center gap-2",
      caption_label: "hidden",
      dropdown_month: "px-3 py-1 rounded-md border bg-white text-sm",
      dropdown_year: "px-3 py-1 rounded-md border bg-white text-sm",

      nav: "hidden",

      table: "w-full border-collapse",
      head_row: "flex justify-between",
      row: "flex justify-between",

      cell: "h-9 w-9 text-center text-sm",

      day: "h-9 w-9 rounded-md hover:bg-gray-100",

      /* SELECTED DATE */
      day_selected: "bg-primary text-white font-medium",

      /* TODAY — CLEARLY VISIBLE */
      day_today:
        "border-2 border-primary text-primary font-semibold bg-primary/10",

      day_outside: "text-muted-foreground opacity-40",

      ...classNames,
    }}
    {...props}
/>


  );
}

Calendar.displayName = "Calendar";

export { Calendar };
