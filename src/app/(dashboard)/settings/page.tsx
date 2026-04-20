import { Metadata } from "next";
import SettingsContainer from "./SettingsContainer";

export const metadata: Metadata = {
  title: "設定",
};

export default function SettingsPage() {
  return <SettingsContainer />;
}
