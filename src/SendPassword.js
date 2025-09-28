import { Row, Col, Button } from 'react-bootstrap';
import { useState, useRef } from "react";
import PasswordToggleInput from './PasswordToggleInput';

const SendPassword = ({ password, setPassword, showPassword, setShowPassword, isBase64Password, setIsBase64Password }) => {
  const [publicKeyString, setPublicKeyString] = useState('');
  const [encryptedPayload, setEncryptedPayload] = useState('');
  const [error, setError] = useState('');

  const publicKeyRef = useRef(null);
  const outputRef = useRef(null);

  return (
    <Col>
      <Row>
        <Col>
          <h1>Send a Password</h1>
          <p>To send a password securely, paste the receiver's public key below.</p>
          <p>Enter or generate a password, then click Encrypt to generate the encrypted payload.</p>
          <p>Share the encrypted payload with the receiver.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>Receiver's Public Key:</h5>
          <div className="text-area-wrapper">
            <textarea
              ref={publicKeyRef}
              cols={35}
              value={publicKeyString}
              onChange={(e) => setPublicKeyString(e.target.value)}
              className="form-control textArea boxsizingBorder"
              title="public-key-input"
              id="public-key-input"
              name="public-key-input"
            ></textarea>
            <button
              className="copy-button"
              onClick={async () => {
                const text = await navigator.clipboard.readText();
                setPublicKeyString(text);
              }}
              title="paste-public-key"
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
          <h5>Password to Send:</h5>
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
          <Row>
            <Col className="col-12">
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
          <Row>
            <Col className="col-12" style={{ marginTop: '4px' }}>
              <Button
                onClick={() => {
                  setPassword(isBase64Password ? window.getRandomBase64Password() : window.generateRandomPassword(32));
                }}
                title="auto-generate-password"
              >
                Auto-generate password
              </Button>
            </Col>
          </Row>
          {password && password.length < 32 && (
            <Row>
              <Col>
                <p>For best results use a 32 digit passphrase. {32 - password.length} digit(s) left!</p>
              </Col>
            </Row>
          )}
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
                if (!publicKeyString || !password) {
                  throw new Error("Public key and password are required.");
                }
                const payload = await window.encryptPayload(publicKeyString, password);
                setEncryptedPayload(payload);
                setError('');
              } catch (err) {
                setError(err.message || "Encryption failed.");
                setEncryptedPayload('');
              }
            }}
            disabled={!publicKeyString || !password || password.length < 6}
          >
            Encrypt Password
          </Button>
          {error && <span style={{ color: "red", marginLeft: "10px" }}>{error}</span>}
        </Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col>
          <h5>Encrypted Payload:</h5>
          <div className="text-area-wrapper">
            <textarea
              ref={outputRef}
              cols={35}
              value={encryptedPayload}
              readOnly
              className="form-control textArea boxsizingBorder"
              disabled={true}
              title="encrypted-payload"
              id="encrypted-payload"
              name="encrypted-payload"
            ></textarea>
            <button
              className="copy-button"
              onClick={async () => {
                const textArea = outputRef.current;
                await navigator.clipboard.writeText(textArea.value);
              }}
              disabled={!encryptedPayload}
              title="copy-encrypted-payload"
            >
              <span className="fas fa-copy"></span>
            </button>
          </div>
        </Col>
      </Row>
    </Col>
  );
}

export default SendPassword;