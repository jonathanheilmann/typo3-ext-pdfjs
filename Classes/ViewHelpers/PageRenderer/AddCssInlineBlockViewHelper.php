<?php
namespace JonathanHeilmann\Pdfjs\ViewHelpers\PageRenderer;

/***************************************************************
 *
 *  Copyright notice
 *
 *  (c) 2018 Jonathan Heilmann <mail@jonathan-heilmann.de>
 *
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

use TYPO3\CMS\Core\Page\PageRenderer;

/**
 * Class AddCssInlineCodeViewHelper
 * @package JonathanHeilmann\Pdfjs\ViewHelpers\PageRenderer
 */
class AddCssInlineCodeViewHelper extends \TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper
{

    /**
     * @param string $name
     * @param string|null $block
     * @param bool $compress
     * @param bool $forceOnTop
     */
    public function render($name, $block = null, $compress = true, $forceOnTop = false)
    {
        if ($block === null) {
            $block = $this->renderChildren();
        }

        $block = trim($block);

        if (strpos($block, '<style type="text/css">') === 0) {
            $block = substr($block, strlen('<style type="text/css">'));
        }
        if (strpos($block, '</style>') === (strlen($block) - strlen('</style>'))) {
            $block = substr($block, 0, (strlen($block) - strlen('</style>')));
        }
        $block = trim($block);

        /** @var PageRenderer $pageRenderer */
        $pageRenderer = $this->objectManager->get(PageRenderer::class);
        $pageRenderer->addCssInlineBlock($name, $block, $compress, $forceOnTop);
    }

}