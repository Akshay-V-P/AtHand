import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

import { adminServices } from "../services/adminServices";

import MetricCard from "../../../components/admin/MetricCard";
import CategoryCard from "../../../components/admin/CategoryCard";
import { Modal } from "../../../components/common/Modal";

import { CreateCategoryForm } from "../../../components/admin/CreateCategoryForm";
import { EditCategoryForm } from "../../../components/admin/EditCategoryForm";

import type { CreateCategoryFormData } from "../validation/CreateCategorySchema";
import type { EditCategoryFormData } from "../validation/EditCategorySchema";

interface Category {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  commissionPercentage: number;
  status: "ACTIVE" | "BLOCKED";
}

const ServiceCategories = () => {
  const [metricsData, setMetricsData] = useState([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [updatingCategoryId, setUpdatingCategoryId] =
    useState<string | null>(null);

  const fetchCategories = async (search = searchQuery) => {
    const response = await adminServices.getAllCategories({
      page: 1,
      limit: 10,
      search,
    });

    const { items } = response.data.data;

    setCategories(items);
  };

  /*
   * Initial load + debounced search
   */
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        await fetchCategories(searchQuery);
      } catch (error) {
        console.error(
          "Error loading service categories:",
          error
        );

        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // CREATE CATEGORY
  const handleCreateCategorySubmit = async (
    formData: CreateCategoryFormData
  ) => {
    try {
      await adminServices.createCategory(formData);

      toast.success("Category created successfully");

      setIsCreateModalOpen(false);

      await fetchCategories();
    } catch (error: any) {
      console.error("Error creating category:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // OPEN EDIT MODAL
  const handleManageCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // UPDATE CATEGORY
  const handleEditCategorySubmit = async (
    formData: EditCategoryFormData
  ) => {
    if (!selectedCategory) return;

    try {
      await adminServices.updateCategory(
        selectedCategory.id,
        formData
      );

      toast.success("Category updated");

      setIsEditModalOpen(false);
      setSelectedCategory(null);

      await fetchCategories();
    } catch (error: any) {
      console.error(
        "Error updating category:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // CLOSE EDIT MODAL
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  // BLOCK / UNBLOCK CATEGORY
  const handleToggleCategoryStatus = async (
    category: Category
  ) => {
    try {
      setUpdatingCategoryId(category.id);

      if (category.status === "ACTIVE") {
        await adminServices.blockCategory(category.id);

        toast.success(
          "Category blocked successfully"
        );
      } else {
        await adminServices.unblockCategory(category.id);

        toast.success(
          "Category unblocked successfully"
        );
      }

      await fetchCategories();
    } catch (error: any) {
      console.error(
        "Error updating category status:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading catalog data...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto h-full">
      <main className="p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">
              <span>Catalog</span>

              <i className="fa-solid fa-chevron-right text-[9px]" />

              <span className="text-blue-600">
                Categories
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Service Categories
            </h1>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <i className="fa-solid fa-circle-plus" />

            <span>Create New Category</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsData.map((metric: any, index) => (
            <MetricCard
              key={index}
              title={metric?.title ?? "Electro"}
              value={metric?.value ?? 10}
            />
          ))}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onManage={() =>
                  handleManageCategory(category)
                }
                onToggleStatus={() =>
                  handleToggleCategoryStatus(category)
                }
                isStatusUpdating={
                  updatingCategoryId === category.id
                }
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-500">
                No categories found
                {searchQuery &&
                  ` for "${searchQuery}"`}
                .
              </p>
            </div>
          )}
        </div>

      </main>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Category"
      >
        <CreateCategoryForm
          onClose={() =>
            setIsCreateModalOpen(false)
          }
          onSubmit={handleCreateCategorySubmit}
        />
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Category"
      >
        {selectedCategory && (
          <EditCategoryForm
            category={selectedCategory}
            onClose={handleCloseEditModal}
            onSubmit={handleEditCategorySubmit}
          />
        )}
      </Modal>

    </div>
  );
};

export default ServiceCategories;