/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import * as z from "zod";

export function useZodForm<TSchema extends z.ZodType<any, any, any>>(
  schema: TSchema,
  props?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">
) {
  return useForm<z.infer<TSchema>>({
    ...props,
    resolver: zodResolver(schema) as any,
  });
}
