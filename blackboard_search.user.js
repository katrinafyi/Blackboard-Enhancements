// ==UserScript==
// @name        Blackboard Search Enhancements
// @description Searches blackboard.
// @match       https://learn.uq.edu.au/*
// @version     0.1
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

import 'lodash';
import 'jquery';
import 'featherlight';
import 'lz-string';
import 'fuse.js';

if (window.location.href.indexOf('/courseMenu.jsp') !== -1) return;

/* Queue.js */
//code.iamkate.com
function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};


let cssId = 'featherlightCSS';  
let head  = document.getElementsByTagName('head')[0];
let link  = document.createElement('link');
link.id   = cssId;
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/featherlight/1.7.13/featherlight.min.css';
link.media = 'all';
link.onload = (function BlackboardSearch() {

    // 2^53 - 1
    let MAX_INT = Number.MAX_SAFE_INTEGER || 9007199254740991;
    let $ = jQuery.noConflict(true);

    class BlackboardTreeParser {
        constructor(courseId) {
            this.courseId = courseId;
            this.callback = function() {};
            this.retryCount = 0;
            this.delim = ' > ';
            this.treeData = {};
        }

        parseTree(callback) {
            this.callback = callback;
            this.retryCount = 0;
            this.appendIFrame();
        }

        parseOneUL(listNode, rootName) {
            for (let j = 0; j < listNode.children.length; j++) {
                if (listNode.children[j].tagName.toUpperCase() === 'LI') {
                    let li = listNode.children[j];
                    let text = li.children[2].textContent.trim();
                    let thisName = rootName + this.delim + text;
                    this.treeData.items.push({
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
                'time': Date.now(),
                'courseId': this.courseId,
                'courseName': this.courseName,
                'courseCode': this.courseCode,
                'items': [],
            };
            for (let i = 0; i < rootDiv.children.length; i++) {
                this.parseOneUL(rootDiv.children[i], this.courseCode);
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
                //this.iframe.parentNode.removeChild(this.iframe);
                this.retryCount = 0;
                return this.callback(tree);
            }
        }

        iframeOnLoad() {
            console.log(this);
            let courseTitle = this.iframe.contentDocument.querySelector('#courseMenu_link').textContent;
            let codeMatch = /^\[([A-Z0-9/]+)\]/i.exec(courseTitle);
            if (!codeMatch) throw new Error('No matched course code: ' + courseTitle);
            let letters = codeMatch[1].slice(0, 4);
            let courseCode = codeMatch[1].split('/');
            for (let c = 0; c < courseCode.length; c++) {
                if (courseCode[c].length <= 4) {
                    courseCode[c] = letters + courseCode[c];
                }
            }

            this.courseName = courseTitle.replace(codeMatch[0] + ' ', '');
            this.courseCode = courseCode.join('/');

            console.log('iframe that: ');
            console.log(this);
            if (this.iframe.contentDocument.getElementById('courseMapButton'))
                console.log('iframe invalid');
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
            this.iframe.src = 'https://learn.uq.edu.au/webapps/blackboard/content/courseMenu.jsp?course_id=' + 
                this.courseId +'&newWindow=true'; // &openInParentWindow=true
            this.iframe.onload = this.iframeOnLoad.bind(this);
            this.iframe.style.width = '210px';
            //this.iframe.style.display = 'none';
            
            document.getElementById('navigationPane').appendChild(this.iframe);
        }
    }

    class BlackboardSearchManager {
        constructor() {
            this.courseDataObjects = [];
            this.linkItems = [];
            this.fuse = new Fuse(this.linkItems, {
                shouldSort: true,
                tokenize: true,
                matchAllTokens: true,
                maxPatternLength: 32,
                minMatchCharLength: 2,
                keys: [
                    'label'
                ],
                threshold: 0.2,
            });
            this.selectedRow = null;

            this.config = new GM_configStruct();
            this.initialiseSettings();
        }

        doSearch(event) {
            if (!$.featherlight.current()) return false;
            while (this.searchResults.hasChildNodes()) {
                this.searchResults.removeChild(this.searchResults.lastChild);
            }
            let results = _.map(
                this.fuse.search(this.searchBox.value.trim()).slice(0, 50),
                (e) => {return e.element}
            );
            
            console.log(results);
            if (!this.selectedRow && results.length)
                this.selectRow(results[0]);
            for (let i = 0; i < results.length; i++) {
                let r = $(results[i]);
                this.searchResults.appendChild(results[i]);
                r.hide().fadeIn(200);
            }
            if (results.indexOf(this.selectedRow) === -1)
                this.selectRow(null);
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

        createSearchForm(rootNode=null) {
            this.searchWindow = document.createElement('div');
            this.searchWindow.id = 'userscript-search-window';

            this.searchForm = document.createElement('form');
            this.searchForm.id = 'userscript-search-form';
            
            this.searchBox = document.createElement('input');
            this.searchBox.id = 'userscript-search-input';
            this.searchBox.type = 'search';
            this.searchBox.name = 'search';
            this.searchBox.setAttribute('autocomplete', 'off');
            this.searchBox.tabIndex = 0;
            this.searchBox.addEventListener('input',
                _.debounce(this.doSearch.bind(this), 200));
            $(this.searchBox).keydown(
                this.searchKeyHandler.bind(this));
        
            this.searchForm.appendChild(this.searchBox);
        
            this.searchButton = document.createElement('input');
            this.searchButton.type = 'submit';
            this.searchButton.style.display = 'none';
            this.searchButton.onclick = (() => {return false;});
        
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

            if (rootNode) this.appendSearchForm(rootNode);
            return this.searchWindow;
        }

        appendSearchForm(root) {
            root.appendChild(this.searchWindow);
        }

        updateAllCourses() {

        }

        updateCourseId(courseId) {
            let parser = new BlackboardTreeParser(courseId);
            parser.parseTree(this.parseTreeCallback.bind(this));
        }

        parseTreeCallback(treeData) {
            console.log(JSON.stringify(treeData, undefined, 2)); 
            this.courseDataObjects.push(treeData);
            this.updateLinkItems();
            console.log(this.linkItems);
        }

        storeCourseData() {
            console.log('old data:')
            console.log(JSON.parse(LZString.decompressFromUTF16(this.config.get('CourseData'))));
            
            this.config.set('CourseData', LZString.compressToUTF16(JSON.stringify(this.courseDataObjects)));

            console.log('saved:');
            console.log(this.config.get('CourseData'));
            this.config.save();
        }

        updateLinkItems() {
            this.storeCourseData();
            _.remove(this.linkItems);
            _.forEach(this.courseDataObjects, function(o) {
                this.linkItems.push(...o.items);
            }.bind(this));
            for (let i = 0; i < this.linkItems.length; i++) {
                let item = this.linkItems[i];
                let li = document.createElement('li');
                let a = document.createElement('a');
                a.href = item.link;
                a.textContent = item.label;
                li.appendChild(a);
                item.element = li;
            }
            return this.linkItems;
        }

        initialiseSettings() {
            this.config.init({
                id: 'BlackboardSearchConfig',
                title: 'Blackboard Search Options',
                fields: {
                    'Name': {
                        label: 'Name',
                        type: 'text',
                        default: 'hello world'
                    },
                    'CourseData': {
                        label: 'Course Data Objects',
                        type: 'hidden'
                    }
                },
                css: `
                #BlackboardSearchConfig * { 
                    font-family: 'Segoe UI', 'Helvetica';
                }
                
                #BlackboardSearchConfig .config_var, #BlackboardSearchConfig .field_label {
                    font-size: 13pt;
                }

                #BlackboardSearchConfig .field_label {
                    font-weight: normal;
                }
                
                #BlackboardSearchConfig input[type="text"] {
                    height: 2.5em;
                }

                `
            });
        }

        showConfig() {
            $.featherlight.current().close();
            this.config.open();
        }
    }



    console.log('Blackboard search starting.');
    //debugger;
    

    let courseIDRegex = /[?&]course_id=([^&?]+)/i;
    let match = courseIDRegex.exec(window.location.href);
    if (!match) return;

    let search = new BlackboardSearchManager();
    search.updateCourseId(match[1]);
    let searchWindow = search.createSearchForm();
    
    const SPACE = ' '.charCodeAt(0);
    
    function keyboardShortcut(e) {
        if (e.ctrlKey && e.keyCode === SPACE) {
            if ($.featherlight.current()) return;
            $.featherlight($(searchWindow), {
                openSpeed: 50,
                closeSpeed: 200,
                persist: true,
                afterOpen: function() {
                    let input = document.querySelector('#userscript-search-input');
                    input.focus();
                    input.select();
                },
            });
        }
    }
    

    document.addEventListener('keydown', keyboardShortcut, false);

});

head.appendChild(link);

