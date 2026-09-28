import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@shared/index";

export default function HomePage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
