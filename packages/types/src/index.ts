export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export type Video = {
  id: string;
  userId: string;
  title: string;
  url: string;
  duration: number;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
};

export type Workspace = {
  id: string;
  name: string;
  ownerId: string;
};
