jQuery.sap.require('com.UI5Starter.Resources.utils.Router')
sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/resource/ResourceModel',
    'com/UI5Starter/Resources/utils/CachingHelper',
    'com/UI5Starter/Resources/utils/StorageControls',
    'sap/ui/Device',
    'sap/base/Log',
    'sap/ui/core/IconPool'
], function (UIComponent, ResourceModel, CachingHelper, StorageControls, Device, Log, IconPool) {
    'use strict';

    return UIComponent.extend('com.UI5Starter.Component', {
        metadata: {
            version: "1.0.0",
            routing: {
                config: {
                    routerClass: com.UI5Starter.Resources.utils.Router,
                    viewType: 'XML',
                    targetAggregation: 'pages',
                    clearTarget: false
                },
                routes: [{
                    pattern: '',
                    viewPath: 'com.UI5Starter.Application.Dashboard.view',
                    view: 'Dashboard',
                    name: 'Dashboard',
                    targetControl: 'masterAppView',
                },{
                    pattern: 'LoginPage',
                    viewPath: 'com.UI5Starter.Application.LoginPage.view',
                    view: 'LoginPage',
                    name: 'LoginPage',
                    transition: "show",
                    targetControl: "masterAppView",
                },
                {
                    pattern: 'DetailPage',
                    viewPath: 'com.UI5Starter.Application.DetailPage.view',
                    view: 'DetailPage',
                    name: 'DetailPage',
                    targetControl: 'masterAppView',
                },
                {
                    pattern: '',
                    viewPath: 'com.UI5Starter.Application.HomePage.view',
                    view: 'HomePage',
                    name: 'HomePage',
                    targetControl: 'masterAppView',
                },
                 {
                    pattern: 'CartPage?{param}',
                    viewPath: 'com.UI5Starter.Application.CartPage.view',
                    view: 'CartPage',
                    name: 'CartPage',
                    targetControl: 'masterAppView',
                },
                 {
                    viewPath: "com.UI5Starter.Application.NotFound.view",
                    pattern: ":all*:",
                    name: "NotFound",
                    view: "NotFound",
                    targetControl: "masterAppView",
                    transition: "show",
                },]
            }
        },
        init: function () {
            sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
            var mConfig = this.getMetadata().getConfig();

            oModel.setProperty("/device", Device);  // set device model

            this.seti18nModel();
            this.registerFonts();
            this.setLogTracer();

            CachingHelper.initDb(false)

            // UserHelper.checkSession()
            //     .then(res => this.getRouter().initialize())
            //     .catch(err => {
            //         if (err.name == "UserError" || err.name == "ServerError") {
            //             UserHelper.goLogin(true)
            //         } else {
            //             Log.error(err, err.stack)
            //         }
                    this.getRouter().initialize();
            // })
        },
        seti18nModel: function () {
            var lang = StorageControls.getItem("LANG") || "TR";
            sap.ui.getCore().getConfiguration().setLanguage(lang)
            var i18nModel = new ResourceModel({
                bundleName: "com.UI5Starter.i18n.i18n"
            });
            /** custom lang data binding */
            i18nModel.getResourceBundle().aPropertyFiles[0].setProperty("Custom", "value")
            this.setModel(i18nModel, "i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");
        },
        registerFonts: function () {
            IconPool.registerFont({
                fontFamily: "SAP-icons-TNT",
                fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/"),
            });

            IconPool.registerFont({
                fontFamily: "BusinessSuiteInAppSymbols",
                fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/"),
            });
        },
        setLogTracer: function () {
            Log.addLogListener({
                onLogEntry: function (oLogEntry) {
                    if (oLogEntry.level === 1) {
                        oLogEntry.details = (typeof oLogEntry.details == 'string') ? oLogEntry.details : JSON.stringify(oLogEntry.details)
                        Logger.client(oLogEntry.message, oLogEntry.details, myuser.username)
                    }
                }
            });
        },
        createContent: function () {
            var oViewData = {
                component: this
            }
            return sap.ui.view({
                viewName: 'com.UI5Starter.Application.App.RootApp',
                type: sap.ui.core.mvc.ViewType.XML,
                id: 'app',
                viewData: oViewData,
            })
        },

    })
});