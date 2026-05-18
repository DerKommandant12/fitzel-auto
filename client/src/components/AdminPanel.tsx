/*
 * AdminPanel — Simple inventory management interface
 * Add, edit, delete cars with Firebase persistence and inline validation feedback
 */
import { useState } from "react";
import { useCarInventory, Car } from "@/hooks/useCarInventory";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { compressImage } from "@/lib/imageCompression";
import { X, Plus, Edit2, Trash2, ChevronDown, ChevronUp, LogOut, Image as ImageIcon, AlertCircle, Loader2 } from "lucide-react";

interface FormData extends Omit<Car, "id"> {}

interface FieldErrors {
  make?: string;
  model?: string;
  price?: string;
  km?: string;
}

const EMPTY_SELECT_LABEL = "Selectează...";

const BODY_TYPE_OPTIONS = [
  "Sedan",
  "Hatchback",
  "Break",
  "SUV",
  "Coupe",
  "Cabrio",
  "Monovolum",
  "Pickup",
  "Van",
] as const;

const LOCATION_OPTIONS = [
  "La sediu",
  "La warehouse",
  "La comandă",
  "În tranzit",
] as const;

const FUEL_OPTIONS = [
  "Benzină",
  "Diesel",
  "Hibrid Benzină",
  "Hibrid Diesel",
  "Plug-in Hibrid",
  "Electric",
  "GPL",
  "Benzină + GPL",
] as const;

const TRANSMISSION_OPTIONS = [
  "Manuală 5 trepte",
  "Manuală 6 trepte",
  "Automată",
  "Automată DSG",
  "Automată CVT",
  "Automată Hidramatică",
  "Semi-automată",
  "Robotizată",
] as const;

function selectOptions(fixed: readonly string[], current?: string): string[] {
  const value = current?.trim() ?? "";
  const inList = fixed.some((opt) => opt === value);
  if (value && !inList) {
    return [EMPTY_SELECT_LABEL, value, ...fixed];
  }
  return [EMPTY_SELECT_LABEL, ...fixed];
}

function carToFormData(car: Car): FormData {
  const { id: _id, ...rest } = car;
  return {
    ...createEmptyFormData(),
    ...rest,
    km: rest.km != null && rest.km !== "" ? String(rest.km) : "",
    fuel: rest.fuel ?? "",
    transmission: rest.transmission ?? "",
    bodyType: rest.bodyType ?? "",
    location: rest.location ?? "",
    images: car.images ?? [],
  };
}

function formDataToCarPayload(data: FormData): Omit<Car, "id"> {
  return {
    ...data,
    km: String(data.km ?? ""),
    fuel: data.fuel?.trim() ?? "",
    transmission: data.transmission?.trim() ?? "",
    bodyType: data.bodyType?.trim() ?? "",
    location: data.location?.trim() ?? "",
    engine: data.engine?.trim() ?? "",
    power: data.power?.trim() ?? "",
    drivetrain: data.drivetrain?.trim() ?? "",
    stockType: data.stockType?.trim() ?? "",
    images: data.images ?? [],
  };
}

function createEmptyFormData(): FormData {
  return {
    make: "",
    model: "",
    year: new Date().getFullYear(),
    fuel: "",
    transmission: "",
    km: "",
    price: "",
    images: [],
    description: "",
    bodyType: "",
    engine: "",
    power: "",
    drivetrain: "",
    stockType: "",
    location: "",
  };
}

