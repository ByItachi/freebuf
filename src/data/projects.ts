export type DemoProject = {
  id: string;
  name: string;
  date: string;
  hue: string;
  empty?: boolean;
  starred?: boolean;
};

export const PROJECTS: DemoProject[] = [
  {
    id: "0",
    name: "Ascii Cloud Solutions",
    date: "Edited May 1, 2026",
    hue: "from-[#dbe7ff] to-[#f3e8ff]",
  },
  {
    id: "1",
    name: "Your Legal Space",
    date: "Edited Mar 11, 2026",
    hue: "from-[#f1f0ea] to-[#f7f4ed]",
    empty: true,
  },
  {
    id: "2",
    name: "design-patis-sketch",
    date: "Edited Jan 5, 2026",
    hue: "from-[#ffe9d6] to-[#ffe3ec]",
    starred: true,
  },
];

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id);
}
