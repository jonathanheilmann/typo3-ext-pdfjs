# PDF.js (EXT:pdfjs)

**Extension key:**
pdfjs

**Version:**
0.0.1

**Language:**
en

**Description:**
Integrates [PDF.js by Mozilla Foundation](https://github.com/mozilla/pdf.js) into TYPO3 CMS and provides various configuration options.

**Keywords:**
pdf,pdfjs,viewer,catalog

**Copyright:**
2016

**Author:**
Jonathan Heilmann

**Email:**
[mail@jonathan-heilmann.de](mail@jonathan-heilmann.de)

**Licence:**
This document is published under the Open Publication License available from [opencontent.org/openpub/](http://www.opencontent.org/openpub/)

The content of this document is related to TYPO3, a GNU/GPL CMS/Framework available from www.typo3.org.

##Administration

###Installation

1. Go to the Extension Manager
2. Install the extension
3. Include the static template "PDF Viewer (pdfjs)"
4. Configure extension if required (see section below)

##Configuration

All global configurations are accessible via Constant Editor, section "PLUGIN.TX_PDFJS".

Available constants are described in Constant Editor.
For pages, not using bootstrap framework, this extension ships required styles in file "EXT:pdfjs/Resources/Public/Styles/bootstrapStyles.css". Insert this path in constant "plugin.tx_pdfjs.settings.bootstrapStyles".

##User

Add a PDF Viewer content element to your site:

1. Create a new content element of type "plugin"
2. Select plugin "PDF Viewer"
4. Add pdf file and configure viewer
5. Save

##Known Problems

To check if there are known issues or planed features, please visit [github.com/jonathanheilmann/typo3-ext-pdfjs/issues](https://github.com/jonathanheilmann/typo3-ext-pdfjs/issues)

You are welcome to report issues and suggest enhancements/features, too.

##ChangeLog

- [ENHANCEMENT] #5  Allow multiple instances on one page
- [ENHANCEMeNT] #9  Add "jump to page" field
- [BUG]         #3  Wrong url to pdf file
- [BUG]         #4  Clearfix missing
- [BUG]         #8  New content element wizard misses labels
- [TASK]        #7  Add Support for Typo 3 v8.x

###0.0.1

- Initial release of extension