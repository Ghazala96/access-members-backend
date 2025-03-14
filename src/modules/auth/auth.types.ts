export interface DecodedAuthToken {
  sessionId: string;
  sub: string;
  role: string;
  roleTags: string[];
}
