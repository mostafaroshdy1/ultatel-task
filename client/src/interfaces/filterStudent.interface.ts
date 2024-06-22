export interface FilterStudent {
  name?: string | null;
  minAge?: number | null;
  maxAge?: number | null;
  country?: string | null;
  gender?: string | null;
  limit: number;
  offset: number;
  orderBy?: string | null;
  order?: string | null;
}
