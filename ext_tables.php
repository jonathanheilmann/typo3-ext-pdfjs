<?php
if (!defined('TYPO3_MODE'))
    die ('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
    'JonathanHeilmann.' .$_EXTKEY,
    'PdfViewer',
    'PDF Viewer'
);

// Add TypoScript
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($_EXTKEY, 'Configuration/TypoScript', 'PDF Viewer');

// Add flexform
$pluginSignature = 'pdfjs_pdfviewer';
$TCA['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'pi_flexform';
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue($pluginSignature, 'FILE:EXT:'.$_EXTKEY.'/Configuration/FlexForms/PdfViewer.xml');
