import React from "react";
import { Row, Col } from 'react-bootstrap';

const Contact = () => {
    return (<Col className={"col-8 mainContent"}>
    <Row>
      <Col className={"col-12"} style={{ textAlign: "center"}}><h1>Contact</h1></Col>
    </Row>
    <Row>
      <Col>&nbsp;</Col>
    </Row>
    <Row>
      <Col>
        <p>Please email us at <a href="mailto:encryptionmagic.com@gmail.com">encryptionmagic.com@gmail.com</a>.</p>
      </Col>
    </Row>
  </Col>)
}

export default Contact;
