export const autonomy = {
  plan(goal: string) {
    return {
      goal,
      steps: [
        "Decompose goal",
        "Select agents",
        "Run workflow",
        "Evaluate outcome",
        "Persist memory",
      ],
    };
  },
};