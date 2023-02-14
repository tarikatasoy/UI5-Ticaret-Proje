sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'sap/m/Token'
], function (BaseController, Token) {
    var oRouter;
    var base;
    var selected;
    return BaseController.extend("com.UI5Starter.Application.HomePage.controller.HomePage", {

        onInit: function () {
            base = this;
            oRouter = sap.ui.core.UIComponent.getRouterFor(base);
            base.getData();
        },

        getData: function () {
            sap.ui.core.BusyIndicator.show("bsy", true);
            $.ajax({
                url: "https://fakestoreapi.com/products",
                dataType: "json",
                success: function (res) {
                    oModel.setProperty("/ProductList", res);
                    sap.ui.core.BusyIndicator.hide();
                },
            });
        },

        handleNav: function (oEvent) {
            var oController;
            var urun = oModel.getProperty(oEvent.oSource.getBindingContext().sPath);
            oModel.setProperty('/SelectedProduct', urun);
            oController = sap.ui.controller('com.UI5Starter.Application.Dashboard.controller.Dashboard');
            oController.routeSecondPage();
        },

        sepetEkle: function (oEvent) {
            var oController;
            var urun = oModel.getProperty(oEvent.oSource.getBindingContext().sPath);
            oModel.setProperty('/SelectedProduct', urun);
            oController = sap.ui.controller('com.UI5Starter.Application.Dashboard.controller.Dashboard')
            let model = oModel.oData.SelectedProduct
            selected = model ? model.id : oModel.getProperty(oEvent.oSource.oBindingContext().sPath)
            let storedProducts = (localStorage.getItem("selectedProduct")) || [];
            if (storedProducts.includes(selected)) { } //local storage'da varsa bi daha ekleme
            else {
                if (!localStorage.length) { var updatedProducts = selected }
                else { updatedProducts = storedProducts + "," + selected; }
                localStorage.setItem("selectedProduct", updatedProducts);
            }
            sap.m.MessageToast.show("ürün sepete eklendi.")
        },

        gecis: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("CartPage", {
                param: "id=" + selected
            });
        },

        degisiklik: function (oEvent) {
            var multiInput = base.byId("multiInput");
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
       
        urun: function (oEvent) {
            debugger
        },
    })
});

