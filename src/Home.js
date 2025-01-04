import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import TextEncryption from './TextEncryption';
import BinaryEncryption from './BinaryEncryption';
import TextDecryptionToFile from './TextDecryptionToFile';
import FileToTextEncryption from './FileToTextEncryption';



const Home = ({encryptionType, setEncryptionType, password, setPassword, showPassword, setShowPassword, isBase64Password, setIsBase64Password}) => {
    return (<Col className={"col-8 mainContent"}>
    <Row>
      <Col className={"col-12"} style={{ textAlign: "center"}}><h1>Welcome to Encryption Magic!</h1></Col>
    </Row>
    <Row>
      {
        (encryptionType === 'File2File' || encryptionType === 'File2Text') && (<Col className={"col-12"} style={{ textAlign: "center" }}>
        <img src={process.env.PUBLIC_URL + '/img/logoFile.png'} style={{ "width": "100px" }} alt={''}></img>
        <div className="tooltip-container">
          <span className="tooltip-text">Add a password, then choose your file.</span>
          <FontAwesomeIcon icon={faCircleInfo} />
        </div>
        <h6>File Encryption</h6>
      </Col>)
      }
      {
        (encryptionType === 'Text2Text') && (<Col className={"col-12"} style={{ textAlign: "center" }}>
        <img src={process.env.PUBLIC_URL + '/img/logoText.png'} style={{ "width": "100px" }} alt={''}></img>
        <div className="tooltip-container">
          <span className="tooltip-text">Fill in the password, then paste your text to encrypt.</span>
          <FontAwesomeIcon icon={faCircleInfo} />
        </div>
        <h6>Text {encryptionType === 'Text2Text' ? 'Encryption' : 'Decryption'}</h6>
      </Col>)
      }
      {
        (encryptionType === 'Text2File') && (<Col className={"col-12"} style={{ textAlign: "center" }}>
        <img src={process.env.PUBLIC_URL + '/img/logoText.png'} style={{ "width": "100px" }} alt={''}></img>
        <div className="tooltip-container">
          <span className="tooltip-text">Fill in the password, then paste your file's encrypted text.</span>
          <FontAwesomeIcon icon={faCircleInfo} />
        </div>
        <h6>Text {encryptionType === 'Text2Text' ? 'Encryption' : 'Decryption'}</h6>
      </Col>)
      }
    </Row>
    <Row>
      <Col>
        <div className="passwordTextBox" style={{ "paddingLeft": "7px" }}>
          Encryption Type:
          <div className="row" style={{ "marginLeft": "0px" }}>
            <span className="form-check col-6">
              <input
                className="form-check-input"
                type="radio"
                name="options"
                id="File2Text"
                checked={encryptionType === 'File2Text'}
                onChange={() => setEncryptionType('File2Text')}
                style={{ borderColor: "purple" }}
              />
              <label 
                className="form-check-label" 
                htmlFor="textOption"
                onClick={() => setEncryptionType('File2Text')}
              >
                File to Encrypted Text
              </label>
            </span>
            <span className="form-check col-6">
              <input
                className="form-check-input"
                type="radio"
                name="options"
                id="Text2Text"
                checked={encryptionType === 'Text2Text'}
                onChange={() => setEncryptionType('Text2Text')}
                style={{ borderColor: "purple" }}
              />
              <label 
                className="form-check-label" 
                htmlFor="textOption"
                onClick={() => setEncryptionType('Text2Text')}
              >
                Text to Text (Encryption/Decryption)
              </label>
            </span>
          </div>

          <div className="row" style={{ "marginLeft": "0px" }}>
            <span className="form-check col-6">
              <input
                className="form-check-input"
                type="radio"
                name="options"
                id="Text2File"
                checked={encryptionType === 'Text2File'}
                onChange={() => setEncryptionType('Text2File')}
                style={{ borderColor: "purple" }}
              />
              <label 
                className="form-check-label" 
                htmlFor="binaryOption"
                onClick={() => setEncryptionType('Text2File')}
              >
                Text Decryption to File 
              </label>
            </span>
            <span className="form-check col-6">
              <input
                className="form-check-input"
                type="radio"
                name="options"
                id="File2File"
                checked={encryptionType === 'File2File'}
                onChange={() => setEncryptionType('File2File')}
                style={{ borderColor: "purple" }}
              />
              <label 
                className="form-check-label" 
                htmlFor="binaryOption"
                onClick={() => setEncryptionType('File2File')}
              >
                File to File (Encryption/Decryption)
              </label>
            </span>
          </div>
        </div>  
      </Col>
    </Row>
    <Row>
      <Col>
        <Row>
          <Col>
          {encryptionType === 'File2Text' &&
            <FileToTextEncryption
              password={password}
              changePassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isBase64Password={isBase64Password}
              setIsBase64Password={setIsBase64Password}
            ></FileToTextEncryption>
          }
          
          {encryptionType === 'Text2File' &&
            <TextDecryptionToFile
              password={password} 
              changePassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isBase64Password={isBase64Password}
              setIsBase64Password={setIsBase64Password}
            ></TextDecryptionToFile>
          }

          {encryptionType === 'File2File' && 
            <BinaryEncryption
              password={password}
              changePassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isBase64Password={isBase64Password}
              setIsBase64Password={setIsBase64Password}
            ></BinaryEncryption>}

          {encryptionType === 'Text2Text' && 
            <TextEncryption 
              password={password} 
              changePassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isBase64Password={isBase64Password}
              setIsBase64Password={setIsBase64Password}
            ></TextEncryption>}

          </Col>
        </Row>
      </Col>
    </Row>
  </Col>)
}

export default Home;
