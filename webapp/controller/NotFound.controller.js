sap.ui.define([
		"pt/com/pm/crudUI5-manageProducts/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("pt.com.pm.crudUI5-manageProducts.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);