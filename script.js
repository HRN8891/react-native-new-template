#!/usr/bin/env node

console.log("This is post init script");
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');


const spinner = ora('This is the post-init script');

const PROJECT_PATH = process.cwd();
console.log('PROJECT_PATH local', PROJECT_PATH);
const PACKAGE_JSON_PATH = `${PROJECT_PATH}/${path.basename(process.cwd())}/App.tsx`;
const PLIST_PATH = `${PROJECT_PATH}/${path.basename(process.cwd())}/ios/${path.basename(process.cwd())}/info.plist`;
const STRING_XML_PATH = `${PROJECT_PATH}/${path.basename(process.cwd())}/android/app/src/main/res/values/strings.xml`;
