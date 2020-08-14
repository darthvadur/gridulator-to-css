# Gridulator to CSS Tool

## Overview

### Web Tool

URL to tool: [davearthurweb.com/gridulator-to-css](http://arbutuscreative.ca/darthvadur/gridulator-to-css/)

[Gridulator](http://gridulator.com) is a handy tool to quickly design simple pixel based grids. Unfortunately, it doesn't create the CSS for the grid system.

I initially created this tool for my Langara [CSS Fundamentals](http://arbutuscreative.ca/darthvadur/langara-courses/css/) class to help teach grid systems in web design. Calculating CSS for grids is annoying so I wanted to simplify the process!

### Using Sass

Alternatively most of the web tool's functionality can be accomplished using the [Sass preprocessor](http://sass-lang.com/). 

I've added a "sass" folder containing a _grid.scss partial file. To use the functionality, add the file to your sass partials folder and reference the partial in your main Sass file using the @import rule. The reference should be higher up in the main file so that the variables and functions can be used in other output areas.

## What's New?

### December 2015
* Added a Sass partial file which works similar to the web application (see above)  

### April 2014

* Simplified the CSS output float/gutter declaration using an attribute selector instead of listing out all of the grid classes.
* Added a CSS output rule which removes extra gutter on left side of grid system using the <code>:first-child</code> pseudo-class selector.
* Added the <code>l-</code> prefix to the grid classes to namespace them. See [SMACSS](http://smacss.com/book/type-layout) for more details.



