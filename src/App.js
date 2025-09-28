import { useState, useEffect }  from 'react';
import { Row, Col } from 'react-bootstrap';
import RandomAdElement from './RandomAdElement';
import Terms from './Terms';
import Contact from './Contact';
import Home from './Home';
import ModalMain from './ModalMain';
import Blog from './Blog';
import ReceivePassword from './ReceivePassword';
import SendPassword from './SendPassword';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const getRandomUint32 = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0];
};

function App() {

  const [hash, setHash] = useState(window.location.hash.substring(1));
  const [encryptionType, setEncryptionType] = useState('Text2Text');
  const [page, setPage] = useState(hash ? hash : 'home');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isBase64Password, setIsBase64Password] = useState(true);
  const [showLeftSide, setShowLeftSide] = useState(window.innerWidth > 608);
  const [showRightSide, setShowRightSide] = useState(window.innerWidth >= 851);

  // look for a cookie to see if we have already accepted the terms of service
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith('cookieConsent='));

  const [show, setShow] = useState(cookieValue ? false : true);

  const [intArray, setIntArray] = useState([])

  useEffect(() => {
    setIntArray(intArray => {
      const newArray = [...intArray];
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].forEach(() => newArray.push(getRandomUint32()));
      return newArray;
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash.substring(1));

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Clean up listener when component unmounts
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  window.addEventListener('resize', function() {
    setShowLeftSide(window.innerWidth > 608);
    setShowRightSide(window.innerWidth >= 851);
  });

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <div style={{ marginTop: "10px" }}>
          <Row>
            {showLeftSide && (
            <Col className={!showRightSide ? "col-4" : "col-2"} style={{ textAlign: "center"}}>
              <Row>
                <Col>
                  <img src={process.env.PUBLIC_URL + '/img/logoAllSeeingEye.png'} style={{ "width": "100px" }} alt={''} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <a href={process.env.PUBLIC_URL + '#home'} onClick={() => { setPage('home'); }} style={{ color: 'purple'}} rel={"noreferrer"}>Home</a><br />
                  <a href={process.env.PUBLIC_URL + '#receivepw'} onClick={() => { setPage('receivepw'); }} style={{ color: 'purple'}} rel={"noreferrer"}>Receive a password</a><br />
                  <a href={process.env.PUBLIC_URL + '#sendpw'} onClick={() => { setPage('sendpw'); }} style={{ color: 'purple'}} rel={"noreferrer"}>Send a password</a><br />
                  <a href={process.env.PUBLIC_URL + '#terms'} onClick={() => { setPage('terms') }} style={{ color: 'purple'}} rel={"noreferrer"}>Terms of Service</a><br />
                  <a href={process.env.PUBLIC_URL + '#blog'} onClick={() => { setPage('blog') }} style={{ color: 'purple'}} rel={"noreferrer"}>Blog</a><br />
                  <a href={process.env.PUBLIC_URL + '#contact'} onClick={() => { setPage('contact') }} style={{ color: 'purple'}} rel={"noreferrer"}>Contact Us</a><br />
                  <a href={'https://sanders.software/pages/securedonation'} target={'_blank'} style={{ color: 'purple'}} rel={"noreferrer"}>Donate</a>
                </Col>
              </Row>
              {[0].map((value, _)=> (<div key={800 + value}>
              <Row>
                <Col>
                  &nbsp;
                </Col>
              </Row>
              <Row>
                <Col>
                  <RandomAdElement index={intArray[(800 + value) % intArray.length]}></RandomAdElement>
                </Col>
              </Row>
              </div>))}
            </Col>)}
            {
              page === 'terms' ? (<Terms />) :
              page === 'contact' ? (<Contact />) :
              page === 'blog' ? (<Blog />) :
              page === 'receivepw' ? (
                <ReceivePassword
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isBase64Password={isBase64Password}
                  setIsBase64Password={setIsBase64Password}
                />
              ) :
              page === 'sendpw' ? (
                <SendPassword
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isBase64Password={isBase64Password}
                  setIsBase64Password={setIsBase64Password}
                />
              ) : 
              (
                <Home
                  encryptionType={encryptionType}
                  setEncryptionType={setEncryptionType}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isBase64Password={isBase64Password}
                  setIsBase64Password={setIsBase64Password}
                />
              )
            }
            {showRightSide && (
              <Col className={"col-2"} style={{ textAlign: "center"}}>
                <Row>
                  <Col>
                    <img src={process.env.PUBLIC_URL + '/img/logoLockCauldron.gif'} style={{ "width": "100px" }} alt={''} />
                  </Col>
                </Row>
                {/* {
                  [0,1,2].map((value, _)=> (
                    <div key={900 + value}>
                      <Row>
                        <Col>
                          &nbsp;
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <RandomAdElement index={intArray[(900 + value) % intArray.length]}></RandomAdElement>
                        </Col>
                      </Row>
                      </div>))} */}
              </Col>
            )}
          </Row>
        </div>
        <ModalMain show={show} setShow={setShow} setCookie={() => {
          setShow(false);
          // Expire concent cookie forever into the future...
          document.cookie = "cookieConsent=true; max-age=6060243651000; path=/; SameSite=Lax; Secure; domain=" + window.location.hostname + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        }} />
      </main>
    </div>
  );
}

export default App;