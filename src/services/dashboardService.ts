import { calculateProjectHealthScore } from "@/domain/healthScore";
import { calculateReleaseReadiness } from "@/domain/releaseReadiness";
import { prisma } from "@/lib/db";

export interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  openTasks: number;
  blockedTasks: number;
  upcomingMilestones: {
    id: string;
    name: string;
    dueDate: Date | null;
    projectName: string;
  }[];
  projectHealth: { id: string; name: string; score: number }[];
  recentActivity: {
    id: string;
    message: string;
    createdAt: Date;
    projectName: string;
  }[];
  qualityStatus: { totalGates: number; passedGates: number };
  releaseReadiness: { ready: number; atRisk: number; notReady: number };
}

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const projects = await prisma.project.findMany({
    include: {
      tasks: { select: { status: true, dueDate: true, completedAt: true } },
      issues: { select: { status: true, severity: true } },
      qualityGates: { select: { check: true, passed: true } },
      milestones: {
        select: { id: true, name: true, dueDate: true, completed: true },
      },
      releases: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const allTasks = projects.flatMap((p) => p.tasks);
  const allGates = projects.flatMap((p) => p.qualityGates);

  const upcomingMilestones = projects
    .flatMap((p) =>
      p.milestones
        .filter((m) => !m.completed)
        .map((m) => ({ ...m, projectName: p.name })),
    )
    .sort(
      (a, b) =>
        (a.dueDate?.getTime() ?? Infinity) - (b.dueDate?.getTime() ?? Infinity),
    )
    .slice(0, 5);

  const projectHealth = projects.map((p) => ({
    id: p.id,
    name: p.name,
    score: calculateProjectHealthScore({
      tasks: p.tasks,
      issues: p.issues,
      qualityGates: p.qualityGates,
      milestones: p.milestones,
      now,
    }).score,
  }));

  const readinessByProject = projects.map(
    (p) =>
      calculateReleaseReadiness({
        requiredTasksTotal: p.tasks.length,
        requiredTasksCompleted: p.tasks.filter((t) => t.status === "COMPLETED")
          .length,
        criticalOpenIssues: p.issues.filter(
          (i) =>
            i.severity === "CRITICAL" &&
            (i.status === "OPEN" || i.status === "IN_PROGRESS"),
        ).length,
        qualityGates: p.qualityGates,
        documentationReviewed:
          p.qualityGates.find((g) => g.check === "DOCUMENTATION_REVIEW")
            ?.passed ?? false,
        changelogUpdated: p.releases[0]?.changelogUpdated ?? false,
        versionAssigned: Boolean(p.releases[0]?.version),
      }).status,
  );

  const recentActivityRows = await prisma.activityEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { project: { select: { name: true } } },
  });

  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "ACTIVE").length,
    completedTasks: allTasks.filter((t) => t.status === "COMPLETED").length,
    openTasks: allTasks.filter(
      (t) => t.status !== "COMPLETED" && t.status !== "BLOCKED",
    ).length,
    blockedTasks: allTasks.filter((t) => t.status === "BLOCKED").length,
    upcomingMilestones: upcomingMilestones.map((m) => ({
      id: m.id,
      name: m.name,
      dueDate: m.dueDate,
      projectName: m.projectName,
    })),
    projectHealth,
    recentActivity: recentActivityRows.map((a) => ({
      id: a.id,
      message: a.message,
      createdAt: a.createdAt,
      projectName: a.project.name,
    })),
    qualityStatus: {
      totalGates: allGates.length,
      passedGates: allGates.filter((g) => g.passed).length,
    },
    releaseReadiness: {
      ready: readinessByProject.filter((s) => s === "READY").length,
      atRisk: readinessByProject.filter((s) => s === "AT_RISK").length,
      notReady: readinessByProject.filter((s) => s === "NOT_READY").length,
    },
  };
}
