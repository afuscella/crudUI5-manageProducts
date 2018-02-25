sap.ui.define([
	] , function () {
		"use strict";

		return {

			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			numberUnit : function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseFloat(sValue).toFixed(2);
			},
			
			/**
			 * Rounds the amount value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			amountValue : function (sValue) {
				if (!sValue) {
					return "0";
				}
				return parseFloat(sValue).toFixed(2);
			},

			/**
			 * Returns a list of products that have been selected
			 * @public
			 * @param {object} oSelectionModel the selected products
			 * @param {object} oContext the context where function have been invoked
			 * @returns {array} aList
			 */			
			listProductsSelected: function(oSelectionModel, oContext) {
				var oModel = oContext.getModel();
				return (Object.keys(oSelectionModel.products)
					.filter(function(sKey) { 
						return oSelectionModel.products[sKey];
					})
					.map(function(sKey) { 
						return oModel.getProperty(sKey); 
					}));			// returns a list
			},

			/**
			 * Returns a list of products that have been selected
			 * @public
			 * @param {object} oSelectionModel the selected products
			 * @param {object} oContext the context where function have been invoked
			 * @returns {array} aList
			 */			
			listProductsPathsSelected: function(oSelectionModel, oContext) {
				return (Object.keys(oSelectionModel.products)
					.filter(function(sKey) { 
						return oSelectionModel.products[sKey];
					}));			// returns a list
			},
			
			/**
			 * Checks whether any product were selected
			 * @public
			 * @param {object} oSelectionModel the selected products
			 * @returns {boolean} bValue
			 */
			isAnyProductSelected: function(oSelectionModel) {
				var oData = this.getModel("worklistSelection").getData(),
					oModel = this.getModel(),
					aList = ( Object.keys(oData.products)
					.filter(function(sKey) { 
						return oData.products[sKey];
					})
					.map(function(sKey) { 
						return oModel.getProperty(sKey); 
					}));
					//.lenght > 0;	// returns a boolean
				return aList.length > 0;
			},
			
			/**
			 * Checks whether any product on table
			 * @public
			 * @param {integer} iTotalItems the total items count
			 * @returns {boolean} bValue
			 */
			isAnyProductOnTable: function (iTotalItems) {
				return iTotalItems > 0;
			}

		};

	}
);