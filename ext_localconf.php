<?php
if (!defined('TYPO3_MODE'))
    die ('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
    'JonathanHeilmann.' . $_EXTKEY,
    'PdfViewer',
	array(
		'PdfViewer' => 'showSimple',
	)
);

// Register icon
$iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);
$iconRegistry->registerIcon(
    'tx-pdfjs-pdfviewer',
    \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
    ['source' => 'EXT:' . $_EXTKEY . '/ext_icon.svg']
);

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
    'mod.wizards.newContentElement.wizardItems {
        plugins {
            elements {
                tx_pdfjs_pdfviewer {
                    icon = ' . \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extRelPath($_EXTKEY) . 'ext_icon.svg
                    iconIdentifier = tx-pdfjs-pdfviewer
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