export default function AdminPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cars, addCar, updateCar, deleteCar } = useCarInventory();
  const { logout } = useAdminAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(createEmptyFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageInputMode, setImageInputMode] = useState<"url" | "file">("url");
  const [imagesCompressing, setImagesCompressing] = useState(false);

  // Validation functions for individual fields
  const validateMake = (value: string): string | undefined => {
    if (!value.trim()) return "Marca este obligatorie";
    if (value.trim().length < 2) return "Marca trebuie să aibă cel puțin 2 caractere";
    return undefined;
  };

  const validateModel = (value: string): string | undefined => {
    if (!value.trim()) return "Modelul este obligatoriu";
    if (value.trim().length < 2) return "Modelul trebuie să aibă cel puțin 2 caractere";
    return undefined;
  };

  const validatePrice = (value: string): string | undefined => {
    if (!value.trim()) return "Prețul este obligatoriu";
    if (!/^[\d.,\s€]+$/.test(value)) return "Prețul trebuie să conțină doar numere și puncte/virgule";
    return undefined;
  };

  const validateKm = (value: string): string | undefined => {
    if (value.trim() && !/^[\d.,\s]+$/.test(value)) {
      return "Kilometrajul trebuie să conțină doar numere și puncte/virgule";
    }
    return undefined;
  };

  // Handle field changes with inline validation
  const handleFieldChange = (field: keyof FormData, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (fieldErrors[field as keyof FieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handlePriceBlur = () => {
    const value = formData.price;
    if (!value.trim()) return;
    if (value.trimEnd().endsWith("€")) return;
    handleFieldChange("price", `${value.trimEnd()} €`);
  };

  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setImagesCompressing(true);
    try {
      const compressed = await Promise.all(
        Array.from(files).map((file) => compressImage(file, 1200, 900, 0.7))
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...compressed],
      }));
    } catch (error) {
      console.error("Failed to compress images:", error);
      alert("Eroare la compresie imagine. Încearcă imagini mai mici.");
    } finally {
      setImagesCompressing(false);
      e.target.value = "";
    }
  };

  // Validate all required fields
  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    const makeError = validateMake(formData.make);
    if (makeError) errors.make = makeError;

    const modelError = validateModel(formData.model);
    if (modelError) errors.model = modelError;

    const priceError = validatePrice(formData.price);
    if (priceError) errors.price = priceError;

    const kmError = validateKm(formData.km);
    if (kmError) errors.km = kmError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = formDataToCarPayload(formData);

    if (editingId) {
      updateCar(editingId, payload);
      setEditingId(null);
    } else {
      addCar(payload);
    }

    setFormData(createEmptyFormData());
    setFieldErrors({});
    setNewImageUrl("");
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleEdit = (car: Car) => {
    setFormData(carToFormData(car));
    setEditingId(car.id);
    setExpandedId(null);
    setNewImageUrl("");
    setFieldErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(createEmptyFormData());
    setFieldErrors({});
    setNewImageUrl("");
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleDeleteCar = (carId: string, carName: string) => {
    if (confirm(`Sigur doriți să ștergeți ${carName}?`)) {
      deleteCar(carId);
      setExpandedId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8e4dc] p-6">
          <h2
            className="text-2xl font-bold text-[#1A2B4A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gestionare Inventar
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[#1A2B4A]/60 hover:text-red-600 transition-colors text-sm font-medium px-3 py-2 rounded hover:bg-red-50"
              title="Deconectare"
            >
              <LogOut className="w-4 h-4" />
              Ieșire
            </button>
            <button
              onClick={onClose}
              className="text-[#1A2B4A]/40 hover:text-[#1A2B4A] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-8 pb-8 border-b border-[#e8e4dc]">
            <h3
              className="text-lg font-bold text-[#1A2B4A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {editingId ? "Editează Mașina" : "Adaugă Mașină Nouă"}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Marca *
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => handleFieldChange("make", e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none transition-colors ${
                    fieldErrors.make
                      ? "border-red-500 focus:border-red-500 bg-red-50/30"
                      : "border-[#e8e4dc] focus:border-[#C9A84C]"
                  }`}
                  placeholder="Volkswagen"
                />
                {fieldErrors.make && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.make}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleFieldChange("model", e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none transition-colors ${
                    fieldErrors.model
                      ? "border-red-500 focus:border-red-500 bg-red-50/30"
                      : "border-[#e8e4dc] focus:border-[#C9A84C]"
                  }`}
                  placeholder="Golf VII"
                />
                {fieldErrors.model && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.model}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Anul
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleFieldChange("year", parseInt(e.target.value))}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Preț *
                </label>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleFieldChange("price", e.target.value)}
                      onBlur={handlePriceBlur}
                      className={`w-full border rounded px-3 py-2 pr-8 text-sm focus:outline-none transition-colors ${
                        fieldErrors.price
                          ? "border-red-500 focus:border-red-500 bg-red-50/30"
                          : "border-[#e8e4dc] focus:border-[#C9A84C]"
                      }`}
                      placeholder="ex: 12.500"
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2B4A] text-sm font-semibold pointer-events-none"
                      aria-hidden
                    >
                      €
                    </span>
                  </div>
                  {fieldErrors.price && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{fieldErrors.price}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Combustibil
                </label>
                <select
                  value={formData.fuel ?? ""}
                  onChange={(e) => handleFieldChange("fuel", e.target.value)}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                >
                  {selectOptions(FUEL_OPTIONS, formData.fuel).map((opt) => (
                    <option key={opt} value={opt === EMPTY_SELECT_LABEL ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Cutie de Viteze
                </label>
                <select
                  value={formData.transmission ?? ""}
                  onChange={(e) => handleFieldChange("transmission", e.target.value)}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                >
                  {selectOptions(TRANSMISSION_OPTIONS, formData.transmission).map((opt) => (
                    <option key={opt} value={opt === EMPTY_SELECT_LABEL ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                Kilometraj (KM)
              </label>
              <input
                type="text"
                name="km"
                value={formData.km ?? ""}
                onChange={(e) => handleFieldChange("km", e.target.value)}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none transition-colors ${
                  fieldErrors.km
                    ? "border-red-500 focus:border-red-500 bg-red-50/30"
                    : "border-[#e8e4dc] focus:border-[#C9A84C]"
                }`}
                placeholder="ex: 128.000"
              />
              {fieldErrors.km && (
                <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.km}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Tip Caroserie
                </label>
                <select
                  value={formData.bodyType ?? ""}
                  onChange={(e) => handleFieldChange("bodyType", e.target.value)}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                >
                  {selectOptions(BODY_TYPE_OPTIONS, formData.bodyType).map((opt) => (
                    <option key={opt} value={opt === EMPTY_SELECT_LABEL ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Capacitate Cilindrică
                </label>
                <input
                  type="text"
                  value={formData.engine ?? ""}
                  onChange={(e) => handleFieldChange("engine", e.target.value)}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                  placeholder="1.995 cm³"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Putere CP
                </label>
                <input
                  type="text"
                  value={formData.power ?? ""}
                  onChange={(e) => handleFieldChange("power", e.target.value)}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                  placeholder="190 CP"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Tracțiune
                </label>
                <select
                  value={formData.drivetrain ?? ""}
                  onChange={(e) => handleFieldChange("drivetrain", e.target.value)}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="">—</option>
                  <option>Față</option>
                  <option>Spate</option>
                  <option>4x4</option>
                  <option>AWD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Tip Stoc
                </label>
                <select
                  value={formData.stockType ?? ""}
                  onChange={(e) => handleFieldChange("stockType", e.target.value)}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="">—</option>
                  <option>Stoc</option>
                  <option>Buyback</option>
                  <option>Comandă</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                  Locație
                </label>
                <select
                  value={formData.location ?? ""}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                >
                  {selectOptions(LOCATION_OPTIONS, formData.location).map((opt) => (
                    <option key={opt} value={opt === EMPTY_SELECT_LABEL ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images section */}
            <div className="mb-4 p-4 bg-[#F8F6F2] rounded">
              <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-3 font-semibold">
                Imagini ({formData.images.length})
              </label>

              {/* Image input mode toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageInputMode("url")}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    imageInputMode === "url"
                      ? "bg-[#1A2B4A] text-white"
                      : "bg-white border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C]"
                  }`}
                >
                  Din URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode("file")}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    imageInputMode === "file"
                      ? "bg-[#1A2B4A] text-white"
                      : "bg-white border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C]"
                  }`}
                >
                  Încarcă Fișier
                </button>
              </div>

              {/* Add image input */}
              {imageInputMode === "url" ? (
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                    placeholder="https://example.com/car.jpg"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="flex items-center gap-1.5 bg-[#1A2B4A] hover:bg-[#243d5e] text-white font-medium px-3 py-2 rounded text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adaugă
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={imagesCompressing}
                    onChange={handleImageFilesChange}
                    className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] disabled:opacity-50 disabled:cursor-not-allowed file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#1A2B4A] file:text-white file:cursor-pointer file:font-medium disabled:file:cursor-not-allowed"
                  />
                  {imagesCompressing ? (
                    <p className="text-xs text-[#C9A84C] mt-1 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                      Se comprimă imaginile...
                    </p>
                  ) : (
                    <p className="text-xs text-[#1A2B4A]/50 mt-1">
                      Imaginile vor fi comprimate automat pentru a economisi spațiu
                    </p>
                  )}
                </div>
              )}

              {/* Image list */}
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 bg-white p-2 rounded border border-[#e8e4dc]"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ImageIcon className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                        <span className="text-xs text-[#1A2B4A]/70 truncate">{img.substring(0, 50)}...</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-1.5 font-semibold">
                Descriere
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="w-full border border-[#e8e4dc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
                rows={3}
                placeholder="Descriere scurtă a mașinii..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#1A2B4A] hover:bg-[#243d5e] text-white font-medium py-2.5 rounded transition-colors"
              >
                {editingId ? "Salvează Modificări" : "Adaugă Mașină"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-white border border-[#e8e4dc] hover:border-[#C9A84C] text-[#1A2B4A] font-medium py-2.5 rounded transition-colors"
                >
                  Anulează
                </button>
              )}
            </div>
          </form>

          {/* Cars list */}
          <div className="space-y-3">
            {cars.map((car) => (
              <div
                key={car.id}
                className="border border-[#e8e4dc] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === car.id ? null : car.id)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-[#F8F6F2] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div>
                      <p className="font-semibold text-[#1A2B4A]">
                        {car.make} {car.model}
                      </p>
                      <p className="text-xs text-[#1A2B4A]/60">
                        {car.year} • {car.price}
                      </p>
                    </div>
                  </div>
                  {expandedId === car.id ? (
                    <ChevronUp className="w-5 h-5 text-[#1A2B4A]/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#1A2B4A]/60" />
                  )}
                </button>

                {expandedId === car.id && (
                  <div className="border-t border-[#e8e4dc] p-4 bg-[#F8F6F2]">
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div>
                        <p className="text-[#1A2B4A]/60 text-xs uppercase">
                          Combustibil
                        </p>
                        <p className="text-[#1A2B4A] font-medium">{car.fuel}</p>
                      </div>
                      <div>
                        <p className="text-[#1A2B4A]/60 text-xs uppercase">
                          Transmisie
                        </p>
                        <p className="text-[#1A2B4A] font-medium">
                          {car.transmission}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#1A2B4A]/60 text-xs uppercase">
                          Kilometraj
                        </p>
                        <p className="text-[#1A2B4A] font-medium">{car.km?.trim() ? car.km : "—"}</p>
                      </div>
                      <div>
                        <p className="text-[#1A2B4A]/60 text-xs uppercase">
                          Imagini
                        </p>
                        <p className="text-[#1A2B4A] font-medium">
                          {car.images.length}
                        </p>
                      </div>
                    </div>

                    {car.description && (
                      <p className="text-sm text-[#1A2B4A]/80 mb-4">
                        {car.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(car)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded text-sm transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editează
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCar(car.id, `${car.make} ${car.model}`)
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Șterge
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {cars.length === 0 && (
              <p className="text-center text-[#1A2B4A]/60 py-8">
                Nu sunt mașini în inventar. Adaugă una pentru a începe.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
