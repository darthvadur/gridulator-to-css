/* Gridulator to CSS Tool - Core js */
/* by Dave Arthur */

$(document).ready(function() {

	$('#input-fields input').change(function() {
		
		var id = $(this).attr('id');
		var currVal = $(this).val();
		var valInput = validateInput(currVal);
		
		if ((valInput) && (currVal !== '')) {
			$(this).css('background', 'rgba(0,255,0,0.1)');  // successful entry hint
			var allFilledIn = checkAllFilledIn(id);
			
			if (allFilledIn) {
		
				calculateGrid();
				
				$('#choose-layout input[name="layout-type"]').change(function() {
					var overlayShown;
					if ($('.overlay').hasClass('ui-hidden')) {
						overlayShown = false;
					} else {
						overlayShown = true;
					}
					var arrIsHiddenCol = new Array;
					var arrIsHiddenFl = new Array;
					$("#inner-code-container > pre > span").each(function() {
						if ($(this).hasClass('hide-code')) {
							arrIsHiddenFl.push($(this).attr('id'));
						}
					});
					
					$('.grid-col').each(function() {
						if (!($(this).hasClass('selected'))) {
							var aId = $(this).parent().attr('id');
							arrIsHiddenCol.push(aId);
						}	
					});
					$("#visual-grid").remove();
					$("#css-code-container").remove();
					calculateGrid();
					if (overlayShown == true) {
						$('.overlay').removeClass('ui-hidden');
						$('#grid-toggle').text('Hide Column Overlay');
					}
					for (m=0; m<arrIsHiddenFl.length; m++) {
						var targetHideFl = '#'+ arrIsHiddenFl[m];
						$(targetHideFl).addClass('hide-code');
					}
					for (n=0; n<arrIsHiddenCol.length; n++) {
						var targetColHide = '#'+ arrIsHiddenCol[n];
						$(targetColHide).children('.grid-col').removeClass('selected');
					}
				});
			}
			else {
				// form not filled out properly...let user fix it.
			}
				
		} else if ((valInput) && (currVal === '')) {
		
			$(this).css('background', 'transparent');  // blank out bg colour if empty
			
		} else {
			$(this).css('background', 'rgba(255,0,0,0.1)');   // error hint 
		
		}

	});
	
	

});

function checkAllFilledIn (id) { 
	var selector = '#'+id;
	var numFields = $('#input-fields input').length - 1;  // number of fields to check
	var tempCounter;
	tempCounter = 0;
	$('#input-fields input:not('+selector+')').each( function () {
		if (($(this).val() !== '') && isNaN($(this).val()) === false ) {
			tempCounter ++;
		}
	});
	if (tempCounter == numFields) {
		return true;
	} else {
		return false;
	}
}

function validateInput(val) {
	var checkNaN = isNaN(val);
	if (checkNaN === false) {
		return true;
	}
}

function calculateGrid() {
	// collect all values
	var overallWidth = $('#overall-width').val();
	var numCol = $('#num-columns').val();
	var colWidth = $('#column-width').val();
	var gutterWidth = $('#gutter-width').val();
	var layoutType = $('#choose-layout input[name="layout-type"]:checked').val();
	var fluidGutterWidth = gutterWidth / overallWidth * 100;
	var arrGridPropLabel = new Array();
	var arrGridPx = new Array(); 
	
	var notRight;
	
	for (i=0; i < numCol; i++) {	
		arrGridPropLabel[i] = ((i + 1) + ' / ' + numCol);
		arrGridPx[i] = ((i+1) * colWidth) + (((i+1) - 1) * gutterWidth );
		
		if (i == (numCol-1)) {

			if (arrGridPx[i] != overallWidth) {
				notRight = true;
			}
			else {
				notRight = false;
			}
		}

	}
	
	if (notRight == false) {
		var pxWidth = overallWidth + 'px';
		if (layoutType == 'fixed') {
			$('.output').css('width', pxWidth);
			$('.output').css('max-width', 'none');
		} else if (layoutType == 'fluid') {
			$('.output').css('max-width', pxWidth);
			$('.output').css('width', 'auto');
		}
		
		$('.errorMessage').text('');
		$('.errorMessage').hide();
		$('.output').append('<div id="visual-grid"><h2>Live Preview</h2><p>Click on a grid proportion below to toggle off/on its output in the CSS code.</p><p><a href="#" id="grid-toggle">Show Column Overlay</a></p><div id="inner-preview-container"></div></div>');
		for (j=0; j < arrGridPropLabel.length; j++) {
			var gridRow = makeGridRow(j, overallWidth, numCol, arrGridPropLabel[j], colWidth, gutterWidth, layoutType)
			$("#inner-preview-container").append(gridRow);
		}
		$('.row a').click(function(e) {
			e.preventDefault();
			var targetSelectorCol = '#'+ $(this).attr('id') + '-css';
			var targetSelectorFl = '#'+$(this).attr('id') + '-fl';
			
			if ($(this).children('.grid-col').hasClass('selected')) {

				$(this).children('.grid-col').removeClass('selected');
				$(targetSelectorCol).addClass('hide-code');
				$(targetSelectorFl).addClass('hide-code');
			} else {
				$(this).children('.grid-col').addClass('selected');
				$(targetSelectorCol).removeClass('hide-code');
				$(targetSelectorFl).removeClass('hide-code');
			}
			
		});
		var previewHeight = $('#inner-preview-container').height();
		var gridOverlay = makeGridOverlay(previewHeight, overallWidth, numCol, colWidth, gutterWidth, layoutType);
		$('#inner-preview-container').append(gridOverlay);
		$('#grid-toggle').click(function(e) {
			e.preventDefault();
			if ($('.overlay').hasClass('ui-hidden')) {
				$('.overlay').removeClass('ui-hidden');
				$(this).text('Hide Column Overlay');
			} else {
				$('.overlay').addClass('ui-hidden');
				$(this).text('Show Column Overlay');
			}
			
		});
		
		var floatString = '';
		$(".output").append('<div id="css-code-container"><h2>Your CSS code</h2><div id="inner-code-container"><pre></pre></div></div>');
		for (j=0; j < arrGridPx.length; j++) {
			var cssCode = makeCssWidthRules(j, overallWidth, numCol, arrGridPx[j], gutterWidth, layoutType);

			$("#inner-code-container > pre").append(cssCode);
			
		
		}

		floatString += '[class*="l-col"] {' + '\n';
		floatString += '    float: left;' + '\n';
		if (layoutType == 'fixed') {
			floatString += '    margin-left: '+ gutterWidth +'px;' + '\n';
		} else if (layoutType == 'fluid') {
			floatString += '    margin-left: '+ fluidGutterWidth +'%;' + '\n';
		}
		floatString += '}' + '\n\n';
		floatString += '[class*="l-col"]:first-child {' + '\n';
		floatString += '    margin-left: 0;' + '\n';
		floatString += '}' + '\n';
		
		$("#inner-code-container > pre").append(floatString);
	
	} else {
		$("#visual-grid").remove();
		$("#css-code-container").remove();
		$('.errorMessage').show();
		$('.errorMessage').text('Sorry the values do not work. Please check Gridulator and try again.');
	}
	
	
}

