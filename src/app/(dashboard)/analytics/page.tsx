import { Metadata } from "next";
import AnalyticsContainer from "./AnalyticsContainer";

export const metadata: Metadata = {
  title: "收支分析",
};

export default function AnalyticsPage() {
  return <AnalyticsContainer />;
}
