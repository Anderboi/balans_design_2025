import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import { StyleForm } from "../components/forms/style-form";
import PageContainer from "@/components/ui/page-container";
import { createClient } from "@/lib/supabase/server";
import { ProjectPageHeader } from "@/components/project-page-header";

export default async function BriefStylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [project, brief] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    projectsService.getProjectBrief(id, supabase),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Стилевые предпочтения"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <StyleForm 
          projectId={id} 
          initialData={brief?.style as { preferences?: string; pinterestLink?: string; } | undefined} 
        />
      </div>
    </PageContainer>
  );
}
