"use client";

import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SelectItemType {
  value: number;
  label: string;
}

interface MultiSelectFieldProps {
  label: string;
  field: string;
  items: SelectItemType[];
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  badgeColor: string;
}

export function MultiSelectField({
  label,
  field,
  items,
  formData,
  setFormData,
  badgeColor,
}: MultiSelectFieldProps) {
  const handleMultiSelect = (value: string) => {
    const numericValue = Number.parseInt(value, 10);
    if (isNaN(numericValue)) return; // Kiểm tra nếu value không phải số hợp lệ
    const currentValues = formData[field] as number[];
    if (currentValues.includes(numericValue)) {
      setFormData({
        ...formData,
        [field]: currentValues.filter((id) => id !== numericValue),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentValues, numericValue],
      });
    }
  };

  const removeSelection = (value: number) => {
    const currentValues = formData[field] as number[];
    setFormData({
      ...formData,
      [field]: currentValues.filter((id) => id !== value),
    });
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label} *</Label>
      <Select onValueChange={handleMultiSelect}>
        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value.toString()}
              className="text-white"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2 mt-2">
        {formData[field].map((itemId: number) => {
          const item = items.find((i) => i.value === itemId);
          return item ? (
            <Badge
              key={itemId}
              variant="secondary"
              className={`${badgeColor} text-white`}
            >
              {item.label}
              <button
                type="button"
                onClick={() => removeSelection(itemId)}
                className="ml-1 text-white "
              >
                <X className="w-4 h-4 cursor-pointer" />
              </button>
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );
}
