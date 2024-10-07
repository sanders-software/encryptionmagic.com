import React, { } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import PasswordToggleInput from './PasswordToggleInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function generateRandomPasswordWithCrypto(length) {
    const characters = '!@#$%^&*()-+<>/?;:"{[]}\\|`~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomCharacters = [];
  
    while (randomCharacters.length < length) {
      const byte = crypto.getRandomValues(new Uint8Array(1))[0];
      const character = characters[byte % characters.length];
      randomCharacters.push(character);
    }
  
    return randomCharacters.join('');
}


function BinaryEncryption({password, changePassword, showPassword, setShowPassword}) {

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
    <div>
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
                        changePassword(generateRandomPasswordWithCrypto(32));
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
                            <Form.Label style={{ marginTop: '10px', marginLeft: '7px' }}>Encrypt a file:</Form.Label>
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
                <p style={{ textAlign: "justify" }}>Instructions: encrypt any file type. .txt, zip, pdf, exe, tor, png, gif, .jpg etc.</p>
                <p>First enter a password, 'Upload' your file and you will get a downloaded, encrypted, .enm (Encryption Magic) file. 'Upload' a .enm file and get your file back.</p>
                <p><b>All encryption is done within your browser</b> and off-line.</p>
            </Col>
        </Row>
    </div>
    )
}

export default BinaryEncryption;