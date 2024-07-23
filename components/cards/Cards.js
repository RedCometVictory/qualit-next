import CardItem from './Card';

const Cards = ({ showCardDetail, setModalOpen, cards }) => {
  return (<>
    {cards?.map((card, index) => (
      <CardItem
        key={index}
        variant=''
        raised='true'
        card={card}
        cardIndex={index}
        showCardDetail={showCardDetail}
        setModalOpen={setModalOpen}
      >
      </CardItem>
    ))}
  </>)
};
export default Cards;