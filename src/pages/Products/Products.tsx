import { useEffect, useRef, useState } from "react";
import { api } from "../../config/axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type Product, type ProductFormData } from "./productSchema";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { useAuth } from "../../hooks/useAuth";

export default function Products() {
  const toast = useRef<Toast>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [showDialog, setShowDialog] = useState(false);
  const { logout } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      category: "",
      image: "",
    },
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setShowDialog(true);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);

    setValue("title", product.title);
    setValue("price", product.price);
    setValue("description", product.description);
    setValue("category", product.category);
    setValue("image", product.image);

    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`https://fakestoreapi.com/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));

      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Product deleted successfully",
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Delete failed",
        life: 3000,
      });
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editProduct) {
        const res = await api.put(`/products/${editProduct.id}`, data);

        setProducts((prev) =>
          prev.map((p) => (p.id === editProduct.id ? res.data : p)),
        );

        setShowDialog(false);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Product updated successfully",
          life: 3000,
        });
        reset();
      } else {
        const res = await api.post("/products", data);

        setProducts((prev) => [...prev, res.data]);

        setShowDialog(false);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Product added successfully",
          life: 3000,
        });
        reset();
      }
    } catch (err) {
      console.log("Add failed");
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Invalid data",
        life: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 mt-10">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-50 border border-gray-200 rounded p-4 shadow-md w-full"
          >
            <Skeleton
              shape="rectangle"
              className="w-full"
              style={{ height: "160px" }}
            />
            <Skeleton
              shape="rectangle"
              className="w-full mt-4"
              style={{ height: "20px" }}
            />
            <Skeleton
              shape="rectangle"
              className="w-full mt-2"
              style={{ height: "20px" }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  return (
    <div className="p-10">
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button label="Add Product" severity="success" onClick={handleAdd} />
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            iconPos="left"
            className="gap-2"
            severity="info"
            onClick={logout}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-50 border border-gray-200 rounded p-4 shadow-md w-full"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-40 w-full object-contain mb-3"
            />
            <div className="flex gap-3 justify-between items-center px-3">
              <div className="">
                <h3 className="font-bold">{product.title}</h3>
                <p className="text-lg font-semibold">${product.price}</p>
              </div>
              <div className=" flex gap-2">
                <i
                  onClick={() => handleEdit(product)}
                  className="pi pi-pencil cursor-pointer rounded-2xl bg-blue-200 p-2 text-blue-500"
                  style={{ fontSize: "1rem" }}
                ></i>

                <i
                  onClick={() => handleDelete(product.id)}
                  className="pi pi-trash cursor-pointer rounded-2xl bg-red-200 p-2 text-red-500"
                  style={{ fontSize: "1rem" }}
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* popup to add/edit Product  */}
      <Dialog
        header={editProduct ? "Edit Product":"Add product"}
        visible={showDialog}
        style={{ width: "40vw" }}
        onHide={() => {
          (reset(), setShowDialog(false));
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-[50%]">
              <label>Title</label>
              <InputText {...register("title")} className="w-full" />
              {errors.title && (
                <small className="text-red-500">{errors.title.message}</small>
              )}
            </div>

            <div className="w-[50%]">
              <label>Price</label>

              <Controller
                name="price"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <InputNumber
                    value={field.value}
                    className="w-full"
                    onValueChange={(e) => {
                      const value = e.value ?? 0; // convert null to 0
                      field.onChange(value);
                    }}
                    mode="decimal"
                    minFractionDigits={0}
                  />
                )}
              />

              {errors.price && (
                <small className="text-red-500">{errors.price.message}</small>
              )}
            </div>
          </div>

          <div>
            <label>Description</label>
            <InputTextarea
              {...register("description")}
              rows={3}
              className="w-full"
            />
            {errors.description && (
              <small className="text-red-500">
                {errors.description.message}
              </small>
            )}
          </div>

          <div>
            <label>Category</label>
            <InputText {...register("category")} className="w-full" />
            {errors.category && (
              <small className="text-red-500">{errors.category.message}</small>
            )}
          </div>

          <div>
            <label>Image URL</label>
            <InputText {...register("image")} className="w-full" />
            {errors.image && (
              <small className="text-red-500">{errors.image.message}</small>
            )}
          </div>

          <Button label="Submit" type="submit" loading={isSubmitting} />
        </form>
      </Dialog>
    </div>
  );
}
