import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema, type CreateCategoryFormData } from "../../features/admin/validation/CreateCategorySchema";


interface CreateCategoryFormProps {
  onClose: () => void;
  onSubmit: (data: CreateCategoryFormData) => void;
}

export const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      commissionPercentage: undefined,
      slug: "",
    },
  });

  const categoryName = watch("name");

  // Auto-generate slug from category name
  useEffect(() => {
    const generatedSlug = categoryName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setValue("slug", generatedSlug);
  }, [categoryName, setValue]);

  const handleFormSubmit = (data: CreateCategoryFormData) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name
        </label>

        <input
          type="text"
          placeholder="e.g. Electronics, Plumbing"
          {...register("name")}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>

        <input
          type="text"
          placeholder="e.g. Electronics Devices"
          {...register("description")}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />

        {errors.description && (
          <p className="mt-1 text-xs text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Commission Percentage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Commission Percentage
        </label>

        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          placeholder="%"
          {...register("commissionPercentage", {
            valueAsNumber: true,
          })}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />

        {errors.commissionPercentage && (
          <p className="mt-1 text-xs text-red-500">
            {errors.commissionPercentage.message}
          </p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>

        <input
          type="text"
          placeholder="e.g. electronics"
          {...register("slug")}
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-600 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />

        <p className="mt-1 text-xs text-gray-500">
          The slug is the URL-friendly version of the name.
        </p>

        {errors.slug && (
          <p className="mt-1 text-xs text-red-500">
            {errors.slug.message}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition cursor-pointer"
        >
          Create Category
        </button>
      </div>
    </form>
  );
};