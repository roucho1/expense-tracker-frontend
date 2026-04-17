import { Metadata } from "next";
import TransactionsContainer from "./TransactionsContainer";

export const metadata: Metadata = {
  title: "記帳紀錄",
};

export default function TransactionsPage() {
  return <TransactionsContainer />;
}
