import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordToggleInput = ({ptPasswordValue, ptChangePassword, ptClass, ptStyle, ptShowPassword, ptSetShowPassword}) => {

  const textBoxRef = useRef(null);
  const [showPasswordRequired, setShowPasswordRequired] = useState(!ptPasswordValue || !ptPasswordValue.length || ptPasswordValue.length < 6 );

  const handleTogglePassword = () => {
    ptSetShowPassword((prevState) => !prevState);
  };

  return (
    <div>
      <div className="row">
        <div className={"col-10 password-toggle-input"}>
          <input
            type={ptShowPassword ? 'text' : 'password'}
            value={ptPasswordValue}
            onChange={(event) => {
                ptChangePassword(event.target.value);
                setShowPasswordRequired(!event.target.value || !event.target.value.length || event.target.value.length < 6);
            }}
            className={ptClass}
            style={ptStyle}
            ref={textBoxRef}
            title={'Password'}
            id={'Password'}
            name={'Password'}
          />
          <FontAwesomeIcon
              icon={ptShowPassword ? faEye : faEyeSlash }
              className={'eyeIcon'}
              onClick={handleTogglePassword}
          />
        </div>
        <div className={"col-2 relative-container"}>
          <button 
            className={"copy-button-textbox"} 
            onClick={async () => {

              const textArea = textBoxRef.current;
              await navigator.clipboard.writeText(textArea.value);

            }}
            title={'copy-button-for-password'}
          >
            <span className={"fas fa-copy"} style={{ paddingTop: "3px" }}></span>
          </button>
        </div>
      </div>
      { showPasswordRequired &&
        <div className="row">
            <label style={{ color : 'red'}}>Password Required</label>
        </div>
      }
    </div>
  );
};

export default PasswordToggleInput;
