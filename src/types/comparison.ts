export interface ComparisonRow {
  title: string;
  description: string;
  ours: boolean;
  others: boolean;
}

export interface ComparisonGroup {
  title: string;
  rows: ComparisonRow[];
}

export interface ComparisonLabels {
  ours: string;
  others: string;
}
