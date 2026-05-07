"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Save,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  rowToFormValues,
  type TAdminUserRow,
  type UserFormValues,
} from "@/api-services/user/user-admin-definations";

function emptyForm(): UserFormValues {
  return {
    name: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
    address: "",
    city: "Kathmandu",
    password: "",
    passwordConfirm: "",
  };
}

interface UserFormSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: TAdminUserRow | null;
  onSave: (values: UserFormValues) => void | Promise<void>;
  isSaving?: boolean;
}

const UserFormSidebar = ({
  isOpen,
  onClose,
  user,
  onSave,
  isSaving = false,
}: UserFormSidebarProps) => {
  const [formData, setFormData] = useState<UserFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData(rowToFormValues(user));
    } else {
      setFormData(emptyForm());
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (field: keyof UserFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const isCreate = !user;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (isCreate) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Use at least 8 characters";
      }
      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "Passwords do not match";
      }
    } else if (formData.password || formData.passwordConfirm) {
      if (formData.password.length < 8) {
        newErrors.password = "Use at least 8 characters";
      }
      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData);
  };

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden
        />
      ) : null}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 shadow-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {user ? "Edit user" : "Create user"}
                </h2>
                <p className="text-sm text-white/90">
                  {user
                    ? "Update account details"
                    : "Add a new account (sign-in username matches email)"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              type="button"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Basic information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="First and last name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name ? (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="user@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email ? (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-600" />
                {user ? "Reset password (optional)" : "Password"}
              </h3>
              {!user ? (
                <p className="text-sm text-gray-600">
                  The user will sign in with their email and this password.
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Leave blank to keep the current password. Fill both fields to
                  set a new one.
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {!user ? <span className="text-red-500">*</span> : null}
                </label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password ? (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm password {!user ? <span className="text-red-500">*</span> : null}
                </label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={formData.passwordConfirm}
                  onChange={(e) =>
                    handleChange("passwordConfirm", e.target.value)
                  }
                  className={errors.passwordConfirm ? "border-red-500" : ""}
                />
                {errors.passwordConfirm ? (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.passwordConfirm}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Role &amp; status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      handleChange("role", value as UserFormValues["role"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="business">Business owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleChange(
                        "status",
                        value as UserFormValues["status"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Location
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Kathmandu"
                />
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6 -mb-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving…" : user ? "Update user" : "Create user"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserFormSidebar;
