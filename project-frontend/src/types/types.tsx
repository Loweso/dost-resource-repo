export enum ApprovalStatus {
  Missing = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

export type Comment = {
  id: number;
  content: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

export type Submission = {
  approvalStatus: ApprovalStatus;
  filePath: string;
  comments: Comment[];
};

export type Requirement = {
  id: number;
  title: string;
  submission: Submission | null;
};

export type RequirementSet = {
  id: number;
  title: string;
  deadline: string;
  requirements: Requirement[];
};

export type SimpleStudent = {
  id: number;
  profileImageUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  yearLevel: number;
};
