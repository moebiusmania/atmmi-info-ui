import { ComponentChildren } from "preact";

type Props = {
  title: string;
  children: ComponentChildren;
};

const Card = (props: Props): JSX.Element => {
  const title: string = props.title || "Title";

  return (
    <div className="card bordered bg-white shadow-md">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {props.children}
      </div>
    </div>
  );
};

export default Card;
