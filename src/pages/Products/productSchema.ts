import { z } from "zod";


export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Invalid image URL"),
});

export type ProductFormData = z.infer<typeof productSchema>;


export type Product = ProductFormData & {
  id: number;
};
