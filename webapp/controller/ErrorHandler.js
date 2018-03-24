/*eslint linebreak-style: ["error", "unix"]*/
sap.ui.define([
		"sap/ui/base/Object",
		"sap/m/MessageBox"
	], function (UI5Object, MessageBox) {
		"use strict";

		return UI5Object.extend("pt.com.pm.crudUI5-manageProducts.controller.ErrorHandler", {

			/**
			 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
			 * @class
			 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
			 * @public
			 * @alias pt.com.pm.crudUI5-manageProducts.controller.ErrorHandler
			 */
			constructor : function (oComponent) {
				this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
				this._oComponent = oComponent;
				this._oRouter = oComponent.getRouter();
				this._oModel = oComponent.getModel();
				this._bMessageOpen = false;
				this._sErrorText = this._oResourceBundle.getText("errorText");

				this._oModel.attachMetadataFailed(function (oEvent) {
					debugger;
					var oParams = oEvent.getParameters();
					this._showServiceError(oParams.response);
				}, this);

				this._oModel.attachRequestFailed(function (oEvent) {
					debugger;
					var oParams = oEvent.getParameters();
					// An entity that was not found in the service is also throwing a 404 error in oData.
					// We already cover this case with a notFound target so we skip it here.
					// A request that cannot be sent to the server is a technical error that we have to handle though
					if (oParams.response.statusCode !== "404" || (
						oParams.response.statusCode === 404 && 
					    oParams.response.responseText.indexOf("Cannot POST") === 0)) {
						this._showServiceError(oParams.response);
					}
				}, this);
			},


			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
			
			/**
			 * Redirects to {@link this._showServiceError} method without 
			 * exposing private section
			 * @param {string} sDetails a technical error to be displayed
			 * @public
			 */
			showServiceError : function (sDetails) {
				return this._showServiceError(sDetails);
			},


			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Shows a {@link sap.m.Page} when failures happns according 
			 * to the statusCode related
			 * @param {string} sDetails a technical error to be displayed
			 * @private
			 */
			_showServiceError : function (sDetails) {
				this._oRouter.getTargets().display("error", sDetails);
				
				/**
				if (this._bMessageOpen) {
					return;
				}
				this._bMessageOpen = true;
				MessageBox.error(
					this._sErrorText,
					{
						id : "serviceErrorMessageBox",
						details: sDetails,
						styleClass: this._oComponent.getContentDensityClass(),
						actions: [MessageBox.Action.CLOSE],
						onClose: function () {
							this._bMessageOpen = false;
						}.bind(this)
					}
				);
				**/
			}
		});
	}
);