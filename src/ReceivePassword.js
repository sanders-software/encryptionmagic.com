import { Row, Col, Button } from 'react-bootstrap';
import { useState, useRef } from "react";
import PasswordToggleInput from './PasswordToggleInput';

const ReceivePassword = ({ password, setPassword, showPassword, setShowPassword, isBase64Password, setIsBase64Password }) => {

  const [keyPair, setKeyPair] = useState(null);
  const [encryptedPayload, setEncryptedPayload] = useState('');
  const [error, setError] = useState('');
  const textAreaRef = useRef(null);
  const payloadRef = useRef(null);

  return (
    <Col>
      <Row>
        <Col>
          <h1>Receive a Password</h1>
          <p>To receive a password, you first need to generate a public RSA key.</p>
          <p>Once you have the public key, you can share it with your sender.</p>
          <p>Start here:</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={async () => {
            const keyPair = await window.generateRSAKeyPair();
            setKeyPair(keyPair);
          }}>Generate Public Key</Button>
        </Col>
      </Row>
      <Row>
          <Col>&nbsp;</Col>
      </Row>
      {keyPair && (
        <>
          <Row>
            <Col>
              <h5>Generated Public Key:</h5>
              <div className={"text-area-wrapper"}>
                <textarea
                  ref={textAreaRef}
                  cols={40}
                  value={keyPair ? keyPair.publicKey : ''} 
                  readOnly 
                  className={`form-control textArea boxsizingBorder`} 
                  disabled
                  title={'text-area-result'}
                  id={'text-area-result'}
                  name={'text-area-result'}
                ></textarea>
                <button
                    className={"copy-button"}
                    onClick={async () => {

                        const textArea = textAreaRef.current;
                        await navigator.clipboard.writeText(textArea.value);

                    }}
                    disabled={!keyPair || !keyPair.publicKey}
                    title={'copy-results-button'}
                >
                    <span className={"fas fa-copy"}></span>
                </button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row>
            <Col>
              <h5>Sender's Encrypted Payload:</h5>
              <div className="text-area-wrapper">
                <textarea
                  ref={payloadRef}
                  cols={40}
                  value={encryptedPayload}
                  onChange={(e) => setEncryptedPayload(e.target.value)}
                  className="form-control textArea boxsizingBorder"
                  title="encrypted-payload-input"
                  id="encrypted-payload-input"
                  name="encrypted-payload-input"
                ></textarea>
                <button
                  className="copy-button"
                  onClick={async () => {
                    const text = await navigator.clipboard.readText();
                    setEncryptedPayload(text);
                  }}
                  title="paste-encrypted-payload"
                >
                  <span className="fas fa-paste"></span>
                </button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={async () => {
                  try {
                    if (!keyPair.privateKey || !encryptedPayload) {
                      throw new Error("Private key and encrypted payload are required.");
                    }
                    const decrypted = await window.decryptPayload(keyPair.privateKey, encryptedPayload);
                    setPassword(decrypted);
                    setError('');
                  } catch (err) {
                    setError(err.message || "Decryption failed.");
                    setPassword('');
                  }
                }}
                disabled={!keyPair || !keyPair.privateKey || !encryptedPayload}
              >
                Decrypt Password
              </Button>
              {error && <span style={{ color: "red", marginLeft: "10px" }}>{error}</span>}
            </Col>
          </Row>
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row>
            <Col>
              <h5>Received Password:</h5>
              <Row>
                <Col className="col-6">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="UseBase64"
                    id="UseBase64"
                    checked={isBase64Password}
                    onChange={() => setIsBase64Password(!isBase64Password)}
                    style={{ borderColor: "purple" }}
                  />
                  &nbsp;
                  <label
                    className="form-check-label"
                    htmlFor="UseBase64"
                    onClick={() => setIsBase64Password(!isBase64Password)}
                  >
                    Base64 password (most secure)
                  </label>
                </Col>
              </Row>
              <PasswordToggleInput
                ptPasswordValue={password}
                ptChangePassword={setPassword}
                ptClass="passwordTextBox"
                ptStyle={null}
                ptShowPassword={showPassword}
                ptSetShowPassword={setShowPassword}
              />
            </Col>
          </Row>
        </>
      )}
    </Col>
  );
}

export default ReceivePassword;