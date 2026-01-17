"use client";

import * as React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function DevTools() {
  return <ReactQueryDevtools initialIsOpen={false} />;
}
