export type ScheduleItem = {
  id: string;
  title: string;
  time: string;
  room: string;
};

export type AttendanceItem = {
  id: string;
  studentName: string;
  present: boolean;
};

export type KanbanStatus = "ongoing" | "completed";

export type ClassTask = {
  id: string;
  className: string;
  topic: string;
  assignee: string;
  status: KanbanStatus;
};
