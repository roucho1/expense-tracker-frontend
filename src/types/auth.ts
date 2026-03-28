// 登入回傳欄位
export interface LoginResponse {
  access_token: string;
  token_type: string;
}
// 使用者資料
export interface userResponse {
  id: number;
  email: string;
  created_at: string;
}
