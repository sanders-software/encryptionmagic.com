import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import { useRef, useEffect } from "react";
import PasswordToggleInput from './PasswordToggleInput';

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

function TextEncryption({password, changePassword, showPassword, setShowPassword}) {

    const [results, setResults] = React.useState('');
    const [textAreaVal, setTextAreaVal] = React.useState('');
    const bottomRef = useRef(null);
    const textAreaRef = useRef(null);

    useEffect(() => {
        if (results)
        {
            bottomRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [results, password, textAreaVal]);

    return (<div>
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
                Paste your text to encrypt/decrypt below:
            </Col>        
        </Row>
        <Row>
            <Col>
                <textarea 
                    onChange={(e)=>{
                        setTextAreaVal(e.target.value);
                    }} value={textAreaVal} 
                    className={"textArea boxsizingBorder"}
                    title={'text-area-payload'}
                    id={'text-area-payload'}
                    name={'text-area-payload'}
                ></textarea>
            </Col>
        </Row>
        <Row>
            <Col>
                <div style={{ marginBottom : "4px"}}>
                    <button className="btn btn-success" onClick={async () => {
                            try
                            {
                                const encrypted = await window.encrypt(textAreaVal, password);
                                setResults(encrypted);    
                            }
                            catch(error)
                            {
                                setResults(error);
                            }
                        }} disabled={!(password && password.length >= 6 && textAreaVal)}>Encrypt</button>&nbsp;
                        <button className="btn btn-danger" onClick={async () => {
                            try
                            {
                                const decrypted = await window.decrypt(textAreaVal, password)
                                setResults(decrypted);
                            }
                            catch(error)
                            {
                                setResults(error);
                            }
                        }} disabled={!(password && password.length >= 6 && textAreaVal)}>Decrypt</button>
                </div>

            </Col>
        </Row>
        <Row>
            <Col>
                <div className={"text-area-wrapper"}>
                    <textarea 
                        ref={textAreaRef} 
                        cols={50} 
                        value={results} 
                        readOnly 
                        className={"textArea boxsizingBorder"} 
                        disabled={!results}
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
                        disabled={!results}
                        title={'copy-results-button'}
                    >
                        <span className={"fas fa-copy"}></span></button>
                </div>
            </Col>
        </Row>
        <div ref={bottomRef} />
    </div>)
}

export default TextEncryption;