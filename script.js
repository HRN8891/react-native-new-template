#!/usr/bin/env node

console.log("This is post init script");
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
var questionnaire = require('questionnaire');


var questions = [
    {
      id: 'os',
      text: 'Do you prefer (1) OSX, (2) Windows or (3) Linux?',
      options: ['osx', 'windows', 'linux']
    },
    {
      id: 'coffee',
      text: 'Do you like coffee with (1) milk or with (2) sugar?',
      options: ['milk', 'sugar']
    },
    {
      id: 'actor',
      options: ['Stephen Fry', 'Hugh Laurie']
    }
  ];
   
  var answers = questionnaire(questions);
  console.log("Here are the answers: #{JSON.stringify(answers)}")

const spinner = ora('This is the post-init script');

const PROJECT_PATH = process.cwd();
console.log('PROJECT_PATH local', PROJECT_PATH);
const PACKAGE_JSON_PATH = `${PROJECT_PATH}/App.js`;
const PLIST_PATH = `${PROJECT_PATH}/ios/${path.basename(process.cwd())}/info.plist`;
const STRING_XML_PATH = `${PROJECT_PATH}/android/app/src/main/res/values/strings.xml`;

console.log('PACKAGE_JSON_PATH local', PACKAGE_JSON_PATH);

const PROJECT_SRC_PATH = `${PROJECT_PATH}/src`
console.log('PROJECT_SRC_PATH local', PROJECT_SRC_PATH);

console.log('Hi, welcome to Node Pizza');


const questions = [
    {
      type: 'confirm',
      name: 'CodePush',
      message: 'Do you want CodePush feature in your app?',
      default: false,
      transformer: (answer) => (answer ? '👍' : '👎'),
    },
  ];
  let content = ''
  inquirer.prompt(questions).then((answers) => {
    console.log('\nOrder receipt:');
    console.log(JSON.stringify(answers, null, '  '));
    if(answers.CodePush === true) {
      content = `import * as React from 'react';
      import {Provider} from 'react-redux';
      import {NavigationContainer} from '@react-navigation/native';
      
      import {store} from './src/store';
      import {navigationRef} from './src/navigation/root';
      
      import Navigation from './src/navigation';
      import ErrorBoundary from './src/components/ErrorBoundary';
      import ErrorWithRestartBtn from './src/components/ErrorWithRestartBtn';
      
      function App() {
        const handleError = () => {
          // log the error
        };
        return (
          <ErrorBoundary onError={handleError} FallbackComponent={ErrorWithRestartBtn}>
            <NavigationContainer ref={navigationRef}>
              <Provider store={store}>
                <Navigation />
              </Provider>
            </NavigationContainer>
          </ErrorBoundary>
        );
      }
      //Uncomment below two lines for OTA after adding env vars
      // const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};
      // App = codePush(codePushOptions)(App);
      
      export default App;`;
    
    }else {
      console.log("Its not required");
      content = `import React from 'react';
      import { Text, SafeAreaView } from 'react-native';
      
      const App = () => {
        return (
          <SafeAreaView>
            <Text>React Native Template</Text>
          </SafeAreaView>
        );
      };
      export default App;` 

      const jsonData = fs.readFileSync(PLIST_PATH, { encoding: 'utf8' });
      const newString = jsonData.replace('<key>CodePushDeploymentKey</key>', '').replace('<string>$(CODE_PUSH_DEPLOYMENT_KEY_IOS)</string>', '');
      fs.writeFile(PLIST_PATH, newString, 'utf8', function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("The json file was saved!");
        });
  
        const stringXMLData = fs.readFileSync(STRING_XML_PATH, { encoding: 'utf8' });
        console.log('json data', stringXMLData, typeof stringXMLData);
        const newStringXMLData = stringXMLData.replace('<string moduleConfig="true" name="CodePushDeploymentKey">@string/CODE_PUSH_DEPLOYMENT_KEY_ANDROID</string>', '');
        fs.writeFile(STRING_XML_PATH, newStringXMLData, 'utf8', function(err) {
            if (err) {
              return console.log(err);
            }
            console.log("The XML file was saved!");
          });
      console.log('json data', newStringXMLData, typeof newStringXMLData);

    }   
    fs.writeFile(PACKAGE_JSON_PATH, content, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });

  });
