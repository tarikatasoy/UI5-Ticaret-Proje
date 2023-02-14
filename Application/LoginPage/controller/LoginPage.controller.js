sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
], function (BaseController) {
    'use strict';
	
    var base;
    return BaseController.extend("test.Application.Login.controller.Login", {
        onInit: function () {
            base = this;
        },
    });
});