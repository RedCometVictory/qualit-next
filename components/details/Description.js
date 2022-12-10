import { Card } from "@mui/material";

const Description = ({description}) => {
  return (<>
    <Card
      className="detail__description"
    >
      {description}
    </Card>
  </>)
};
export default Description;