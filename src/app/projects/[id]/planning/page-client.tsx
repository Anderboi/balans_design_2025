"use client";

import { useState } from "react";
import { PlanningVariant } from "@/types/planning";
import { PlanningVariantCard } from "./components/planning-variant-card";
import { UploadVariantCard } from "./components/upload-variant-card";
import { PlanningVariantDetailDialog } from "./components/planning-variant-detail-dialog";
import { UploadVariantDialog } from "./components/upload-variant-dialog";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { planningVariantsService } from "@/lib/services/planning-variants";
import { CancelApprovalDialog } from "./components/cancel-approval-dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { syncPlanningStatusAction } from "@/lib/actions/concept-sync";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
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

      // Sync stage status
      await syncPlanningStatusAction(projectId);

      router.refresh();
    } catch (error) {
      console.error("Error approving variant:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancelApproval = async () => {
    try {
      setIsCanceling(true);
      await planningVariantsService.cancelApproval(projectId, supabase);

      // Update local state
      setVariants(
        variants.map((v) => ({
          ...v,
          approved: false,
          approved_at: null,
        })),
      );

      if (selectedVariant) {
        setSelectedVariant({
          ...selectedVariant,
          approved: false,
          approved_at: null,
        });
      }

      // Sync stage status
      await syncPlanningStatusAction(projectId);

      setIsCancelDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error canceling approval:", error);
    } finally {
      setIsCanceling(false);
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
        {approvedVariant ? (
          <Alert className="bg-green-50 border-green-200 text-green-900 rounded-2xl p-6 flex gap-4">
            {/* <div className="flex items-center gap-4"> */}
            <div className="size-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-6 text-green-600" />
            </div>
            <div>
              <AlertTitle className="text-green-800 font-bold text-lg mb-1">
                Планировочное решение утверждено
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Клиент утвердил &quot;{approvedVariant.title}&quot;. Можно
                приступать к разработке визуализаций и рабочей документации.
              </AlertDescription>
            </div>
            {/* </div> */}
          </Alert>
        ) : (
          <Alert className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl p-6 flex gap-4">
            {/* <div className="flex items-center gap-4"> */}
            <div className="size-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle className="size-6 text-amber-600" />
            </div>
            <div>
              <AlertTitle className="text-amber-800 font-bold text-lg mb-1">
                Требуется согласование
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                Пожалуйста, выберите один из предложенных вариантов планировки
                для перехода к следующему этапу.
              </AlertDescription>
            </div>
            {/* </div> */}
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
              onCancelApproval={() => setIsCancelDialogOpen(true)}
              isApproving={isApproving}
            />
          ))}
        </div>
      </div>

      <PlanningVariantDetailDialog
        variant={selectedVariant}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onApprove={handleApprove}
        isApproving={isApproving}
        onUpdateVariant={(updated) => {
          setVariants(variants.map((v) => (v.id === updated.id ? updated : v)));
          if (selectedVariant?.id === updated.id) {
            setSelectedVariant(updated);
          }
        }}
        onDeleteVariant={async (id) => {
          setVariants(variants.filter((v) => v.id !== id));
          if (selectedVariant?.id === id) {
            setSelectedVariant(null);
            setIsDetailOpen(false);
          }
          await syncPlanningStatusAction(projectId);
        }}
      />

      <UploadVariantDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        projectId={projectId}
      />

      <CancelApprovalDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={handleCancelApproval}
        isCanceling={isCanceling}
      />
    </PageContainer>
  );
}
