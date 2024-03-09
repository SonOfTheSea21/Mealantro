import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function ICardItem(props) {

  const [imgSrc, setImgSrc] = useState(`http://localhost:5000/recipes/image/${props.rid}`);


  const handleError = () => {

    setImgSrc('/images/asd.png'); // Set to your fallback image path
  };

  return (
    <>
      <li className='cards__item'>
        <Link className='cards__item__link' to={props.path} state={{  
                  rid: props.rid,
                }}>
        <figure className='cards__item__pic-wrap' data-percent={props.percent} data-category={props.label} data-halalharam={props.halalharam} style={{ '--Rcolor': props.halalharam === "haram" ? "red" : "green" }}>
        <div className="cards__item__percent-badge">{props.percent}%</div>
            <img
              className='cards__item__img'
              alt='Recipe Image'
              src={imgSrc}
              onError={handleError}
            />
          </figure>
          <div className='cards__item__info'>
            <h5 className='cards__item__text'>{props.text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}

export default ICardItem;