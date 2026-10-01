import axios from "axios";
import type { AttendanceItem, ClassTask, ScheduleItem } from "../types/domain";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { detail?: string } | null;
      return Promise.reject(
        new Error(data?.detail ?? `REQUEST_FAILED_${error.response.status}`),
      );
    }
    return Promise.reject(error);
  },
);

type BasePayload = { accessToken: string };
type ScheduleResponse = { id: number; title: string; time: string; room: string };
type AttendanceResponse = { id: number; student_name: string; present: boolean };
type ClassTaskResponse = {
  id: number;
  class_name: string;
  topic: string;
  assignee: string;
  status: "ongoing" | "completed";
};

function toScheduleItem(data: ScheduleResponse): ScheduleItem {
  return { id: String(data.id), title: data.title, time: data.time, room: data.room };
}

function toAttendanceItem(data: AttendanceResponse): AttendanceItem {
  return { id: String(data.id), studentName: data.student_name, present: data.present };
}

function toClassTask(data: ClassTaskResponse): ClassTask {
  return {
    id: String(data.id),
    className: data.class_name,
    topic: data.topic,
    assignee: data.assignee,
    status: data.status,
  };
}

export async function listSchedules({ accessToken }: BasePayload) {
  const { data } = await api.get<ScheduleResponse[]>("/schedules/", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data.map(toScheduleItem);
}

export async function createSchedule(
  payload: BasePayload & { title: string; time: string; room: string },
) {
  const { accessToken, ...body } = payload;
  const { data } = await api.post<ScheduleResponse>("/schedules/", body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return toScheduleItem(data);
}

export async function updateSchedule(
  payload: BasePayload & { id: string; title: string; time: string; room: string },
) {
  const { id, accessToken, ...body } = payload;
  const { data } = await api.patch<ScheduleResponse>(`/schedules/${id}/`, body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return toScheduleItem(data);
}

export async function deleteSchedule(payload: BasePayload & { id: string }) {
  await api.delete(`/schedules/${payload.id}/`, {
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  });
}

export async function listAttendance({ accessToken }: BasePayload) {
  const { data } = await api.get<AttendanceResponse[]>("/attendance/", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data.map(toAttendanceItem);
}

export async function createAttendance(
  payload: BasePayload & { studentName: string; present?: boolean },
) {
  const { data } = await api.post<AttendanceResponse>(
    "/attendance/",
    {
      student_name: payload.studentName,
      present: payload.present ?? false,
    },
    {
      headers: { Authorization: `Bearer ${payload.accessToken}` },
    },
  );
  return toAttendanceItem(data);
}

export async function updateAttendance(
  payload: BasePayload & { id: string; studentName?: string; present?: boolean },
) {
  const body: Record<string, string | boolean> = {};
  if (typeof payload.studentName === "string") body.student_name = payload.studentName;
  if (typeof payload.present === "boolean") body.present = payload.present;

  const { data } = await api.patch<AttendanceResponse>(`/attendance/${payload.id}/`, body, {
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  });
  return toAttendanceItem(data);
}

export async function deleteAttendance(payload: BasePayload & { id: string }) {
  await api.delete(`/attendance/${payload.id}/`, {
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  });
}

export async function listClassTasks({ accessToken }: BasePayload) {
  const { data } = await api.get<ClassTaskResponse[]>("/class-tasks/", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data.map(toClassTask);
}

export async function createClassTask(
  payload: BasePayload & {
    className: string;
    topic: string;
    assignee: string;
    status?: "ongoing" | "completed";
  },
) {
  const { data } = await api.post<ClassTaskResponse>(
    "/class-tasks/",
    {
      class_name: payload.className,
      topic: payload.topic,
      assignee: payload.assignee,
      status: payload.status ?? "ongoing",
    },
    {
      headers: { Authorization: `Bearer ${payload.accessToken}` },
    },
  );
  return toClassTask(data);
}

export async function updateClassTask(
  payload: BasePayload & {
    id: string;
    className?: string;
    topic?: string;
    assignee?: string;
    status?: "ongoing" | "completed";
  },
) {
  const body: Record<string, string> = {};
  if (typeof payload.className === "string") body.class_name = payload.className;
  if (typeof payload.topic === "string") body.topic = payload.topic;
  if (typeof payload.assignee === "string") body.assignee = payload.assignee;
  if (typeof payload.status === "string") body.status = payload.status;

  const { data } = await api.patch<ClassTaskResponse>(`/class-tasks/${payload.id}/`, body, {
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  });
  return toClassTask(data);
}

export async function deleteClassTask(payload: BasePayload & { id: string }) {
  await api.delete(`/class-tasks/${payload.id}/`, {
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  });
}
