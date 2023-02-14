sap.ui.define([
  'com/UI5Starter/Application/Base/BaseController',
], function (BaseController) {
  var oRouter;
  var base, navCon;
  base = BaseController.extend("com.UI5Starter.Application.Dashboard.controller.Dashboard", {
    onInit: function () {
      base = this;
      navCon = this.byId("navCon");
      var target = base.byId("p1");
      if (target) {
        navCon.to(target);
      }

    },
    routeSecondPage: function () {

      navCon.to(base.byId("p2"));

    },
    routeFirsPage: function (oEvent) {

      navCon.to(base.byId("p1"));

    },
  })
});