import { Row, Col } from 'react-bootstrap';
import TextEncryption from './TextEncryption';
import BinaryEncryption from './BinaryEncryption';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const Home = ({useBinary, setUseBinary, password, setPassword, showPassword, setShowPassword}) => {
    return (<Col className={"col-8 mainContent"}>
    <Row>
      <Col className={"col-12"} style={{ textAlign: "center"}}><h1>Welcome to Encryption Magic!</h1></Col>
    </Row>
    <Row>
      {
        useBinary ? (<Col className={"col-12"} style={{ textAlign: "center" }}>
        <img src={process.env.PUBLIC_URL + '/img/logoFile.png'} style={{ "width": "100px" }} alt={''}></img>
        <div className="tooltip-container">
          <span className="tooltip-text">Fill in the password, then choose your file.</span>
          <FontAwesomeIcon icon={faCircleInfo} />
        </div>
        <h6>Free File Encryption</h6>
      </Col>) : (<Col className={"col-12"} style={{ textAlign: "center" }}>
        <img src={process.env.PUBLIC_URL + '/img/logoText.png'} style={{ "width": "100px" }} alt={''}></img>
        <div className="tooltip-container">
          <span className="tooltip-text">Encryption can now be done offline.</span>
          <FontAwesomeIcon icon={faCircleInfo} />
        </div>
        <h6>Free Text Encryption</h6>
      </Col>)
      }
    </Row>
    <Row>
      <Col>
        <div className="passwordTextBox" style={{ "paddingLeft": "7px" }}>
          Encryption Type:
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="options"
              id="textOption"
              checked={!useBinary}
              onChange={() => setUseBinary(false)}
              style={{ borderColor: "purple" }}
            />
            <label className="form-check-label" htmlFor="textOption">
              Text
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="options"
              id="binaryOption"
              checked={useBinary}
              onChange={() => setUseBinary(true)}
              style={{ borderColor: "purple" }}
            />
            <label className="form-check-label" htmlFor="binaryOption">
              Whole File
            </label>
          </div>
        </div>  
      </Col>
    </Row>
    <Row>
      <Col>
        <Row>
          <Col>{useBinary ? 
            <BinaryEncryption
              password={password}
              changePassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            ></BinaryEncryption> : 
            <TextEncryption 
              password={password} 
              changePassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            ></TextEncryption>}
          </Col>
        </Row>
      </Col>
    </Row>
  </Col>)
}

export default Home;
