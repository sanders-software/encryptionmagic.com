import React, { } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import PasswordToggleInput from './PasswordToggleInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function BinaryEncryption({password, changePassword, showPassword, setShowPassword, isBase64Password, setIsBase64Password}) {

    const changeHandler = (event) => {
        
        if (!password || !password.length || password.length < 6)
            return;

        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = async (event2) => {
            const byteArray = new Uint8Array(event2.target.result);

            if (!file.name) return;

            let result = null;
            let newFileName = '';
            if (file.name.endsWith('.enm'))
            {
                result = await window.decryptBytes(byteArray, password);
                newFileName = file.name.replace('.enm','');
            }
            else
            {
                result = await window.encryptBytes(byteArray, password);
                newFileName = file.name + '.enm';    
            }

            var blob = new Blob([result], { type: 'application/octet-stream' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", newFileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                event.target.value = ""
            }

        };
    
        reader.readAsArrayBuffer(file);
    };

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
            <Col className={"col-12"}>
            <Button 
                    onClick={() => {
                        changePassword(isBase64Password ? window.getRandomBase64Password : window.generateRandomPassword(32));
                    }}
                    title={'auto-generate-password'}
                >Auto-generate password</Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form noValidate>
                    <Row className={"appliance-table-row"}>
                        <Col className="col-4">    
                            <Form.Label style={{ marginTop: '10px', marginLeft: '7px' }}>Encrypt/Decrypt a file:</Form.Label>
                        </Col>
                        <Col className="col-1">
                            <div className="tooltip-container">
                                <span className="tooltip-text">Fill in your password first, then choose your file.</span>
                                <FontAwesomeIcon icon={faCircleInfo} />
                            </div>
                        </Col>
                        <Col className="col-7">
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
        <Row>
            <Col>
                <p>Instructions: First enter a password, Choose your file.  Your unencrypted file will be encrypted to a .enm type.  If your file is .enm (and encrypted by us) you will get your original file back.</p>
                <p style={{ textAlign: "justify" }}>Encrypt any file type. txt, zip, pdf, exe, tor, png, gif, jpg etc.  Get an encrypted .enm file from your browser.</p>
                <p><b>Encryption and decryption are done within your browser's javascript code and is 100% off-line.</b></p>
            </Col>
        </Row>
    </>
    )
}

export default BinaryEncryption;