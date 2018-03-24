sap.ui.define([
  "sap/ui/core/Control",
  "sap/m/FlexBox",
  "sap/m/FlexBoxRenderer"
], function (Control, FlexBox,FlexBoxRenderer) {
  "use strict";
  return FlexBox.extend("pt.com.pm.crudUI5-manageProducts.Tags", {
  	
	/**
	 * Metadata
	 * @public
	 */
  	metadata : {
		properties: {
			test: {
				type: "string"
			},
			items: {
				type: "sap.ui.base.Object",
				multiple: false, // 1:1
				singularName: "items"
			}
		},
		defaultAggregation: "content",
		aggregations: {
			content: {
				type: "sap.ui.core.Control",
				multiple: false, // 1:1
				singularName: "content"
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
  		FlexBoxRenderer.render(oRm,oControl);
  	}
  	
  });
});