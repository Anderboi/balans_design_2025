import { BriefSectionCard } from "./brief-section-card";
import Link from "next/link";

import { BRIEF_SECTIONS } from "@/config/brief-sections";

interface BriefSectionsGridProps {
  completedSections: string[];
  projectId:string;
}

export function BriefSectionsGrid({
  completedSections, projectId
}: BriefSectionsGridProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {BRIEF_SECTIONS.map((section) => (
        <Link
          href={`/projects/${projectId}/brief/${section.id}`}
          key={section.id}
        >
          <BriefSectionCard
            title={section.title}
            description={section.description}
            icon={section.icon}
            completed={completedSections.includes(section.id)}
          />
        </Link>
      ))}
    </div>
  );
}
