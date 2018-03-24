sap.ui.define([
  "sap/ui/core/Control",
  "sap/m/Label"
], function (Control, Label) {
  "use strict";
  return Label.extend("pt.com.pm.crudUI5-manageProducts.Label", {
  	
	/**
	 * Metadata
	 * @public
	 */
  	metadata : {
		properties: {
			signal : {
				type: "string"
			},
			unit : {
				type: "string"
			},
			text : {
				type: "string"
			},
			color : {
				type: "sap.ui.core.CSSColor"
			},
			size : {
				type: "sap.ui.core.CSSSize",
				defaultValue: "36px"
			}
		}
  	},
  	
	/** 
	 * Called when object is being created 
	 * @public 
	 */  
  	onInit : function() {
  		
  	},
  	
  	exit: function() {
  		
  	},
  	
	/** 
	 * Main method for custom objects. 
	 * In order to display the object with properties 
	 * and aggregations defined, the method below 
	 * treat them, and allows the developer to insert 
	 * css classes or styles 
	 * @param {object} oRm render object
	 * @param {object} oControl control object
	 * @public 
	 */  
  	renderer: function (oRm, oControl) {
  		
  		var sText = oControl.getText(),
  			sSize = oControl.getSize(),
  			sUnit = oControl.getUnit(),
  			sSignal = oControl.getSignal();
  		
  		// main div
  		oRm.write("<div");
  		oRm.addStyle("font-family", "Lato,Helvetica,Arial,sans-serif");
		oRm.addStyle("line-height","80px");
    	oRm.addStyle("text-align", "center");
    	
    	oRm.addStyle("color", "#fff");
    	oRm.addStyle("border", "1px dashed #c1bdbac4");
  		oRm.writeStyles();
  		oRm.write(">");
  		
  		// symbol
  		oRm.write("<spam ");
  		oRm.addStyle("font-size", sSize);
  		
  		oRm.writeStyles();
  		oRm.write(">");
  		oRm.write(sSignal === "+" ? "▴" : "▾");
  		oRm.write("</spam>");
  		
  		// number
  		oRm.write("<spam ");
		oRm.addStyle("font-size", sSize);
		oRm.writeStyles();
		oRm.addClass("sapUiTinyMarginBeginEnd");
		oRm.writeClasses();
        oRm.write(">");
        oRm.write(sText);
        oRm.write("</spam>");

		// signal
		oRm.write("<spam ");
		oRm.addStyle("font-size", sSize);
		oRm.writeStyles();
        oRm.write(">");
        oRm.write("(" + sSignal + ")");
        oRm.write("</spam>");

		// unit
  		oRm.write("<spam ");
		oRm.addStyle("font-size", sSize);
		oRm.writeStyles();
		oRm.addClass("sapUiTinyMarginBeginEnd");
		oRm.writeClasses();
        oRm.write(">");
        oRm.write(sUnit);
        oRm.write("</spam>");
        
        oRm.write("</div>");
        
  	}
  	
  });
});