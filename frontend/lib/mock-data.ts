import { AttendanceItem, ClassTask, ScheduleItem } from "@/types/domain";

export const mockSchedules: ScheduleItem[] = [
  { id: "s1", title: "1학년 수학", time: "09:00", room: "A-201" },
  { id: "s2", title: "2학년 과학", time: "11:00", room: "B-101" },
  { id: "s3", title: "방과후 코딩", time: "16:00", room: "Lab-3" },
];

export const mockAttendance: AttendanceItem[] = [
  { id: "a1", studentName: "민준", present: true },
  { id: "a2", studentName: "서연", present: false },
  { id: "a3", studentName: "지우", present: true },
  { id: "a4", studentName: "하윤", present: true },
];

export const mockTasks: ClassTask[] = [
  {
    id: "k1",
    className: "중등 과학 집중반",
    topic: "실험 리포트 검수",
    assignee: "김나영",
    status: "ongoing",
  },
  {
    id: "k2",
    className: "초등 영어 베이직",
    topic: "출석 누락 보정",
    assignee: "박현수",
    status: "completed",
  },
  {
    id: "k3",
    className: "수능 수학 특강",
    topic: "퀴즈 배포",
    assignee: "이주원",
    status: "ongoing",
  },
];
