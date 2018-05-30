// ==UserScript==
// @name        Blackboard Search Enhancements
// @author      Kenton Lam
// @description Searches blackboard
// @match       https://learn.uq.edu.au/*
// @match       https://ilearn.bond.edu.au/*
// @version     0.1.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/featherlight/1.7.13/featherlight.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.2.0/fuse.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var featherlight__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var featherlight__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(featherlight__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fuse_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var fuse_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fuse_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var gm_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var gm_config__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(gm_config__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lz_string__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6);
/* harmony import */ var lz_string__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lz_string__WEBPACK_IMPORTED_MODULE_5__);
// ==UserScript==
// @name        Blackboard Search Enhancements
// @author      Kenton Lam
// @description Searches blackboard
// @match       https://learn.uq.edu.au/*
// @match       https://ilearn.bond.edu.au/*
// @version     VERSION
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/featherlight/1.7.13/featherlight.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.2.0/fuse.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.js
// ==/UserScript==

// These imports are so VSCode recognises the libraries. 
// They are removed by webpack and loaded via TamperMonkey's @require.







/* Queue.js */
/* eslint-disable */
//code.iamkate.com
function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};
/* eslint-enable */

function BlackboardSearch() {
    if (window.location.href.indexOf('/courseMenu.jsp') !== -1) return;

    let $ = jquery__WEBPACK_IMPORTED_MODULE_0___default.a.noConflict(true);

    // todo debug check before console log.

    class UniHelper {
        constructor(pageUrl) {
            this.uni = {};
            this.detectUni(pageUrl);
        }

        detectUni(pageUrl) {
            for (let i = 0; i < UniHelper.uniDefinitions.length; i++) {
                const uni = UniHelper.uniDefinitions[i];
                if (lodash__WEBPACK_IMPORTED_MODULE_3___default.a.startsWith(pageUrl, uni.baseUrl)) {
                    this.uni = uni;
                    false && console.log('Matched: ' + uni.baseUrl);
                }
            }

            if (!this.uni) {
                console.log('Unknown university: ' + pageUrl);
                this.uni = UniHelper.uniDefinitions[0];
            }
        }

        parseCourse(courseString) {
            if (this.uni.parseCourse) {
                return this.uni.parseCourse(courseString);
            } else {
                return UniHelper.uniDefinitions[0].parseCourse(courseString);
            }
        }

        parseUrl(url) {
            if (this.uni.parseUrl) {
                return this.uni.parseUrl(url);
            } else {
                let match = /[&?]course_id=([^&?]+)/.exec(url);
                if (!match) return null;
                return match[1];
            }
        }

        getIFrameUrl(courseId) {
            if (this.uni.getIFrameUrl) {
                return this.uni.getIFrameUrl(courseId);
            } else {
                return this.uni.baseUrl + 'webapps/blackboard/content/courseMenu.jsp?course_id=' + 
                    courseId +'&newWindow=true';
            }
        }
    }
    UniHelper.uniDefinitions = [
        {
            // TODO we need uni-specific calendars here too.
            baseUrl: 'https://learn.uq.edu.au/',
            parseCourse: function (courseTitle) {
                let match = /^\[([A-Za-z0-9/]+)\] (.*)$/.exec(courseTitle);
                if (!match) return null;
                
                let letters = match[1].slice(0, 4);
                let courseCodeArray = match[1].split('/');
                for (let c = 0; c < courseCodeArray.length; c++) {
                    if (courseCodeArray[c].length < 8) {
                        courseCodeArray[c] = letters + courseCodeArray[c];
                    }
                }
                return {
                    courseName: match[0].replace('['+match[1]+'] ', '').trim(),
                    courseCodeArray: courseCodeArray
                };
            }
        },
        {
            baseUrl: 'https://ilearn.bond.edu.au/',
            parseCourse: function (courseTitle) {
                let m = /^([^_]+)_[^ ]+ \((.*)\)$/.exec(courseTitle);
                return {
                    courseName: m[2],
                    courseCodeArray: [m[1]],
                };
            }
        }
    ];


    class BlackboardTreeParser {
        constructor(uniHelper) {
            /** @type {UniHelper} */
            this.uniHelper = uniHelper;

            this.callback = function() {};
            this.courseId = '';
            this.retryCount = 0;
            this.treeData = {};
            this.locked = false;
        }

        parseTree(courseId, callback) {
            this.courseId = courseId;
            this.callback = callback;
            this.retryCount = 0;
            this.locked = true;
            this.appendIFrame();
        }

        isUpdating() {
            return this.locked;
        }

        parseOneUL(listNode, rootName) {
            for (let j = 0; j < listNode.children.length; j++) {
                if (listNode.children[j].tagName.toUpperCase() === 'LI') {
                    let li = listNode.children[j];
                    let text = li.children[2].textContent.trim();
                    let thisName = lodash__WEBPACK_IMPORTED_MODULE_3___default.a.concat(rootName, text);
                    this.treeData.items.push({
                        'courseId': this.courseId,
                        'link': li.children[2].href,
                        'label': thisName
                    });
    
                    if (li.children.length > 3 && li.children[3].tagName.toUpperCase() === 'UL') 
                        this.parseOneUL(li.children[3], thisName);
                }
            }
        }

        startTreeParse(rootDiv) {
            this.treeData = {
                'lastUpdated': Date.now(),
                'courseId': this.courseId,
                'courseName': this.courseName,
                'courseCodeArray': this.courseCodeArray,
                'iframeSrc': this.iframeSrc,
                'items': [],
            };
            for (let i = 0; i < rootDiv.children.length; i++) {
                this.parseOneUL(rootDiv.children[i], [this.courseCodeArray.join('\u200A/\u200A')]);
            }
            return this.treeData;
        }

        bootstrapTreeParse() {
            this.retryCount++;
            function retry() {
                setTimeout(this.bootstrapTreeParse.bind(this), 100*Math.pow(2, this.retryCount-1));
            }
            
            console.log('bootstrap tree parse:');
            console.log(this);
            let frameDoc = this.iframe.contentDocument;
            frameDoc.querySelector('#expandAllLink').click();
            let div = frameDoc.querySelector('#courseMenu_folderView');
            if (div === null || frameDoc.querySelector('.--empty--') !== null) {
                retry.call(this);
                return false;
            } else {
                console.log('parsing');
                let tree = this.startTreeParse.call(this, div);
                
                if (!tree.items.length) {
                    retry.call(this);
                    return false;
                }
                this.iframe.parentNode.removeChild(this.iframe);
                this.retryCount = 0;
                this.locked = false;
                return this.callback(tree);
            }
        }

        iframeOnLoad() {
            let parsed = this.uniHelper.parseCourse(
                this.iframe.contentDocument.getElementById('courseMenu_link').textContent);

            this.courseName = parsed.courseName;
            this.courseCodeArray = parsed.courseCodeArray;

            if (this.iframe.contentDocument.getElementById('courseMapButton'))
                this.callback(null);
            else
                this.bootstrapTreeParse.call(this);
        }

        appendIFrame() {
            console.log('inserting iframe');
            if (document.getElementById('userscript-search-iframe') !== null) {
                throw new Error('Blackboard search IFrame already exists.');
            }
            this.iframe = document.createElement('iframe');
            this.iframe.id = 'userscript-search-iframe';
            // bug this will break if someone uses multiple unis.
            this.iframe.src = this.uniHelper.getIFrameUrl(this.courseId);
            this.iframeSrc = this.iframe.src;
            this.iframe.onload = this.iframeOnLoad.bind(this);
            this.iframe.style.width = '210px';
            this.iframe.style.display = 'none';
            
            document.getElementById('navigationPane').appendChild(this.iframe);
        }
    }

    class BlackboardSearchManager {
        constructor(pageUrl) {
            this.courseDataObject = {};
            this.linkItems = [];
            this.fuse = new fuse_js__WEBPACK_IMPORTED_MODULE_2___default.a(this.linkItems, {
                shouldSort: true,
                tokenize: true,
                matchAllTokens: true,
                maxPatternLength: 32,
                minMatchCharLength: 5,
                keys: [
                    'text'
                ],
                threshold: 0.3,
            });
            this.selectedRow = null;
            this.coursesToUpdate = [];

            this.uniHelper = new UniHelper(pageUrl);
            this.pageCourseId = this.uniHelper.parseUrl(pageUrl);

            this.parser = new BlackboardTreeParser(this.uniHelper);

            this.config = new gm_config__WEBPACK_IMPORTED_MODULE_4___default.a();
            /**
             * @type {Object<string, Date>[]}
             */
            this.weekDefinitions = [];
            this.selectedCourses = [];
            this.initialiseSettings();

            this.checkCurrentCourse();
        }

        checkCurrentCourse() {
            if (!this.pageCourseId) 
                return;
            if (this.courseDataObject.hasOwnProperty(this.pageCourseId))
                return;
            let parsedCourse = this.uniHelper.parseCourse(
                document.getElementById('courseMenu_link').textContent);
            let codes = parsedCourse.courseCodeArray;

            if (this.inSelectedCourses(codes)) {
                console.log('adding current page');
                this.queueUpdateCourse(this.pageCourseId);
                return true;
            }
            console.log('not adding current page');
            return false;
        }

        doSearch(event, force=false) {
            if (!force && !$.featherlight.current()) return false;

            while (this.searchResults.hasChildNodes()) {
                this.searchResults.removeChild(this.searchResults.lastChild);
            }
            let query = this.searchBox.value.trim();

            let selectedRowInResults = false;
            if (!query) {
                for (let i = 0; i < this.linkItems.length; i++) {
                    const item = this.linkItems[i];
                    // todo label to path
                    if (item.label[1] === 'Announcements') {
                        this.searchResults.appendChild(item.element);
                        $(item.element).fadeIn(200);
                        if (item.element === this.selectedRow)
                            selectedRowInResults = true;
                    }
                }
                if (!selectedRowInResults && this.searchResults.firstElementChild) {
                    this.selectRow(this.searchResults.firstElementChild);
                }
            } else {
                let results = this.fuse.search(query);
                
                for (let i = 0; i < Math.min(results.length, 50); i++) {
                    let r = results[i].element;
                    this.searchResults.appendChild(r);
                    $(r).hide().fadeIn(200);
                    if (r === this.selectedRow)
                        selectedRowInResults = true;
                }
                if (!selectedRowInResults && results.length) {
                    this.selectRow(results[0].element);
                }
            }

            if (event) {
                event.preventDefault();
            }
            return false;
        }

        selectPreviousRow() {
            if (this.selectedRow.previousElementSibling)
                this.selectRow(this.selectedRow.previousElementSibling);
            else 
                this.selectRow(this.selectedRow.parentNode.lastElementChild);
        }

        selectNextRow() {
            if (this.selectedRow.nextElementSibling)
                this.selectRow(this.selectedRow.nextElementSibling);
            else 
                this.selectRow(this.selectedRow.parentNode.firstElementChild);
        }

        selectRow(row) {
            if (row) {
                row.classList.add('search-selected');
                row.firstElementChild.focus();
                this.searchBox.focus();
            }
            if (this.selectedRow)
                this.selectedRow.classList.remove('search-selected');
            this.selectedRow = row;
        }

        searchKeyHandler(event) {
            switch (event.which) {
            case 38: // up
                if (!this.selectedRow)
                    this.selectRow(this.searchResults.firstElementChild);
                else 
                    this.selectPreviousRow();
                break;
    
            case 40: // right
                if (!this.selectedRow)
                    this.selectRow(this.searchResults.firstElementChild);
                else 
                    this.selectNextRow();
                break;

            case 13:
                if (this.selectedRow)
                    window.open(this.selectedRow.firstElementChild.href, '_self');
                break;
            default: return; // exit this handler for other keys
            }
            event.preventDefault();
        }

        tickTime() {
            this.timeSpan.textContent = new Date().toLocaleTimeString(  
                undefined, {hour: '2-digit', minute: '2-digit'});

            if ($.featherlight.current()) {
                setTimeout(this.tickTime.bind(this), 60000-Date.now()%60000);
            }
        }

        tickDateAndCalendar() {
            this.dateSpan.textContent = new Date().toLocaleDateString(undefined,
                {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

            this.semesterSpan.textContent = '';
            this.weekSpan.textContent = '';

            let now = new Date();
            let msPerWeek = 7*24*60*60*1000;
            for (let d = 0; d < this.weekDefinitions.length; d++) {
                const w = this.weekDefinitions[d];
                if (now >= w.startDate && now < w.endDate) {
                    this.weekSpan.textContent = 'Week ' + 
                        (Math.max(Math.floor((now-w.startMonday) / msPerWeek), 0) + w.startNum);
                    this.semesterSpan.textContent = w.name;
                    break;
                }
            }

            if ($.featherlight.current()) {
                let msPerDay = 24*60*60*1000;
                setTimeout(this.tickDateAndCalendar.bind(this), 
                    msPerDay-Date.now()%msPerDay);
            }
        }

        refreshTimeElements() {
            this.tickTime();
            this.tickDateAndCalendar();
        }

        createElement(element, options) {
            var el = document.createElement(element);
            if (options)
                lodash__WEBPACK_IMPORTED_MODULE_3___default.a.assign(el, options);
            return el;
        }

        createWindow() {
            this.searchWindow = document.createElement('div');
            this.searchWindow.id = 'userscript-search-window';

            this.header = document.createElement('div');
            this.header.id = 'userscript-header';
            
            this.dateTimeSpan = document.createElement('span');
            this.dateTimeSpan.id = 'userscript-date-time';
            this.timeSpan = document.createElement('span');
            this.timeSpan.id = 'userscript-time';
            this.dateSpan = document.createElement('span');
            this.dateSpan.id = 'userscript-date';
            this.dateTimeSpan.appendChild(this.timeSpan);
            this.dateTimeSpan.appendChild(document.createElement('br'));
            this.dateTimeSpan.appendChild(this.dateSpan);

            this.tickTime();
            this.header.appendChild(this.dateTimeSpan);

            this.calendar = this.createElement('span', {
                id: 'userscript-calendar'
            });
            this.weekSpan = this.createElement('span', {
                id: 'userscript-week',
                textContent: 'Week 4',
            });
            this.calendar.appendChild(this.weekSpan);
            this.calendar.appendChild(this.createElement('br'));
            this.semesterSpan = this.createElement('span', {
                id: 'userscript-semester',
                textContent: 'Semester 1, 2018',
            });
            this.calendar.appendChild(this.semesterSpan);
            this.tickDateAndCalendar();
            this.header.appendChild(this.calendar);

            this.searchWindow.appendChild(this.header);

            this.searchForm = document.createElement('form');
            this.searchForm.id = 'userscript-search-form';
            
            this.searchBox = document.createElement('input');
            this.searchBox.id = 'userscript-search-input';
            this.searchBox.type = 'search';
            this.searchBox.name = 'search';
            this.searchBox.setAttribute('autocomplete', 'off');
            this.searchBox.tabIndex = 0;
            this.searchBox.addEventListener('input',
                lodash__WEBPACK_IMPORTED_MODULE_3___default.a.debounce(this.doSearch.bind(this), 200));
            $(this.searchBox).keydown(
                this.searchKeyHandler.bind(this));
        
            this.searchForm.appendChild(this.searchBox);
        
            this.searchButton = document.createElement('input');
            this.searchButton.type = 'submit';
            this.searchButton.style.display = 'none';
            this.searchButton.onclick = lodash__WEBPACK_IMPORTED_MODULE_3___default.a.noop;
            this.searchForm.appendChild(this.searchButton);
        
            this.searchWindow.appendChild(this.searchForm);

            this.searchResults = document.createElement('ul');
            this.searchResults.id = 'userscript-search-results';
            this.searchWindow.appendChild(this.searchResults);

            
            this.footerDiv = document.createElement('div');
            this.footerDiv.id = 'userscript-search-footer';
            
            this.updateButton = document.createElement('span');
            this.updateButton.id = 'userscript-update-button';
            this.updateButton.textContent = 'Refresh';
            this.updateButton.onclick = this.updateAllCourses.bind(this);
            this.footerDiv.appendChild(this.updateButton);

            this.footerDiv.appendChild(document.createTextNode(' | '));

            this.settingsButton = document.createElement('span');
            this.settingsButton.id = 'userscript-options-button';
            this.settingsButton.textContent = 'Options';
            this.settingsButton.onclick = this.showConfig.bind(this);
            this.footerDiv.appendChild(this.settingsButton);
            
            this.searchWindow.appendChild(this.footerDiv);

            return this.searchWindow;
        }

        appendSearchForm(root) {
            root.appendChild(this.searchWindow);
        }

        updateAllCourses() {
            for (const courseId in this.courseDataObject) {
                if (this.courseDataObject.hasOwnProperty(courseId)) {
                    this.queueUpdateCourse(courseId);
                }
            }
        }

        queueUpdateCourse(courseId) {
            if (!this.parser.isUpdating()) {
                this.parser.parseTree(courseId, this.parseTreeCallback.bind(this));
            } else {
                console.log('already updating');
                this.coursesToUpdate.push(courseId);
            }
        }

        getCourseObject(courseId) {
            return this.courseDataObject[courseId];
        }

        maybeUpdateCourse(courseObject) {
            let courseId = courseObject.courseId;
            let updateInterval;
            if (courseId === this.pageCourseId) 
                updateInterval = this.config.get('CurrentCourseUpdateInterval');
            else
                updateInterval = this.config.get('OtherCourseUpdateInterval');

            if (Date.now() - courseObject.lastUpdated > updateInterval*60000) {
                console.log('Updating '+courseId);
                this.queueUpdateCourse(courseObject.courseId);
            }
        }

        maybeUpdateAllCourses() {
            for (const id in this.courseDataObject) {
                if (this.courseDataObject.hasOwnProperty(id)) {
                    this.maybeUpdateCourse(this.courseDataObject[id]);
                }
            }
        }

        parseTreeCallback(treeData) {
            if (treeData) {
                console.log(JSON.stringify(treeData, undefined, 2)); 
                let courseId = treeData.courseId;
                this.courseDataObject[courseId] = treeData;
            }
            if (this.coursesToUpdate.length === 0) {
                this.updateLinks();
                this.storeCourseData();
            } else {
                let course = this.coursesToUpdate.pop();
                this.queueUpdateCourse(course, true);
            }
        }

        storeCourseData() {
            this.config.set('CourseDataLZ', 
                lz_string__WEBPACK_IMPORTED_MODULE_5___default.a.compressToUTF16(JSON.stringify(this.courseDataObject)));
            this.config.save();
        }

        formatLinkText(textArray, shorten=false) {
            return textArray.join(' > ');
        }

        updateLinks() {
            lodash__WEBPACK_IMPORTED_MODULE_3___default.a.remove(this.linkItems, lodash__WEBPACK_IMPORTED_MODULE_3___default.a.stubTrue);
            for (const id in this.courseDataObject) {
                if (this.courseDataObject.hasOwnProperty(id)) {
                    this.linkItems.push(...this.courseDataObject[id].items);
                }
            }
            for (let i = 0; i < this.linkItems.length; i++) {
                const item = this.linkItems[i];
                let li = document.createElement('li');
                let a = document.createElement('a');
                a.href = item.link;
                // todo label to path.
                a.textContent = this.formatLinkText(item.label, true);
                li.appendChild(a);
                item.element = li;
                item.text = this.formatLinkText(item.label);
                item.courseCode = item.label[0];
            }
            return this.linkItems;
        }

        inCourseDataObject(courseCode) {
            for (const id in this.courseDataObject) {
                if (this.courseDataObject.hasOwnProperty(id)) {
                    const courseData = this.courseDataObject[id];
                    if (courseData.courseCodeArray.indexOf(courseCode) !== -1)
                        return true;
                }
            }
            return false;
        }

        inSelectedCourses(courseCodeArray) {
            if (!courseCodeArray) return false;
            for (let i = 0; i < courseCodeArray.length; i++) {
                if (this.selectedCourses.indexOf(courseCodeArray[i]) !== -1)
                    return true;                
            }
            return false;
        }

        // todo refactor this and config related window into another class.
        updateSettings() {
            // Parse week definitions text box into dates.
            lodash__WEBPACK_IMPORTED_MODULE_3___default.a.remove(this.weekDefinitions, lodash__WEBPACK_IMPORTED_MODULE_3___default.a.stubTrue);
            let weekLines = this.config.get('WeekDefinitions').split('\n');

            let weekRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d+)?\s+(.+)$/;
            for (let index = 0; index < weekLines.length; index++) {
                let line = weekLines[index].trim();
                try {
                    let w = weekRegex.exec(line);
                    if (!w) {
                        console.log('Invalid week definition: '+line);
                        continue;
                    }
                    let start = new Date(Number(w[1]), Number(w[2])-1, Number(w[3]), 0, 0, 0);
                    let end = new Date(Number(w[4]), Number(w[5])-1, Number(w[6]), 24, 0, 0);
                    
                    // Relative Monday. For calculating week number.
                    // If 'start' falls on a weekend, startMonday will be 
                    // the _following_ Monday. Otherwise, it is the preceding
                    // Monday. Clone date object.
                    let startMonday = new Date(start.getTime());
                    // Where 1 = Monday, ..., 7 = Sunday.
                    let startDayOfWeek = (startMonday.getDay()+6) % 7 + 1;
                    if (startDayOfWeek >= 6) {
                        startMonday.setDate(
                            startMonday.getDate() + 7 - startDayOfWeek + 1);
                    } else {
                        startMonday.setDate(
                            startMonday.getDate() - startDayOfWeek + 1);
                    }

                    let numStart;
                    if (!w[7]) 
                        numStart = 1;
                    else 
                        numStart = Number(w[7]);
                    let text = w[8];
                    this.weekDefinitions.push({
                        startDate: start,
                        startMonday: startMonday,
                        endDate: end,
                        startNum: numStart,
                        name: text,
                    });
                } catch (e) {
                    console.log('Invalid week definition: ' + line);
                }
            }

            // Parse enabled courses into list.
            lodash__WEBPACK_IMPORTED_MODULE_3___default.a.remove(this.selectedCourses);
            let splitCourses = this.config.get('SelectedCourses').split('\n');
            for (let i = 0; i < splitCourses.length; i++) {
                const code = splitCourses[i];
                if (code.trim()) {
                    this.selectedCourses.push(code);
                }
                
            }
            
            // Delete courses no longer in list.
            for (const courseId in this.courseDataObject) {
                if (this.courseDataObject.hasOwnProperty(courseId)) {
                    if (!this.inSelectedCourses(
                        this.courseDataObject[courseId].courseCodeArray)) {
                        
                        console.log('deleting: ' + courseId);
                        this.deleteCourse(courseId);
                    }
                }
            }
        }

        deleteCourse(idToDelete) {
            let deletedItems = lodash__WEBPACK_IMPORTED_MODULE_3___default.a.remove(this.linkItems, function (item) {
                return item.courseId === idToDelete;
            });
            for (let i = 0; i < deletedItems.length; i++) {
                const item = deletedItems[i];
                if (item.element.parentNode) 
                    item.element.parentNode.removeChild(item.element);
            }
            delete this.courseDataObject[idToDelete];
            this.storeCourseData();
        }

        initialiseSettings() {
            this.config.init({
                id: 'BlackboardSearchConfig',
                title: 'Search Options',
                fields: {
                    'CourseDataLZ': {
                        type: 'hidden',
                        default: lz_string__WEBPACK_IMPORTED_MODULE_5___default.a.compressToUTF16('{}')
                    },
                    'CurrentCourseUpdateInterval': {
                        label: 'Active update interval (minutes)',
                        title: 'How often to update when a course page is visited.',
                        type: 'unsigned float',
                        default: 120
                    },
                    'OtherCourseUpdateInterval': {
                        label: 'Background update interval (minutes)',
                        type: 'unsigned float',
                        default: 360
                    },
                    'SelectedCourses': {
                        label: 'Enabled courses',
                        type: 'textarea',
                        default: '',
                    },
                    'WeekDefinitions': {
                        label: 'Calendar',
                        type: 'textarea',
                        default: `2018-02-19 2018-04-01 1 Semester 1
2018-04-02 2018-04-15 1 Mid-semester Break — Semester 1
2018-04-16 2018-06-03 7 Semester 1
2018-06-04 2018-06-08 1 Revision Period — Semester 1
2018-06-09 2018-06-24 1 Examination Period — Semester 1
2018-07-23 2018-09-23 1 Semester 2
2018-09-24 2018-09-30 1 Mid-semester Break — Semester 2
2018-10-02 2018-10-28 10 Semester 2
2018-10-29 2018-11-02 1 Revision Period — Semester 2
2018-11-03 2018-11-18 1 Examination Period — Semester 2
2019-02-25 2019-04-21 1 Semester 1
2019-04-22 2019-04-28 1 Mid-semester Break — Semester 1
2019-04-29 2019-06-02 9 Semester 1
2019-06-03 2019-06-07 1 Revision Period — Semester 1
2019-06-08 2019-06-23 1 Examination Period — Semester 1
2019-07-22 2019-09-29 1 Semester 2
2019-09-30 2019-10-06 1 Mid-semester Break — Semester 2
2019-10-08 2019-10-27 11 Semester 2
2019-10-28 2019-11-01 1 Revision Period — Semester 2
2019-11-02 2019-11-17 1 Examination Period — Semester 2`,
                    }
                },
                events: {
                    save: this.updateSettings.bind(this),
                },
                css: configCss,
            });
            
            let courseData = JSON.parse(lz_string__WEBPACK_IMPORTED_MODULE_5___default.a.decompressFromUTF16(this.config.get('CourseDataLZ')));

            lodash__WEBPACK_IMPORTED_MODULE_3___default.a.assign(this.courseDataObject, courseData);
            this.updateLinks();
            this.updateSettings();
        }

        showConfig() {
            $.featherlight.current().close();
            this.config.open();
        }
    }

    console.log('Blackboard search starting.');
    

    let searchManager = new BlackboardSearchManager(window.location.href);
    searchManager.maybeUpdateAllCourses();
    let searchWindow = searchManager.createWindow();
    
    const SPACE = ' '.charCodeAt(0);
    
    function keyboardShortcut(e) {
        if (e.ctrlKey && e.keyCode === SPACE) {
            if ($.featherlight.current()) return;
            $.featherlight($(searchWindow), {
                openSpeed: 50,
                closeSpeed: 200,
                persist: true,
                // TODO move these functions into BlackboardSearchManager
                beforeOpen: function() {
                    searchManager.refreshTimeElements();
                    searchManager.doSearch(undefined, true);
                    if (document.body.scrollHeight > document.body.clientHeight) {
                        document.body.style.paddingRight = '17px';
                        document.getElementsByClassName('global-nav-bar-wrap')[0].style.right = '17px';
                    }
                },
                afterOpen: function() {
                    let input = document.querySelector('#userscript-search-input');
                    input.focus();
                    input.select();
                },
                afterClose: function() {
                    document.body.style.paddingRight = '0px';
                    document.getElementsByClassName('global-nav-bar-wrap')[0].style.right = '0px';
                }
            });
        }
    }
    
    document.addEventListener('keydown', keyboardShortcut, false);
}

let configCss = `
#BlackboardSearchConfig * { 
    font-family: 'Segoe UI', 'Helvetica';
}

body#BlackboardSearchConfig  {
    padding: 10px;
}

#BlackboardSearchConfig .config_var, #BlackboardSearchConfig .field_label {
    font-size: 11pt;
    height: 2em;
}

#BlackboardSearchConfig .config_var {
    display: table;
    width: 100%;
    text-align: right;
}

#BlackboardSearchConfig .field_label {
    display: table-cell;
    width: 70%;
    vertical-align: middle;
    text-align: left;
    font-weight: normal;
}

#BlackboardSearchConfig input[type="text"], #BlackboardSearchConfig textarea {
    height: 2em;
    width: 100%;
    float: right;
    padding-left: 2px;
}

#BlackboardSearchConfig textarea {
    resize: vertical;
}

#BlackboardSearchConfig_resetLink {
}

#BlackboardSearchConfig button, #BlackboardSearchConfig .saveclose_buttons {
    font-weight: normal;
    font-size: 12pt;
    border-width: 1px;
    border-radius: 5px;
    border-color: #272727;
    border-style: solid;
    padding: 3px 20px 3px 20px;
    color: #272727;
    background-color: transparent;
    transition-property: background-color color;
    transition-duration: 500ms;
}

button:focus {
    outline: 0;
}

#BlackboardSearchConfig button:hover {
    background-color: #272727;
    color: white;
}

#BlackboardSearchConfig #BlackboardSearchConfig_closeBtn {
    margin-right: 0px;
}

#BlackboardSearchConfig #BlackboardSearchConfig_WeekDefinitions_field_label {
    vertical-align: top;
    padding-top: 3px;
    width: 30%;
}

#BlackboardSearchConfig #BlackboardSearchConfig_field_WeekDefinitions {
    height: 9em;
    font-family: monospace;
    white-space: nowrap;
    overflow-x: auto;
}

#BlackboardSearchConfig #BlackboardSearchConfig_SelectedCourses_field_label {
    vertical-align: top;
    padding-top: 3px;
}

#BlackboardSearchConfig #BlackboardSearchConfig_field_SelectedCourses {
    height: 5.5em;
    font-family: monospace;
}
`;

let mainCss = __webpack_require__(7).toString();

let style = document.createElement('style');
style.type = 'text/css';
style.id = 'userscript-search-style';
style.appendChild(document.createTextNode(mainCss));
document.head.appendChild(style);

let cssId = 'userscript-featherlight-css';  
let link  = document.createElement('link');
link.id   = cssId;
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/featherlight/1.7.13/featherlight.min.css';
link.media = 'all';
link.onload = BlackboardSearch;

document.head.appendChild(link);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = jQuery.featherlight;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = Fuse;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = _;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = GM_configStruct;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = LZString;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, ".featherlight-content {\r\n    border-bottom: 5px !important;\r\n    padding-bottom: 15px !important;\r\n    width: 50% !important;\r\n}\r\n\r\n#userscript-search-input {\r\n    padding-top: 3px;\r\n    padding-bottom: 3px;\r\n    padding-left: 3px;\r\n    margin-bottom: 1px;\r\n}\r\n\r\nul#userscript-search-results {\r\n    list-style-type: none;\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n    height: 19em;\r\n    margin: 0;\r\n    overflow-x: auto;\r\n    overflow-y: auto;    \r\n}\r\n\r\nul#userscript-search-results > li {\r\n    padding: 5px;\r\n    display:block;\r\n    text-overflow: ellipsis;\r\n    transition-property: background-color;\r\n    transition-duration: 100ms;\r\n    \r\n}\r\n\r\nul#userscript-search-results > li> a:hover {\r\n    text-decoration: underline;\r\n}\r\n\r\nli.search-selected {    \r\n    background-color: #e7e7e7;\r\n}\r\n\r\nul#userscript-search-results > li > a {\r\n    text-decoration: none;\r\n}\r\n\r\n#userscript-search-window {\r\n    font-size: 13pt;\r\n    font-weight: normal;\r\n    font-family: 'Segoe UI', 'Helvetica';\r\n}\r\n\r\n#userscript-search-input {\r\n    width: 100%;\r\n}\r\n\r\n#userscript-search-footer {\r\n    text-align: right;\r\n    color: grey;\r\n    font-size: 12pt;\r\n}\r\n\r\n#userscript-search-footer > span {\r\n    text-decoration: underline;\r\n    cursor: pointer;\r\n}\r\n\r\niframe#BlackboardSearchConfig { \r\n    width: 35% !important; \r\n    min-width: 400px !important;\r\n}\r\n\r\n#userscript-header {\r\n    display: table;\r\n    text-align: left;\r\n    width: 100%;\r\n    margin-bottom: 8px;\r\n}\r\n\r\n#userscript-header > span {\r\n    display:table-cell;\r\n}\r\n\r\n#userscript-time, #userscript-week {\r\n    font-size: 20pt;\r\n}\r\n\r\n#userscript-calendar {\r\n    text-align: right;\r\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ })
/******/ ]);
//# sourceMappingURL=blackboard_search.user.js.map