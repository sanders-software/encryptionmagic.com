import React, { useState, useRef } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap';
import PasswordToggleInput from './PasswordToggleInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function generateRandomPassword(length) {
    const characters = '!@#$%^&*()-+<>/?;:"{[]}\\|`~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomCharacters = [];
  
    while (randomCharacters.length < length) {
      const byte = crypto.getRandomValues(new Uint8Array(1))[0];
      const character = characters[byte % characters.length];
      randomCharacters.push(character);
    }
  
    return randomCharacters.join('');
}

function FileToTextEncryption({password, changePassword, showPassword, setShowPassword, isBase64Password, setIsBase64Password})
{
    const changeHandler = (event) => {
        
        if (!password || !password.length || password.length < 6)
            return;

        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = async (event2) => {
            const byteArray = new Uint8Array(event2.target.result);

            if (!file.name) return;
            if (!byteArray.length) return;

            let result = await window.encryptBytesToText(file.name, byteArray, password);

            if (txtFileDownload)
            {
                var blob = new Blob([result], { type: 'application/octet-stream' });
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", (file.name + '.txt'));
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
    
                    event.target.value = ""
                }
            }
            else
            {
                setTextAreaResult(result);

                bottomRef.current.scrollIntoView({behavior: 'smooth'});
            }
        };
    
        reader.readAsArrayBuffer(file);
    };

    const [txtFileDownload, setTxtFileDownload] = useState(true);

    const [textAreaResult, setTextAreaResult] = useState('');

    const textAreaRef = useRef(null);

    const bottomRef = useRef(null);

    return (
        <>
            <Row>
                <div className={"col-6"}>
                    Password:
                </div>
                <div className={"col-6"}>
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
                </div>
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
                <Col className={"col-6"}>
                    <Button 
                        onClick={() => {
                            changePassword(isBase64Password ? window.getRandomBase64Password() : generateRandomPassword(32));
                        }}
                        title={'auto-generate-password'}
                    >Auto-generate password</Button>
                </Col>
                <Col className={"col-6"}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="outputOptions"
                        id="optionTextFile"
                        checked={txtFileDownload}
                        onChange={() => setTxtFileDownload(true)}
                        style={{ borderColor: "purple" }}
                    />&nbsp;
                    <label 
                        className="form-check-label" 
                        htmlFor="optionTextFile"
                        onClick={() => setTxtFileDownload(true)}
                    >
                        Encrypted .txt file (phones)
                    </label>&nbsp;&nbsp;
                    <input
                        className="form-check-input"
                        type="radio"
                        name="outputOptions"
                        id="optionTextArea"
                        checked={!txtFileDownload}
                        onChange={() => setTxtFileDownload(false)}
                        style={{ borderColor: "purple" }}
                    />&nbsp;
                    <label 
                        className="form-check-label" 
                        htmlFor="optionTextArea"
                        onClick={() => setTxtFileDownload(false)}
                    >
                        Encrypted Text
                    </label>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form noValidate>
                        <Row className={"appliance-table-row"}>
                            <Col className="col-2">    
                                <Form.Label style={{ marginTop: '10px', marginLeft: '7px' }}>Encrypt a file:</Form.Label>
                            </Col>
                            <Col className="col-1">
                                <div className="tooltip-container">
                                    <span className="tooltip-text">Fill in your password first, then choose your file.</span>
                                    <FontAwesomeIcon icon={faCircleInfo} />
                                </div>
                            </Col>
                            <Col className="col-9">
                                {
                                    (password && password.length && password.length >= 6) && 
                                        <Form.Control 
                                            style={{ marginTop: '5px' }} 
                                            required 
                                            name="fileToEncrypt" 
                                            type="file" 
                                            onChange={changeHandler} 
                                            disabled={!password || !password.length || password.length < 6}
                                        />
                                }
    
                            </Col>
                        </Row>
                    </Form>
    
                </Col>
            </Row>
            <Row>
                <Col>
                    <br />
                </Col>
            </Row>
            {!txtFileDownload &&
            (<Row>
                <Col>
                    <div className={"text-area-wrapper"}>
                        <textarea 
                            ref={textAreaRef} 
                            cols={50} 
                            value={textAreaResult} 
                            readOnly 
                            className={`form-control textArea boxsizingBorder`} 
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
            </Row>)}
            <Row>
                <Col>
                    <br />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p style={{ textAlign: "justify" }}><b>Instructions</b>: First, enter a password. Choose your file.  You will get your file's serialized encrypted text above.  Encrypt any file type. .txt, zip, pdf, exe, tor, png, gif, .jpg etc.  Use the "Text Decryption to File" option to decrypt your text back to a file.</p>
                    <p style={{ textAlign: "justify" }}>Larger files might will take longer...  Your browser is hard at work, so please be patient and click "Wait".</p>
                    <p style={{ textAlign: "justify" }}>For mobile phones, select the .txt file option.  Send the file in a text message or email.</p>
                    <p style={{ textAlign: "justify" }}>Your data never leaves your browser, you could initially load 'the website' then work with it as an 'off-line' tool.  Feel free test it's 100% 'off-line' functionality.</p>
                </Col>
            </Row>
            <div ref={bottomRef} />
        </>
        )
}

export default FileToTextEncryption;