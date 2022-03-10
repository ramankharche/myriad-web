import { useEffect } from "react";
import React from 'react';
require('core-js');
import "regenerator-runtime/runtime";
import Keycloak from 'keycloak-js'
import { useState } from "react";
import axios from "axios";
var Imm = require('immutable');
var ExposureAction = require('./container/actions/ExposureActions');
require('normalize.css');
require('fixed-data-table/dist/fixed-data-table.css');
require('rc-tooltip/assets/bootstrap.css');
require('react-widgets/dist/css/react-widgets.css');
require('react-datetime/css/react-datetime.css');
require('./stylesheets/app.scss');
require('./stylesheets/_breakpoints.scss');
require('react-select/dist/react-select.css');
Object.assign = require('object-assign');  // Required for FixedDataTable.
var _ = require('underscore');
var $ = require('jquery');
const GA = require('./container/util/GoogleAnalytics');
window.addEventListener('error', GA.sendExceptionHandler);
window.$ = window.jQuery = $;
window._ = _;
window.React = React;
window.globals = {};
comprehend = { globals: { immAppConfig: Imm.fromJS({}) } }

// const Router = require(/\/admin\//.test(window.location.href) ? './container/AdminRouter' : './container/ExposureRouter');
let token = ''
let userInitConf = null;

let keycloak = null;

let lsacConfig = {
  url: 'http://lsac.local:8180/auth',
  realm: 'lsac',
  clientId: 'lsac-darkroom-ui'
};

async function getKeycloak() {
  if (keycloak == null) {
    keycloak = Keycloak(lsacConfig);
    await keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256', promiseType: 'native' });
    if (!keycloak.authenticated) {
      await keycloak.login();
    }
  }
  return keycloak;
}

async function getUserInfo() {
  let kc = await getKeycloak();
  token = kc.token;
  return kc.loadUserInfo();
}

async function getUserInitConf() {
  if (userInitConf === null) {
    try {
      let userInfo2 = await getUserInfo();
      console.log("unserInfo2", userInfo2);
      userInitConf = {
        firstName: userInfo2.firstname,
        lastName: userInfo2.lastname,
        orgname: userInfo2.account,
        account: userInfo2.account,
        accountName: userInfo2["account-name"],
        userName: userInfo2.preferred_username,
        user: userInfo2.email,
        userId: userInfo2.sub,
        applications: userInfo2.applications
      };
    } catch (e) {
      console.log("Helper.UserInifConf error", e);
    }
  }
  return userInitConf;
}

function hitWhoAmI() {
  axios.get('http://myriad.local:9000/api/whoami', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then((data) => {
    console.log(token)
  }).catch(e => {
    console.log(e)
  })
}

function App() {

  const [authenticated, setAuthenticated] = useState(false);
  const [token, setAuthToken] = useState('');

  useEffect(() => {
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
    async function loadUserInfo() {
      try {
        await getUserInitConf();
        setAuthenticated(true)
      } catch (error) {
        console.log("App", error);
      }
    }
    loadUserInfo();
  }, []);

  return (
    <div>
      {
        authenticated ? (
          hitWhoAmI()
        ) : <p>Hello World un authenticated</p>
      }
    </div>
  );
}

export default App;
