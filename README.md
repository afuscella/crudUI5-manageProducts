# crudUI5-manageProducts

1. [Creating Apps from template](#creating-apps-from-template)
2. [Create an index.html for tests purposes](#create-an-starting-page)
3. [Internationalisation with i18n](#internationalisation-with-i18n)

## Creating Apps from template

Access your `webide` on premise or cloud solution, and go through `File > New > Project from Template`. Follow the steps below for a better understading:
  * Select SAP Fiori Worklist Application from list under latest SAPUI5 Version
  * Give a project name
  * Choose an OData service as a data connection hub for the App. For this tutorial, I strongly recommend the use of an already create service prior on HANA MDC instance.
    * Select Service URL;
    * Choose the right destination from HANA MDC instance
    * Provide the service basePath + service name - *Eg.: {basePah}/{service}.xsodata*. Push test
    * Choose *App for SAP Fiori Launchpad* on Type, then provide the required information on form. Choose a namespace which identifies your App among others. Remember, namespaces should be unique on Fiori Launchpad, and Apps with same namespace may occur conflicts during runtime. For this tutorial, the namespace used is **pt.com.pm.crudUI5-manageProducts**
    * Click on finish, and it's done! The App sketch was created by a template.
    
## Create an starting page

At this step we are going to create a starting page for the App. By default, Fiori Apps for launchpad are exclusive for Fiori Launchpad, being necessary App deploy for execution, so becomes necessary the creation of an interface which allows run Apps on browser. This is possible by using the UI5 module Shell. More information might be found on [Shell - SAPUI5 Demo Kit](https://sapui5.hana.ondemand.com/test-resources/sap/ui/ux3/demokit/Shell.html)

  * Copy `webapp/index.html` to your project
  * Replace the namespace (if necessary)

Now create a Run Configuration based on index.html

  * Go through `webide`
  * Click on root folder from project
  * Right click on mouse, then Run > Run Configurations ...
  * Click plus signal (+) on top of screen, and select *Web Application*
  * Give a name as *App*, and on File Name box choose `webapp/index`
  * Save and run. Done!

## Internationalisation with i18n

[i18n](https://www.npmjs.com/package/i18n) is lightweight simple translation module with dynamic json storage. Texts on this project are being translated to English by default, and may be found on `webapp/i18n/i18n.properties`

```
// getting single text from i18n 
this.getResourceBundle().getText("appTitle")

// getting text by passing parameters
this.getResourceBundle().getText("", [])
```