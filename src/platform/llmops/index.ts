type Experiment = { id: string; name: string; score: number; at: string };
const experiments: Experiment[] = [];

export const llmops = {
  recordEval(name: string, score: number) {
    const row = { id: Math.random().toString(36).slice(2), name, score, at: new Date().toISOString() };
    experiments.unshift(row);
    return row;
  },
  list() {
    return experiments.slice(0, 100);
  },
};