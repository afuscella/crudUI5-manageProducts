/*eslint linebreak-style: ["error", "unix"]*/
sap.ui.define([
		"pt/com/pm/crudUI5-manageProducts/controller/BaseController",
		"sap/ui/model/json/JSONModel"
	], function (BaseController,JSONModel) {
		"use strict";

		return BaseController.extend("pt.com.pm.crudUI5-manageProducts.controller.Error", {

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */
			
			/**
			 * Called when the success controller is instantiated.
			 * @public
			 */
			onInit : function () {
				var oViewModel;
				
				// Model used to manipulate view control states
				oViewModel = this._createViewModel();
				this.setModel(oViewModel, "errorView");
				
				/**
				this.getView().addEventDelegate({
					onAfterShow: function() {
						this._onAfterShow();
						
					}.bind(this)
				});
				**/
				debugger;
				this.getRouter().getTarget("error").attachDisplay(this._onTargetMatched, this);
				
			},
			
			
			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */
			
			/**
			 * Creates a JSONModel to be used in worklist view
			 * @function
			 * @returns {sap.uimodel.json.JSONModel} the model reference
			 * @private
			 */
			_createViewModel : function () {
				return new JSONModel({
					statusText: this.getResourceBundle().getText("errorStatusText")
				});
			},
			
			/**
			 * Binds the view to the target name.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onTargetMatched : function (oEvent) {
				var oViewModel = this.getModel("errorView"),
					     oData =  oEvent.getParameter("data");
					     
				// No data for the binding
				if (!oData) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}
				
				var oResourceBundle = this.getResourceBundle(),
					statusCode = oData.statusCode,
					statusText = oData.statusText;
					
				// Everything went fine.
				oViewModel.setProperty("/statusText", oResourceBundle.getText("errorStatusText", 
					[statusCode, statusText]));
				
			}

		});

	}
);