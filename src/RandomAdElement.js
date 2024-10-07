import React from 'react';
import Button from "react-bootstrap/Button";

const getRandomUint32 = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0];
};

const ads = [
  // <Button className={"adClass"} onClick={() => {window.open(process.env.PUBLIC_URL + '#adclick', '_blank')}} style={{ backgroundColor: "purple" }} title={"Advertise!"}>Advertise Here!</Button>,
  // <Button className={"adClass"} onClick={() => {window.open(process.env.PUBLIC_URL + '#adclick', '_blank')}} style={{ backgroundColor: "purple" }} title={"Advertise!"}>Use Your Own Ad!</Button>,
  // <Button className={"adClass"} onClick={() => {window.open(process.env.PUBLIC_URL + '#adclick', '_blank')}} style={{ backgroundColor: "purple" }} title={"Advertise!"}>Sponsors Coming Soon!</Button>,
  // <a href={process.env.PUBLIC_URL + "#adclick"} target={"_blank"} title={"Advertise!"} rel={"noreferrer"}>
  //   <img className={"adClass"} src={process.env.PUBLIC_URL + '/img/your-ad-here.jpg'} alt={''} />
  // </a>,
  // <a href={process.env.PUBLIC_URL + "#adclick"} target={"_blank"} title={"Advertise!"} rel={"noreferrer"}>
  //   <img className={"adClass"} src={process.env.PUBLIC_URL + '/img/your-ad-here-2.gif'} alt={''} />
  // </a>,
  // <a href={process.env.PUBLIC_URL + "#adclick"} target={"_blank"} title={"Advertise!"} rel={"noreferrer"}>
  //   <img className={"adClass"} src={process.env.PUBLIC_URL + '/img/your-ad-here-big.png'} alt={''} />
  // </a>,
  // <a href={process.env.PUBLIC_URL + "#adclick"} target={"_blank"} title={"Advertise!"} rel={"noreferrer"}>
  //   <img className={"adClass"} src={process.env.PUBLIC_URL + '/img/Another-your-ad-here.jpg'} alt={''} />
  // </a>
  <></>
];

const RandomAdElement = ({index}) => {

  const randomIndexPosition = (index ? index : getRandomUint32()) % ads.length;
  const randomAd = ads[randomIndexPosition];
  
  return randomAd;
};

export default RandomAdElement;
