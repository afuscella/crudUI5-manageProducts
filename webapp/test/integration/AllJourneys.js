/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"pt/com/pm/crudUI5-manageProducts/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"pt/com/pm/crudUI5-manageProducts/test/integration/pages/Worklist",
	"pt/com/pm/crudUI5-manageProducts/test/integration/pages/Object",
	"pt/com/pm/crudUI5-manageProducts/test/integration/pages/NotFound",
	"pt/com/pm/crudUI5-manageProducts/test/integration/pages/Browser",
	"pt/com/pm/crudUI5-manageProducts/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "pt.com.pm.crudUI5-manageProducts.view."
	});

	sap.ui.require([
		"pt/com/pm/crudUI5-manageProducts/test/integration/WorklistJourney",
		"pt/com/pm/crudUI5-manageProducts/test/integration/ObjectJourney",
		"pt/com/pm/crudUI5-manageProducts/test/integration/NavigationJourney",
		"pt/com/pm/crudUI5-manageProducts/test/integration/NotFoundJourney",
		"pt/com/pm/crudUI5-manageProducts/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});