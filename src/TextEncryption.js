import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import { useState, useRef, useEffect } from "react";
import PasswordToggleInput from './PasswordToggleInput';

function TextEncryption({password, changePassword, showPassword, setShowPassword, isBase64Password, setIsBase64Password}) {

    const [textAreaVal, setTextAreaVal] = useState('');
    const [textAreaResult, setTextAreaResult] = useState('');
    const [theError, setTheError] = useState('');

    const [isHiddenValue, setIsHiddenValue] = useState(true);
    const [isHiddenResult, setIsHiddenResult] = useState(true);

    const bottomRef = useRef(null);
    const textAreaRef = useRef(null);

    useEffect(() => {
        if (textAreaResult)
        {
            bottomRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [textAreaResult, password, textAreaVal]);

    return (<>
        <Row>
            <Col className={"col-6"}>
                Password:
            </Col>
            <Col className={"col-6"}>
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="UseBase64"
                    id="UseBase64"
                    checked={isBase64Password}
                    onChange={e => setIsBase64Password(!isBase64Password)}
                    style={{ borderColor: "purple" }}
                    title=""
                />&nbsp;
                <label 
                    className="form-check-label" 
                    htmlFor="textOption"
                    onClick={() => setIsBase64Password(!isBase64Password)}
                >base64 password (most secure)</label>
            </Col>
        </Row>
        <Row>
            <Col className={"col-12"}>
                <PasswordToggleInput 
                    ptPasswordValue={password} 
                    ptChangePassword={(newPassword) => changePassword(newPassword)}
                    ptClass={"passwordTextBox"} 
                    ptStyle={null}
                    ptShowPassword={showPassword}
                    ptSetShowPassword={setShowPassword}
                ></PasswordToggleInput>
            </Col>
        </Row>
        <Row>
            <Col className={"col-12"} style={{ 'marginTop': '4px'}}>
                <Button 
                    onClick={() => {
                        changePassword(isBase64Password ? window.getRandomBase64Password() : window.generateRandomPassword(32));
                    }}
                    title={'auto-generate-password'}
                >Auto-generate password</Button>
            </Col>
        </Row>
        {
            password && password.length < 32 && (<Row>
                <Col>
                    <p>For best results use a 32 digit passphrase.  {32 - password.length} digit(s) left!</p>
                </Col>
            </Row>)
        }
        <Row>
            <Col>&nbsp;</Col>
        </Row>
        <Row>
            <Col style={{ marginLeft: "7px" }}>
                Paste your text to be encrypted/decrypted below.&nbsp;&nbsp;
                <label>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="hideContentCheckbox"
                        onChange={(e) => {
                            setIsHiddenValue(e.target.checked);
                        }}
                        checked={isHiddenValue}
                    /> Hide content to encrypt / decrypt
                </label>
            </Col>        
        </Row>
        <Row>
            <Col>
                <textarea
                    onChange={(e) => setTextAreaVal(e.target.value)}
                    value={textAreaVal}
                    className={`form-control textArea boxsizingBorder ${isHiddenValue ? 'hidden-textarea' : ''}`}
                    title="text-area-payload"
                    id="text-area-payload"
                    name="text-area-payload"
                ></textarea>
            </Col>
        </Row>
        <Row>
            <Col>
                <div style={{ marginBottom : "4px", marginTop: "4px" }}>
                    <button className="btn btn-success" onClick={async () => {
                            try
                            {
                                const encrypted = await window.encrypt(textAreaVal, password);
                                setTextAreaResult(encrypted);
                                setTheError('');  
                            }
                            catch(error)
                            {
                                const errMsg = error && error.message ? error.message : error.toString();
                                if (errMsg.indexOf('HMAC') >= 0) {
                                    setTheError(errMsg);
                                }
                                setTextAreaResult('');
                            }
                        }} disabled={!(password && password.length >= 6 && textAreaVal)}
                    >Encrypt</button>&nbsp;
                    <button className="btn btn-danger" onClick={async () => {
                        try
                        {
                            const decrypted = await window.decrypt(textAreaVal, password)
                            setTextAreaResult(decrypted);
                            setTheError('');
                        }
                        catch(error)
                        {
                            const errMsg = error && error.message ? error.message : error.toString();
                            if (errMsg.indexOf('HMAC') >= 0) {
                                setTheError(errMsg);
                            }
                            setTextAreaResult('');
                        }
                    }} disabled={!(password && password.length >= 6 && textAreaVal)}
                    >Decrypt</button>&nbsp;&nbsp;
                    <label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="hideResultsCheckbox"
                            onChange={(e) => {
                                setIsHiddenResult(e.target.checked);
                            }}
                            checked={isHiddenResult}
                        /> Hide encrypted / decryptrd result
                    </label>
                    {theError && theError.length && (<span style={{ color: "red" }}>&nbsp;&nbsp;{theError}</span>)}
                </div>

            </Col>
        </Row>
        <Row>
            <Col>
                <div className={"text-area-wrapper"}>
                    <textarea 
                        ref={textAreaRef} 
                        cols={50} 
                        value={textAreaResult} 
                        readOnly 
                        className={`form-control textArea boxsizingBorder ${isHiddenResult ? 'hidden-textarea' : ''}`} 
                        disabled={!textAreaResult}
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
                        disabled={!textAreaResult}
                        title={'copy-results-button'}
                    >
                        <span className={"fas fa-copy"}></span>
                    </button>
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <br />
            </Col>
        </Row>
        <Row>
            <Col>
                <p style={{ textAlign: "justify" }}><b>Instructions:</b> First, enter a password.  If you are encrypting text paste it into the top text area, then click Encrypt.  Your encrypted text will be copyable in the lower text area.  All fields are 'hidden' by default.  Save your encrypted text, and write down your password, for decryption later.</p>
                <p style={{ textAlign: "justify" }}>Paste your encrypted text in the top text area.  Click decrypt and you will get your original text copyable in the lower text area.</p>
            </Col>
        </Row>
        <div ref={bottomRef} />
    </>)
}

export default TextEncryption;