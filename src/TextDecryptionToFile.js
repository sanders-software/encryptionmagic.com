import { Row, Col, Button, Form } from 'react-bootstrap';
import { useState } from "react";
import PasswordToggleInput from './PasswordToggleInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function TextDecryptionToFile({password, changePassword, showPassword, setShowPassword, isBase64Password, setIsBase64Password})
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
            if (!txtFileUpload) return;

            const decoder = new TextDecoder('utf-8'); 
            const textContent = decoder.decode(byteArray)
            let [unpaddedBytes, fileName] = await window.decryptTextToBytes(textContent, password);

            var blob = new Blob([unpaddedBytes], { type: 'application/octet-stream' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                event.target.value = ""
            }
        };
    
        reader.readAsArrayBuffer(file);
    };

    const [textAreaVal, setTextAreaVal] = useState('');
    const [txtFileUpload, setTxtFileUpload] = useState(true);

    return (<>
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
            <Col className={"col-12"} style={{ marginLeft: "7px" }}>
                Password:
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
            <Col className={"col-6"} style={{ 'marginTop': '4px'}}>
                <Button 
                    onClick={() => {
                        changePassword(isBase64Password ? window.getRandomBase64Password() : window.generateRandomPassword(32));
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
                        checked={txtFileUpload}
                        onChange={() => setTxtFileUpload(true)}
                        style={{ borderColor: "purple" }}
                    />&nbsp;
                    <label 
                        className="form-check-label" 
                        htmlFor="optionTextFile"
                        onClick={() => setTxtFileUpload(true)}
                    >
                        Decrypt .txt file (phones)
                    </label>&nbsp;&nbsp;
                    <input
                        className="form-check-input"
                        type="radio"
                        name="outputOptions"
                        id="optionTextArea"
                        checked={!txtFileUpload}
                        onChange={() => setTxtFileUpload(false)}
                        style={{ borderColor: "purple" }}
                    />&nbsp;
                    <label 
                        className="form-check-label" 
                        htmlFor="optionTextArea"
                        onClick={() => setTxtFileUpload(false)}
                    >
                        Decrypt Text
                    </label>
                </Col>
        </Row>
        {
            password && password.length < 32 && (<Row>
                <Col style={{ marginLeft: "7px" }}>
                    <p style={{ color: 'red'}}>For best results use a 32 digit passphrase.  {32 - password.length} digit(s) left!</p>
                </Col>
            </Row>)
        }

        {txtFileUpload && (
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
        )}

        {!txtFileUpload && (
            <>
                <Row>
                    <Col style={{ marginLeft: "7px", marginTop: "7px", marginBottom: "7px" }}>
                        Paste your encrypted text - then click "Decrypted to File" below.  
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <textarea
                            onChange={(e) => setTextAreaVal(e.target.value)}
                            value={textAreaVal}
                            className={`form-control textArea boxsizingBorder`}
                            title="text-area-payload"
                            id="text-area-payload"
                            name="text-area-payload"
                        ></textarea>            
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ marginBottom : "4px", marginTop: "4px" }}>

                            <button className="btn btn-danger" onClick={async () => {
                                try
                                {
                                    const decryptedBytesTuple = await window.decryptTextToBytes(textAreaVal, password);

                                    var blob = new Blob([decryptedBytesTuple[0]], { type: 'application/octet-stream' });
                                    var link = document.createElement("a");
                                    if (link.download !== undefined) {
                                        var url = URL.createObjectURL(blob);
                                        link.setAttribute("href", url);
                                        link.setAttribute("download", decryptedBytesTuple[1]);
                                        link.style.visibility = 'hidden';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }
                                }
                                catch(error)
                                {
                                    alert(error);
                                }
                            }} disabled={!(password && password.length >= 6 && textAreaVal)}>Decrypt to File</button>

                        </div>

                    </Col>
                </Row>
            </>
        )}

        <Row>
            <Col>
                <br />
            </Col>
        </Row>
        <Row>
            <Col>
                <p style={{ textAlign: "justify" }}><b>Instructions:</b>  This is the decryption part of the "File to Encrypted Text" option.  Your browser will deserialize and decrypt the text to a file.  It will likely be in the browser's downloads folder.</p>
            </Col>
        </Row>
    </>)
}

export default TextDecryptionToFile;