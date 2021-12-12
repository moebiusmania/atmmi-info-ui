import { useState, useEffect } from "preact/hooks";

import Card from "./Card";

type LineStatus = {
  line: string;
  text: string;
  status: string;
};

const mock: LineStatus = {
  line: "foo",
  text: "bar",
  status: "pippo",
};

const mockData: LineStatus[] = Array(10).fill(mock);

const Status = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LineStatus[]>(mockData);
  const resource: string = "https://atmmi-info-api.herokuapp.com/status";

  const loadingClass = (): string => {
    const value: number = Math.ceil(Math.random() * 4);
    return `h-4 bg-gray-400 rounded w-${value}/4`;
  };

  const lineClass = (line: string): string =>
    `badge bg-line-${line} rounded-none border-0`;

  useEffect(() => {
    fetch(resource)
      .then((response: Response): Promise<any> => response.json())
      .then((json: LineStatus[]) => setData(json))
      .then(() => setLoading(false));
  }, []);

  return (
    <Card title="Status linee MM">
      <ul>
        {data.map(
          (e: LineStatus, i: number): JSX.Element =>
            loading ? (
              <li key={i} className="my-2 animate-pulse">
                <div className={loadingClass()}></div>
              </li>
            ) : (
              <li key={i}>
                <div className={lineClass(e.line)}>{e.line}</div> {e.text} |{" "}
                {e.status}{" "}
              </li>
            )
        )}
      </ul>
    </Card>
  );
};

export default Status;
