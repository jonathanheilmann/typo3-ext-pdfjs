<?php
if (!defined('TYPO3_MODE'))
    die ('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
    'JonathanHeilmann.' . $_EXTKEY,
    'PdfViewer',
	array(
		'PdfViewer' => 'showSimple, showComplete',
	)
);

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
    'mod.wizards.newContentElement.wizardItems {
        plugins {
            elements {
                tx_pdfjs_pdfviewer {
                    icon = ' . \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extRelPath($_EXTKEY) . 'ext_icon.svg
                    title = LLL:EXT:pdfjs/Resources/Private/Language/newContentElement.xlf:pdfViewer.title
                    description = LLL:EXT:pdfjs/Resources/Private/Language/newContentElement.xlf:pdfViewer.description
                    tt_content_defValues {
                        CType = list
                        list_type = pdfjs_pdfviewer
                    }
                }
            }
            //show := addToList(tx_pdfjs_pdfviewer)
        }
    }'
);