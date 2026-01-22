import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-[6px] px-[6px]", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<typeof PaginationItem> &
  React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-[4px] text-[13px] font-normal transition-colors disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "rounded-[6px] bg-[#1FAA73] text-white"
          : "text-[rgba(8,31,64,0.7)] hover:bg-[#F5F5F5]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function PaginationFirst({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to first page"
      className={cn("text-[#101828]/70 hover:text-[#101828]", className)}
      {...props}
    >
      <SkipBack className="h-[14px] w-[14px]" fill="currentColor" />
    </PaginationLink>
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("text-[#101828]/70 hover:text-[#101828]", className)}
      {...props}
    >
      <ChevronLeft className="h-[14px] w-[14px]" />
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("text-[#101828]/70 hover:text-[#101828]", className)}
      {...props}
    >
      <ChevronRight className="h-[14px] w-[14px]" />
    </PaginationLink>
  );
}

function PaginationLast({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to last page"
      className={cn("text-[#101828]/70 hover:text-[#101828]", className)}
      {...props}
    >
      <SkipForward className="h-[14px] w-[14px]" fill="currentColor" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex h-8 w-8 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
};
