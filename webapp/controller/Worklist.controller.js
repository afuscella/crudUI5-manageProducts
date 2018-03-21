/*eslint linebreak-style: ["error", "unix"]*/
sap.ui.define([
		"pt/com/pm/crudUI5-manageProducts/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"pt/com/pm/crudUI5-manageProducts/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("pt.com.pm.crudUI5-manageProducts.controller.Worklist", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				var oViewModel,
					oSelectionModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");

				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				// keeps the search state
				this._aTableSearchState = [];
				// keeps the master table
				this._oTable = oTable;

				// Model used to manipulate control states
				oViewModel = this._createViewModel();
				this.setModel(oViewModel, "worklistView");

				// Model used to manipulate multi line selection and their controls
				oSelectionModel = this._createSelectionModel();
				this.setModel(oSelectionModel, "worklistSelection");

				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oTable.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler for title press
			 * @param {sap.ui.base.Event} oEvent the title press event
			 * @public
			 */
			onTitlePress: function(oEvent) {
				
				var oSource = oEvent.getSource(),
					sText = oSource.getText(),
					sTitle = oSource.getTitle(),
					sMessage = this.getResourceBundle().
						getText("tableTitleEventMessage", [sTitle, sText]);
				
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert(sMessage);
			},

			/**
			 * Event handler for delete press
			 * @param {sap.ui.base.Event} oEvent the title press event
			 * @public
			 */
			onDelete: function(oEvent) {
				var	oItem = oEvent.getParameter("listItem"),
					sPath = oItem.getBindingContext().getPath(),
			 sDescription = oItem.getBindingContext().getProperty("description"),
				 sMessage = this.getResourceBundle().
					getText("tableMessageDeleteEventMessage", [sDescription]),

				 bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
				   _model = this.getModel();

				sap.m.MessageBox.confirm(
					sMessage, {
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: this.getResourceBundle().getText("tableTitleDeleteEventMessage"),
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function(oAction){
							if(oAction === sap.m.MessageBox.Action.YES){
								
								// send a delete request to the odata service
								_model.remove(sPath);
								// display message
								sap.m.MessageToast.show(
									oItem.getBindingContext().getProperty("description") + " deleted"
								);
							}}
					}
				);
			},
			
			/**
			 * Event handler for delete multiple press
			 * @param {sap.ui.base.Event} oEvent the delete multiple press
			 * @public
			 */
			onDeleteMultiple: function(oEvent) {
				var oView = this.getView(),
					sMessage = this.getResourceBundle().
						getText("tableMessageDeleteMultipleEventMessage"),
					
					bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
				   _model = this.getModel(),
				   _self = this,
				   
				    oData = this.getModel("worklistSelection").getData(),
					aList = formatter.listProductsPathsSelected(oData, this);
				
				// set busy true
				oView.setBusy(true);
				
				sap.m.MessageBox.confirm(
					sMessage, {
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: this.getResourceBundle().getText("tableTitleDeleteEventMessage"),
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function(oAction){
							if(oAction === sap.m.MessageBox.Action.YES){
								
								aList.forEach(function (sPath) {
									// send a delete request to the odata service
									_model.remove(sPath);
								});
								// display message
								sap.m.MessageToast.show(
									"Products deleted"
								);
							
								// set multiselect off
								_self.onMultiSelectPress();
								
								// clear product objects
								_self._updateSelection(null, true);
								
								// set busy false
								oView.setBusy(false);
								
							} else {
								oView.setBusy(false);
							}}
					}
				);
			},
			

			/**
			 * Event handler for multi select button
			 * @public
			 */
			onMultiSelectPress: function() {
				if (this._oTable.getMode() === "MultiSelect") {
					this._updateSelection(null, true);	// clear product objects
					this._oTable.setMode("None");
				} else {
					this._oTable.setMode("MultiSelect");
				}
				
			},

			/**
			 * Event handler for navigating back.
			 * We navigate back in the browser historz
			 * @public
			 */
			onNavBack: function() {
				history.go(-1);
			},

			/**
			 * Event handler for selection change
			 * @public
			 * @param {object} oEvent selected Item
			 */
			onSelectionChange: function(oEvent) {
				var oSelectionInfo = {},
					bSelected = oEvent.getParameter("selected");
					
				oEvent.getParameter("listItems").forEach(function (oItem) {
					oSelectionInfo[oItem.getBindingContext().getPath()] = bSelected;
				});
				this._updateSelection(oSelectionInfo, false);
			},

			/**
			 * Triggered by the table's 'updateFinished' event: after new table
			 * data is available, this handler method updates the table counter.
			 * This should only happen if the update was successful, which is
			 * why this handler is attached to 'updateFinished' and not to the
			 * table's list binding's 'dataReceived' method.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the worklist's object counter after the table update
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTitle", sTitle);
				
				// the number of entries on table
				this.getModel("worklistView").setProperty("/tableSize", iTotalItems);
				
				// hide pull to refresh if necessary
				this.byId("pullToRefresh").hide();
			},

			/**
			 * Event handler when a table item gets pressed
			 * @param {sap.ui.base.Event} oEvent the table selectionChange event
			 * @public
			 */
			onPress : function (oEvent) {
				// The source is the list item that got pressed
				this._showObject(oEvent.getSource());
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("worklistView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},

			onLiveChange : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
				} else {
					var aTableSearchState = [];
					var sValue = oEvent.getSource().getValue();

					if (sValue && sValue.length > 0) {
						aTableSearchState = [new Filter("description", FilterOperator.Contains, sValue)];
					}
					this._applySearch(aTableSearchState);
				}
			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */
			
			/**
			 * Creates a JSONModel for worklist view
			 * @returns {sap.uimodel.json.JSONModel} the model reference
			 * @private
			 */
			_createViewModel: function() {
				return new JSONModel({
					worklistTitle : this.getResourceBundle().getText("worklistTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					buttonDeleteText: "",
					tableBusyDelay : 0,
					tableSize: 0
				});
			},
			
			/**
			 * Creates a JSONModel for multiple selection
			 * @returns {sap.uimodel.json.JSONModel} the model reference
			 * @private
			 */
			_createSelectionModel: function() {
				return new JSONModel({
					products: {},
					count: 0,
					hasCounts: false
				});
			},
			
			/**
			 * Updates the selected item of multiple choices
			 * @param {object} oSelectionInfo selected Item
			 * @private
			 */
			_updateSelection: function(oSelectionInfo, bClear) {
				var oSelectionModel = this.getModel("worklistSelection");
				
				if (bClear) {
					// special condition to clear product objects
					oSelectionModel.setData({
						products: [],
						count: 0,
						hasCounts: false
					}, true);
				} else {
					// otherwise, keeps the regular flow
					oSelectionModel.setData({products: oSelectionInfo}, true);
				}
				
				var aList = formatter.listProductsSelected(oSelectionModel.getData(), this);
				oSelectionModel.setData({
					count: aList.length,
					hasCounts: aList.length > 0
				}, true);
				
				var sText = "";
				if (aList.length > 0) {
					sText = this.getResourceBundle().getText("worklistViewButtonDeleteTextCount", [aList.length]);
				}
				this.getModel("worklistView").setProperty("/buttonDeleteText", sText);
			},

			/**
			 * Shows the selected item on the object page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("id")
				});
			},

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
			 * @private
			 */
			_applySearch: function(aTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(aTableSearchState, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			}

		});
	}
);