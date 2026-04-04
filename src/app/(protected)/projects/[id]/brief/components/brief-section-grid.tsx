"use client";

// Icons are imported in config
// Icons are imported in config
import { BriefSectionCard } from "./brief-section-card";
import { useParams } from "next/navigation";
import Link from "next/link";

import { BRIEF_SECTIONS } from "@/config/brief-sections";

interface BriefSectionsGridProps {
  completedSections: string[];
}

export function BriefSectionsGrid({
  completedSections,
}: BriefSectionsGridProps) {
  const params = useParams();
  const projectId = params.id as string;

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
