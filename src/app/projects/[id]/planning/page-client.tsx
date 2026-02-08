"use client";

import { useState } from "react";
import { PlanningVariant } from "@/types/planning";
import { PlanningVariantCard } from "./components/planning-variant-card";
import { UploadVariantCard } from "./components/upload-variant-card";
import { PlanningVariantDetailDialog } from "./components/planning-variant-detail-dialog";
import { UploadVariantDialog } from "./components/upload-variant-dialog";
import { AlertCircle } from "lucide-react";
import { planningVariantsService } from "@/lib/services/planning-variants";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PlanningPageClientProps {
  initialVariants: PlanningVariant[];
  projectId: string;
  projectName: string;
}

export default function PlanningPageClient({
  initialVariants,
  projectId,
  projectName,
}: PlanningPageClientProps) {
  const [variants, setVariants] = useState<PlanningVariant[]>(initialVariants);
  const [selectedVariant, setSelectedVariant] =
    useState<PlanningVariant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Find if any variant is approved
  const approvedVariant = variants.find((v) => v.approved);

  const handleView = (variant: PlanningVariant) => {
    setSelectedVariant(variant);
    setIsDetailOpen(true);
  };

  const handleApprove = async (variant: PlanningVariant) => {
    try {
      setIsApproving(true);
      await planningVariantsService.approvePlanningVariant(
        variant.id,
        projectId,
        supabase,
      );

      // Update local state to reflect changes immediately
      setVariants(
        variants.map((v) => ({
          ...v,
          approved: v.id === variant.id,
          approved_at: v.id === variant.id ? new Date().toISOString() : null,
        })),
      );

      if (selectedVariant?.id === variant.id) {
        setSelectedVariant({
          ...selectedVariant,
          approved: true,
          approved_at: new Date().toISOString(),
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Error approving variant:", error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <PageContainer>
      {/* Header & Breadcrumbs */}
      <div className="space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/projects/${projectId}`}>{projectName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="w-3 h-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-black">
                Планировочные решения
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader title="Планировочные решения" />
      </div>

      {/* Main Content */}
      <div className="mt-8 space-y-8">
        {!approvedVariant && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold mb-1">
              Требуется согласование
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              Пожалуйста, выберите один из предложенных вариантов планировки для
              перехода к следующему этапу.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upload Card - Always first */}
          <UploadVariantCard onClick={() => setIsUploadOpen(true)} />

          {/* Variants */}
          {variants.map((variant) => (
            <PlanningVariantCard
              key={variant.id}
              variant={variant}
              onView={handleView}
              onApprove={handleApprove}
              isApproving={isApproving}
            />
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <PlanningVariantDetailDialog
        variant={selectedVariant}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onApprove={handleApprove}
        isApproving={isApproving}
      />

      <UploadVariantDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        projectId={projectId}
      />
    </PageContainer>
  );
}
