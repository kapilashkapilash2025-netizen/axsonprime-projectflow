import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  console.log(
    "Seeding sample data (marked isSample=true, safe to reset from Settings)...",
  );

  await prisma.project.deleteMany({ where: { isSample: true } });

  // Project 1: a healthy, active project close to release.
  const projectFlow = await prisma.project.create({
    data: {
      name: "ProjectFlow Core",
      description:
        "The ProjectFlow dashboard itself — dogfooding our own tool to track its development.",
      status: "ACTIVE",
      priority: "HIGH",
      techStack: "Next.js, TypeScript, Prisma, SQLite, Tailwind CSS",
      repositoryUrl: "https://github.com/AXSONprime/axsonprime-projectflow",
      targetReleaseDate: daysFromNow(21),
      progress: 72,
      isSample: true,
      phases: {
        create: [
          { name: "Architecture & Schema", order: 0, status: "COMPLETED" },
          { name: "Core Workflows", order: 1, status: "IN_PROGRESS" },
          { name: "Polish & Release", order: 2, status: "NOT_STARTED" },
        ],
      },
    },
    include: { phases: true },
  });

  const [archPhase, coreWorkPhase] = projectFlow.phases;

  await prisma.task.createMany({
    data: [
      {
        projectId: projectFlow.id,
        phaseId: archPhase.id,
        title: "Design Prisma schema for domain entities",
        status: "COMPLETED",
        priority: "HIGH",
        assignee: "Alex",
        completedAt: daysFromNow(-10),
      },
      {
        projectId: projectFlow.id,
        phaseId: archPhase.id,
        title: "Implement deterministic health score",
        status: "COMPLETED",
        priority: "HIGH",
        assignee: "Alex",
        completedAt: daysFromNow(-7),
      },
      {
        projectId: projectFlow.id,
        phaseId: coreWorkPhase.id,
        title: "Build project CRUD screens",
        status: "IN_PROGRESS",
        priority: "HIGH",
        assignee: "Jamie",
        dueDate: daysFromNow(3),
      },
      {
        projectId: projectFlow.id,
        phaseId: coreWorkPhase.id,
        title: "Wire up quality-gate checklist UI",
        status: "READY",
        priority: "MEDIUM",
        assignee: "Jamie",
        dueDate: daysFromNow(6),
        labels: "frontend,quality",
      },
      {
        projectId: projectFlow.id,
        phaseId: coreWorkPhase.id,
        title: "Add Playwright smoke test for dashboard",
        status: "BACKLOG",
        priority: "MEDIUM",
        labels: "testing",
      },
    ],
  });

  await prisma.issue.createMany({
    data: [
      {
        projectId: projectFlow.id,
        title: "Dashboard cards should show a loading skeleton",
        description:
          "Currently the dashboard flashes empty state before data loads.",
        type: "FEATURE",
        severity: "LOW",
        status: "OPEN",
      },
      {
        projectId: projectFlow.id,
        title: "Add rate limiting note to SECURITY.md",
        type: "DOCUMENTATION",
        severity: "LOW",
        status: "RESOLVED",
        resolutionNotes: "Documented in docs/SECURITY_BASELINE.md.",
      },
    ],
  });

  await prisma.qualityGate.createMany({
    data: [
      {
        projectId: projectFlow.id,
        check: "LINT",
        passed: true,
        checkedAt: daysFromNow(-1),
      },
      {
        projectId: projectFlow.id,
        check: "TYPE_CHECK",
        passed: true,
        checkedAt: daysFromNow(-1),
      },
      {
        projectId: projectFlow.id,
        check: "UNIT_TESTS",
        passed: true,
        checkedAt: daysFromNow(-1),
      },
      {
        projectId: projectFlow.id,
        check: "PRODUCTION_BUILD",
        passed: true,
        checkedAt: daysFromNow(-1),
      },
      {
        projectId: projectFlow.id,
        check: "E2E_TESTS",
        passed: false,
        notes: "Playwright suite in progress.",
      },
      {
        projectId: projectFlow.id,
        check: "SECURITY_REVIEW",
        passed: true,
        checkedAt: daysFromNow(-2),
      },
      {
        projectId: projectFlow.id,
        check: "ACCESSIBILITY_REVIEW",
        passed: false,
        notes: "Keyboard nav audit pending.",
      },
      {
        projectId: projectFlow.id,
        check: "DOCUMENTATION_REVIEW",
        passed: true,
        checkedAt: daysFromNow(-1),
      },
    ],
  });

  await prisma.milestone.createMany({
    data: [
      {
        projectId: projectFlow.id,
        name: "MVP feature-complete",
        dueDate: daysFromNow(10),
        completed: false,
      },
      {
        projectId: projectFlow.id,
        name: "v0.1.0 public release",
        dueDate: daysFromNow(21),
        completed: false,
      },
    ],
  });

  await prisma.release.create({
    data: {
      projectId: projectFlow.id,
      version: "0.1.0-rc1",
      changelogUpdated: true,
      notes:
        "Release candidate pending E2E coverage and accessibility sign-off.",
    },
  });

  await prisma.gitHubLink.create({
    data: {
      projectId: projectFlow.id,
      repositoryUrl: "https://github.com/AXSONprime/axsonprime-projectflow",
      branchName: "main",
      pullRequestStatus: "open",
      ciStatus: "passing",
      reviewStatus: "in_review",
      mergeStatus: "unmerged",
    },
  });

  await prisma.activityEvent.createMany({
    data: [
      {
        projectId: projectFlow.id,
        type: "task_completed",
        message: "Completed 'Implement deterministic health score'",
      },
      {
        projectId: projectFlow.id,
        type: "quality_gate_passed",
        message: "Security review passed",
      },
      {
        projectId: projectFlow.id,
        type: "issue_created",
        message: "Opened issue: dashboard loading skeleton",
      },
    ],
  });

  // Project 2: a paused side project, moderate health.
  const cliTool = await prisma.project.create({
    data: {
      name: "Dotfiles Sync CLI",
      description:
        "A small CLI for syncing developer dotfiles across machines.",
      status: "PAUSED",
      priority: "LOW",
      techStack: "Go",
      repositoryUrl: "https://github.com/AXSONprime/dotfiles-sync",
      progress: 35,
      isSample: true,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: cliTool.id,
        title: "Support YAML config",
        status: "BACKLOG",
        priority: "MEDIUM",
      },
      {
        projectId: cliTool.id,
        title: "Write install script",
        status: "COMPLETED",
        priority: "MEDIUM",
        completedAt: daysFromNow(-40),
      },
      {
        projectId: cliTool.id,
        title: "Add Windows support",
        status: "BLOCKED",
        priority: "LOW",
        dueDate: daysFromNow(-5),
      },
    ],
  });

  await prisma.issue.createMany({
    data: [
      {
        projectId: cliTool.id,
        title: "Sync overwrites local changes without confirmation",
        type: "BUG",
        severity: "HIGH",
        status: "OPEN",
        description:
          "Running sync can silently clobber uncommitted local edits.",
      },
    ],
  });

  await prisma.qualityGate.createMany({
    data: [
      { projectId: cliTool.id, check: "LINT", passed: true },
      {
        projectId: cliTool.id,
        check: "UNIT_TESTS",
        passed: false,
        notes: "Coverage regressed after refactor.",
      },
    ],
  });

  await prisma.activityEvent.create({
    data: {
      projectId: cliTool.id,
      type: "issue_created",
      message: "Opened issue: sync overwrites local changes",
    },
  });

  // Project 3: an early-stage planning project, no data yet to skew the score.
  const mobileApp = await prisma.project.create({
    data: {
      name: "Habit Tracker Mobile App",
      description:
        "A minimal, privacy-respecting habit tracker for iOS and Android.",
      status: "PLANNING",
      priority: "MEDIUM",
      techStack: "React Native, TypeScript, SQLite",
      progress: 5,
      isSample: true,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: mobileApp.id,
        title: "Sketch onboarding flow",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
      },
      {
        projectId: mobileApp.id,
        title: "Pick local storage strategy",
        status: "READY",
        priority: "HIGH",
      },
    ],
  });

  await prisma.activityEvent.create({
    data: {
      projectId: mobileApp.id,
      type: "task_created",
      message: "Added task: sketch onboarding flow",
    },
  });

  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });

  console.log("Seed complete: 3 sample projects created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
