export interface Direction {
  status: string;
  label: string;
}

export interface LineStatus {
  line: string;
  text: string;
  status: string;
  directions: Array<Direction>;
}

export type ScrapedLineStatus = {
  line: string;
  text: string;
  status: string;
};
