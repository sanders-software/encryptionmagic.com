import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalMain = ({show, setShow, setCookie}) => {

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} centered={true} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>I Agree to the terms of "the website".</Modal.Title>
        </Modal.Header>
        <Modal.Body>This site uses cookies.  By using this site you agree to and consent to the use of analytics cookies and agree to the website's "Terms of Service".</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => { setShow(false); setCookie(); }}>
            I Agree
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalMain;
