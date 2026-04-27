"use client";

import { useState } from "react";
import MainBlockCard from "@/components/ui/main-block-card";
import { FileText, CloudUpload, Trash2, Download } from "lucide-react";
import { DocumentAttachment } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { storageService } from "@/lib/services/storage";
import { projectsService } from "@/lib/services/projects";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

// Extend DocumentAttachment to include size and created_at for UI display
interface ExtendedDocumentAttachment extends DocumentAttachment {
  size?: number;
  created_at?: string;
}

interface DocumentationPlansSectionProps {
  projectId: string;
  initialData?: DocumentAttachment[]; // Input data might not have size/created_at
}

// Helper to format bytes
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Helper to get file icon and color
const getFileIconData = (filename: string) => {
  const ext = filename.split(".").pop()?.toUpperCase() || "";

  if (["PDF"].includes(ext)) {
    return {
      bg: "bg-red-50",
      text: "text-red-600",
      label: "PDF",
    };
  }
  if (["DWG", "DXF"].includes(ext)) {
    return {
      bg: "bg-orange-50",
      text: "text-orange-600",
      label: "DWG",
    };
  }
  if (["JPG", "JPEG", "PNG", "WEBP"].includes(ext)) {
    return {
      bg: "bg-purple-50",
      text: "text-purple-600",
      label: "JPG",
    };
  }
  if (["XLS", "XLSX", "CSV"].includes(ext)) {
    return {
      bg: "bg-green-50",
      text: "text-green-600",
      label: "XLS",
    };
  }
  if (["DOC", "DOCX"].includes(ext)) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "DOC",
    };
  }

  return {
    bg: "bg-gray-50",
    text: "text-gray-600",
    label: ext.slice(0, 3),
  };
};

export function DocumentationPlansSection({
  projectId,
  initialData = [],
}: DocumentationPlansSectionProps) {
  const router = useRouter();
  // Cast initial data to extended type to handle missing props gracefully
  const [documents, setDocuments] = useState<ExtendedDocumentAttachment[]>(
    initialData as ExtendedDocumentAttachment[],
  );
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(
    null,
  );

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    category: "plan_bti" | "measurement_plan",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    e.target.value = "";
    setUploadingCategory(category);

    try {
      const result = await storageService.uploadProjectDocument(file);

      // Determine the category type compatible with DocumentAttachment
      // Mapping "measurement_plan" to "cadastral" if needed, or keeping it if types/index.ts allows loose string (it doesn't).
      // Types say: "plan_bti" | "instruction" | "cadastral" | "other"
      // We will map "measurement_plan" -> "cadastral" for data consistency
      const uploadCategory =
        category === "measurement_plan" ? "cadastral" : category;

      const newDoc: ExtendedDocumentAttachment = {
        id: crypto.randomUUID(),
        name: result.name, // Will be overridden if we want display name vs filename? Using result.name which is original name
        url: result.url,
        type: file.type,
        category: uploadCategory,
        size: result.size,
        created_at: new Date().toISOString(),
      };

      const updatedDocs = [...documents, newDoc];
      setDocuments(updatedDocs);

      const brief = await projectsService.getProjectBrief(projectId);
      const currentObjectInfo =
        (brief?.object_info as Record<string, unknown>) || {};

      await projectsService.updateProjectBrief(projectId, {
        object_info: {
          ...currentObjectInfo,
          documents: updatedDocs,
        },
      });

      toast.success("Файл успешно загружен");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при загрузке файла");
    } finally {
      setUploadingCategory(null);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      const updatedDocs = documents.filter((d) => d.id !== docId);
      setDocuments(updatedDocs);

      const brief = await projectsService.getProjectBrief(projectId);
      const currentObjectInfo =
        (brief?.object_info as Record<string, unknown>) || {};

      await projectsService.updateProjectBrief(projectId, {
        object_info: {
          ...currentObjectInfo,
          documents: updatedDocs,
        },
      });

      toast.success("Файл удален");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при удалении файла");
      // Revert state on error if needed
    }
  };

  const btiPlans = documents.filter((d) => d.category === "plan_bti");
  // Filter for both "cadastral" (our mapped type) and potentially legacay/other types if logic changes
  const measurementPlans = documents.filter((d) => d.category === "cadastral");

  const renderDocItem = (doc: ExtendedDocumentAttachment) => {
    const iconData = getFileIconData(doc.name);

    return (
      <div
        key={doc.id}
        className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div
            className={`size-12 rounded-lg ${iconData.bg} flex items-center justify-center shrink-0`}
          >
            <span className={`text-[10px] font-bold ${iconData.text}`}>
              {iconData.label}
            </span>
          </div>
          <div>
            <p
              className="font-medium text-sm text-gray-900 truncate max-w-[200px]"
              title={doc.name}
            >
              {doc.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>
                {doc.created_at
                  ? format(new Date(doc.created_at), "dd.MM.yyyy")
                  : "Unknown Date"}
              </span>
              <span className="size-0.5 rounded-full bg-gray-300" />
              <span>{doc.size ? formatFileSize(doc.size) : ""}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download className="size-4" />
          </a>
          <button
            onClick={() => handleDelete(doc.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <MainBlockCard className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <FileText className="size-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Документация и Планы</h3>
          <p className="text-sm text-gray-500">
            Планы БТИ и результаты обмеров.
          </p>
        </div>
      </div>
      <Separator />
      <div className="grid md:grid-cols-2 gap-8">
        {/* Column 1: BTI Plans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Планы БТИ</h4>
            <div className="relative">
              <input
                type="file"
                id="upload-bti"
                className="hidden"
                onChange={(e) => handleUpload(e, "plan_bti")}
                disabled={uploadingCategory !== null}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto p-0 font-medium"
                onClick={() => document.getElementById("upload-bti")?.click()}
                disabled={uploadingCategory !== null}
              >
                {uploadingCategory === "plan_bti" ? (
                  "Загрузка..."
                ) : (
                  <>
                    <CloudUpload className="size-4 mr-2" />
                    Загрузить
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {btiPlans.length === 0 && (
              <div className="border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                <FileText className="size-8 mb-2 opacity-50" />
                <p className="text-sm">Нет загруженных планов</p>
              </div>
            )}
            {btiPlans.map(renderDocItem)}
          </div>
        </div>

        {/* Column 2: Measurement Plans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Обмерный план</h4>
            <div className="relative">
              <input
                type="file"
                id="upload-measurement"
                className="hidden"
                onChange={(e) => handleUpload(e, "measurement_plan")}
                disabled={uploadingCategory !== null}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto p-0 font-medium"
                onClick={() =>
                  document.getElementById("upload-measurement")?.click()
                }
                disabled={uploadingCategory !== null}
              >
                {uploadingCategory === "measurement_plan" ? (
                  "Загрузка..."
                ) : (
                  <>
                    <CloudUpload className="size-4 mr-2" />
                    Загрузить
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {measurementPlans.length === 0 && (
              <div className="border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                <FileText className="size-8 mb-2 opacity-50" />
                <p className="text-sm">Нет загруженных обмеров</p>
              </div>
            )}
            {measurementPlans.map(renderDocItem)}
          </div>
        </div>
      </div>
    </MainBlockCard>
  );
}
