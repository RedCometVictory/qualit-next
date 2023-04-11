import PaperUI from "../UI/PaperUI";

const Description = ({description}) => {
  return (<>
    <PaperUI
      className="detail__description paper"
    >
      {description}
    </PaperUI>
  </>)
};
export default Description;