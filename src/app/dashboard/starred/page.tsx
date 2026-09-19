"use client";

import ProjectsFilterPage from "@/components/app/projects-filter-page";

export default function Page() {
  return (
    <ProjectsFilterPage
      title="Starred"
      subtitle="Projects you have starred for quick access."
      filter={(p) => p.starred}
    />
  );
}