"use client";

import ProjectsFilterPage from "@/components/app/projects-filter-page";

export default function Page() {
  return (
    <ProjectsFilterPage
      title="All projects"
      subtitle="Browse every project in this workspace."
      filter={() => true}
    />
  );
}