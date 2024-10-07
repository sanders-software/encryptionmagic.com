import React from "react";
import { Row, Col } from 'react-bootstrap';

const Terms = () => {
    return (<Col className={"col-8 mainContent"}>
    <Row>
      <Col className={"col-12"} style={{ textAlign: "center"}}><h1 style={{ fontFamily: 'Times New Roman' }}>Terms of Service</h1></Col>
    </Row>
    <Row>
      <Col>&nbsp;</Col>
    </Row>
    <Row>
      <Col>
        <p style={{ textAlign: "justify" }}>This website offers a free, browser-based, open-source encryption service.  You agree not to use this service to encrypt/decrypt illegal material.  You agree to encrypt text and files of your own property.
        You agree not to encrypt/decrypt material: in violation the law, infringing copyright, infringing the rights of ethnic groups, or promoting racism, Nazism, or promoting hatred (racial, religious, political etc.), 
        incite to violations of law, terrorism, child pornography, or otherwise unsuitable illegal activities.</p>
        <p style={{ textAlign: "justify" }}>You are solely responsible for the content you choose to encrypt/decrypt on your own device.  <b>You are also responsible for saving your own passwords!</b> Upon loading the website, 
          you have the option to go offline and use the service confidentially, although this step is not mandatory. 
          This service will never record or transmit your encryption password or your data across the wire or anywhere.  While this service is provided “as is” without any warranty, our algorithm is <a style={{ fontFamily: 'Times New Roman' }} target="_blank" href="https://github.com/sanders-software/encryptionmagic.com.git">open source</a>, 
          and the correctness of the encryption can be verified using third-party software such as Ansible-Vault.</p>
        <p style={{ textAlign: "justify" }}>We do hope you find this website useful and intuitive.  We're very excited to share the power of 256-bit AES256-CTR encryption with you via the web browser.</p>
        <p style={{ textAlign: "justify" }}>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
        OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
        ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
        OTHER DEALINGS IN THE SOFTWARE.</p>
      </Col>
    </Row>
  </Col>)
}

export default Terms;
