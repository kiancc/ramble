export type EnergyLevel = 'Brain Dead' | 'Normal' | 'Hyperfocus';

export type OraclePlacement = 'On Fire' | 'Momentum Builder' | 'Rabbit Hole' | 'The Vault';

export type TaskSize = 'Small' | 'Medium' | 'Large' | 'XL';

export type TaskStatus = 'To Do' | 'Paused' | 'Done';

export type IcnuScores = {
  interest: number;
  challenge: number;
  novelty: number;
  urgency: number;
};

export type Task = {
  id: string;
  taskName: string;
  category: string;
  taskSize: TaskSize;
  icnuScores: IcnuScores;
  energyLevel: EnergyLevel;
  nextPhysicalAction: string;
  deadline: string | null;
  oraclePlacement: OraclePlacement;
  status: TaskStatus;
  createdAt: string;
};
