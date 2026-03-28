import { TransactionType } from "./transaction";

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  created_at: string;
}
