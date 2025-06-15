export enum ApprovalStatus {
  Missing = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

export type Requirement = {
  id: number;
  title: string;
  submissionStatus: ApprovalStatus;
  filePath?: string;
  adminComment?: {
    text: string;
    author: string;
  };
};

export type RequirementSet = {
  id: number;
  title: string;
  deadline: string;
  requirements: Requirement[];
};
