import { useState, useEffect } from 'react';

import Card from './Card';

type LineStatus = {
  line: string,
  text: string,
  status: string,
}

const Status = (): JSX.Element => {
  const [data, setData] = useState<LineStatus[]>([]);
  const resource: string = "https://atmmi-info-api.herokuapp.com/status";

  useEffect(() => {
    fetch(resource)
      .then((response: Response): Promise<any> => response.json())
      .then((json: LineStatus[]) => setData(json));
  }, []);

  return (
    <Card title="Status">
      <ul>
        {data.map((e: LineStatus, i: number): JSX.Element => 
          <li key={i}>{e.line} | {e.text} | {e.status} </li>)}
      </ul>
    </Card>
  )
};

export default Status;