function makeGridRow(number, overallWidth, columnNum, label, gridUnit, gutter, layout) {
	var gridNum = number + 1;
	var gutterNum = number;
	var colWidth = (gridNum * gridUnit) + (gutterNum * gutter);
	var flexColWidth = colWidth / overallWidth * 100;
	var remainWidth = overallWidth - colWidth - gutter;
	var flexRemainWidth = remainWidth / overallWidth * 100;
	var flexGutter = gutter / overallWidth * 100;
	var row;
	if (layout == 'fixed') {
		if (number == columnNum - 1) {
			row = '<div class="row clr"><a href="#" id="col'+gridNum+'"><div class="grid-col selected" style="width:'+colWidth+'px">'+label+'</div></a></div>';
		
		} else {
			row = '<div class="row clr"><a href="#" id="col'+gridNum+'"><div class="grid-col selected" style="width:'+colWidth+'px; margin-right:'+gutter+'px">'+label+'</div><div class="remaining" style="width:'+remainWidth+'px">&nbsp;</div></a></div>';
		}
		
	} else if (layout == 'fluid') {
		
		$('#visual-grid > .row').css('width', '100%');
		if (number == columnNum - 1) {
			row = '<div class="row clr"><a href="#" id="col'+gridNum+'"><div class="grid-col selected" style="width:'+ flexColWidth +'%">'+label+'</div></a></div>';
		
		} else {
			row = '<div class="row clr"><a href="#" id="col'+gridNum+'"><div class="grid-col selected" style="width:' + flexColWidth+ '%; margin-right:'+flexGutter+'%">'+label+'</div><div class="remaining" style="width:'+flexRemainWidth+'%">&nbsp;</div></a></div>';
		}		
		
	}

	return row;
	
}

function makeGridOverlay(overlayHeight, overallWidth, columnNum, gridUnit, gutter, layout) {

	var flexGridUnitWidth = gridUnit / overallWidth * 100;
	var flexGutter = gutter / overallWidth * 100;
	var overlay ='<div class="overlay clr ui-hidden">';
	
	if (layout == 'fixed') {
		
		for (var k = 1; k <= columnNum; k++) {
		
			if (k == columnNum) {
				overlay += '<div style="width:'+gridUnit+'px; height:'+overlayHeight+'px;"></div>';
		
			} else {
				overlay += '<div style="width:'+gridUnit+'px; margin-right: '+ gutter +'px; height:'+overlayHeight+'px;"></div>';
			}
			
		}
	
	} else if (layout == 'fluid') {

		for (var k = 1; k <= columnNum; k++) {
			
			if (k == columnNum) {
				overlay += '<div style="width:'+flexGridUnitWidth+'%; height:'+overlayHeight+'px;"></div>';
		
			} else {
				overlay += '<div style="width:'+flexGridUnitWidth+'%; margin-right: '+ flexGutter +'%; height:'+overlayHeight+'px;"></div>';
			}
			
		}
			
	}	

	overlay +='</div>';

	return overlay;
	
}

function makeCssWidthRules(number, overallWidth, columnNum, gridUnit, gutter, layout) {
	var gridNum = number + 1;
	var output = '';
	var fluidGridUnit = gridUnit / overallWidth * 100;
	output  += '<span id="col'+gridNum+'-css">.l-col'+gridNum +' {' + '\n';
	if (layout == 'fixed') {
		output  += '    width: '+gridUnit +'px;' + '\n';
		
	} else if (layout == 'fluid') {
		output  += '    width: '+fluidGridUnit +'%;' + '\n';
	}
	
	
	output  += '}' + '\n\n'+'</span>';

	return output;
	
}

