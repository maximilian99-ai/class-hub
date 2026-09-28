import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@shared/index";

export default function LoginPage() {
  redirect(`/${DEFAULT_LOCALE}/login`);
}
