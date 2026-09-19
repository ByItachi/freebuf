"use client";

import ProjectsFilterPage from "@/components/app/projects-filter-page";

export default function Page() {
  return (
    <ProjectsFilterPage
      title="Shared with me"
      subtitle="Projects shared with you."
      filter={(p) => Boolean(p.shared)}
    />
  );
}