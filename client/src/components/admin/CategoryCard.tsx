import React from "react";
import type { Category } from "../../shared/entities/Category";

interface CategoryCardProps {
  category?: Category;
  onManage: () => void;
  onToggleStatus: () => void;
  isStatusUpdating?: boolean;
}

const CategoryCard = ({
  category,
  onManage,
  onToggleStatus,
  isStatusUpdating = false,
}: CategoryCardProps) => {
  if (!category) return null;

  const {
    name,
    badge,
    subCategoryCount,
    activeProvidersCount,
    image: icon,
    status,
  } = category;

  const isBlocked = status === "BLOCKED";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all">

      {/* Card Header */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <img
          src={icon}
          alt={name}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`backdrop-blur-md text-white border border-white/10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
              isBlocked
                ? "bg-red-600/85"
                : "bg-emerald-600/85"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-6">

        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Sub-Categories
            </p>

            <p className="text-sm font-bold text-slate-800">
              {subCategoryCount}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Providers
            </p>

            <p className="text-sm font-bold text-slate-800">
              {activeProvidersCount}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">

          <button
            onClick={onManage}
            disabled={isStatusUpdating}
            className="flex-1 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-blue-600 font-semibold text-sm py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Manage
          </button>

          <button
            onClick={onToggleStatus}
            disabled={isStatusUpdating}
            className={`flex-1 font-semibold text-sm py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 ${
              isBlocked
                ? "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                : "border border-red-200 text-red-600 hover:bg-red-50"
            }`}
          >
            {isStatusUpdating
              ? "Updating..."
              : isBlocked
              ? "Unblock"
              : "Block"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CategoryCard;