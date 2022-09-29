import React from 'react';
import CardUI from '../UI/CardUI';

const Cards = ({ showCardDetail, cards, children, underline, ...restProps }) => {
  return (
    <>
      <CardUI
        // key={index}
        className="card"
        variant=''
        raised='true'
        // card={card}
        showCardDetail={showCardDetail}
        {...{...restProps, underline}}
      >
        {children}
      </CardUI>
      <CardUI
        // key={index}
        className="card"
        variant=''
        raised='true'
        // card={card}
        showCardDetail={showCardDetail}
        {...{...restProps, underline}}
      >
        {children}
      </CardUI>
      <CardUI
        // key={index}
        className="card"
        variant=''
        raised='true'
        // card={card}
        showCardDetail={showCardDetail}
        {...{...restProps, underline}}
      >
        {children}
      </CardUI>

      {/* {cards?.map((card, index) => (
        <CardUI
          key={index}
          className="card"
          variant=''
          raised='true'
          card={card}
          showCardDetail={showCardDetail}
        >
        </CardUI>
      ))} */}
    </>
  )
};
export default Cards;