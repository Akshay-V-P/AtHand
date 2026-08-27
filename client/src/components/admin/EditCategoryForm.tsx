import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCategorySchema, type EditCategoryFormData } from "../../features/admin/validation/EditCategorySchema";



interface Category {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  commissionPercentage: number;
}

interface EditCategoryFormProps {
  category: Category;
  onClose: () => void;
  onSubmit: (data: EditCategoryFormData) => Promise<void>;
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  category,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
  });

  useEffect(() => {
    reset({
      categoryName: category.name,
      description: category.description ?? "",
      slug: category.slug,
      commissionPercentage: category.commissionPercentage,
    });
  }, [category, reset]);

  const handleFormSubmit = async (data: EditCategoryFormData) => {
    await onSubmit(data);
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
          {...register("categoryName")}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />

        {errors.categoryName && (
          <p className="mt-1 text-xs text-red-500">
            {errors.categoryName.message}
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
          {...register("slug")}
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-600 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />

        {errors.slug && (
          <p className="mt-1 text-xs text-red-500">
            {errors.slug.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};