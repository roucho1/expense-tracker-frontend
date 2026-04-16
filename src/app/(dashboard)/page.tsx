import { Metadata } from "next";
import DashboardContainer from "./HomeContainer";

export const metadata: Metadata = {
  title: "首頁 | Expense Tracker",
};

export default function HomePage() {
  return <DashboardContainer />;
}
