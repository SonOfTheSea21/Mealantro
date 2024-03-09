import React from "react";
import "./SecondCard.css"

export default function SecondCard(props) {
  return (
    <div className="cardd">
      <figure className="snip0056">
        <figcaption>
          <h2>{props.name}  <i style={{ fontWeight: 'lighter', fontSize: 'smaller', fontStyle: 'italic' }}>{props.origin}</i></h2>
          <p>{props.description}</p>
          <div className="icons">
            <a href="#"><i className="ion-ios-home"></i></a>
            <a href="#"><i className="ion-ios-email"></i></a>
            <a href="#"><i className="ion-ios-telephone"></i></a>
          </div>
        </figcaption>
        <img src="/images/table-arrangement.png" alt="sample8" />
        <div className="position">{props.spice != null? "SPICE LEVEL: " + props.spice : ''}</div>
      </figure>
    </div>
  )
}
