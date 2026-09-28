import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@shared/index";

export default function SignupPage() {
  redirect(`/${DEFAULT_LOCALE}/signup`);
}
