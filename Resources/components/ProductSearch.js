sap.ui.define([
    'sap/m/MultiInput'
], function (MultiInput) {
    var base;
    return MultiInput.extend('com.UI5Starter.Resources.components.ProductSearch', {
        metadata: {
            properties: {
                value: {
                    type: "string",
                    defaultValue: ""
                },
                suggestionItems: {
                    type: "sap.ui.core.Item[]",
                    defaultValue: []
                },
                showValueHelp: {
                    type: "boolean",
                    defaultValue: true
                },
                maxTokens: {
                    type: "int",
                    defaultValue: 1
                },
                width: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "35%"
                }
            },
            events: {
                "ProductList": {
                    parameters: {
                        data: {
                            type: "any"
                        }
                    }
                }
            }
        },
        renderer: function (oRm, oControl) {
            sap.m.MultiInputRenderer.render(oRm, oControl);
        },
        init: function () {
            base = this;
            MultiInput.prototype.init.apply(this, arguments);
            // this.setWidth("35%");
            this.attachLiveChange(this.onLiveChange);
            this.attachTokenChange(this.onTokenChange);
            this.attachValueHelpRequest(this.ValueHelp)
            this.bindAggregation("suggestionItems", {
                path: "/ProductListMulti",
                template: new sap.ui.core.Item({
                    key: "{title}",
                    text: "{title}"
                })
            });
            this.attachTokenUpdate(this.onTokenUpdate);
        },
        onLiveChange: function (oEvent) {
            var InputValue = oEvent.getSource().getValue();
            var multiuzunluk = InputValue.length;
            oModel.setProperty("/ProductListMulti", []);
            if (multiuzunluk >= 3) {
                $.ajax({
                    url: "https://fakestoreapi.com/products",
                    dataType: "json",
                    success: function (res) {
                        oModel.setProperty("/ProductListMulti", res);
                    },
                });
            }
        },
        onTokenChange: function (oEvent) {

        },
        onTokenUpdate: function (oEvent) {
            debugger;
            if (oEvent.mParameters.type == "added") {
                base.fireEvent("ProductList", {
                    data: oEvent.mParameters.addedTokens[0].mProperties.key
                })
            } else {
                base.fireEvent("ProductList", {
                    data: oEvent.mParameters.removedTokens[0].mProperties.key
                })
            }
        },
        ValueHelp: function (oEvent) {
            for (var i = 0; i < oModel.oData.ProductList.length; i++) {
                if (oEvent.oSource._sSelectedValue === oModel.oData.ProductList[i].title) {
                    oModel.setProperty('/SelectedProduct', oModel.oData.ProductList[i]);
                    oController = sap.ui.controller('com.UI5Starter.Application.Dashboard.controller.Dashboard')
                    oController.routeSecondPage()
                }
            }
        },



    });
});
