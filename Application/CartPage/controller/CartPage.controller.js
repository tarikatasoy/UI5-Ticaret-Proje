sap.ui.define([
  'com/UI5Starter/Application/Base/BaseController',
], function (BaseController) {
  var oRouter;
  var base, navCon;
  let storedProducts = (localStorage.getItem("selectedProduct"));
  storedProducts = storedProducts.split(",")
  return BaseController.extend("com.UI5Starter.Application.CartPage.controller.CartPage", {

    onInit: function () {
      base = this;
      oRouter = sap.ui.core.UIComponent.getRouterFor(base);
      oRouter.getRoute("CartPage").attachPatternMatched(base.getData, base);
      base.getData();
    },

    getData: function () {
      sap.ui.core.BusyIndicator.show("bsy", true);
      var param = window.location.hash.split("=")[1];
      param = param.split(",");
      var obj = [];
      let storedProducts = (localStorage.getItem("selectedProduct"));
      storedProducts = storedProducts.split(",")
      var arr = [];
      storedProducts.forEach(element => {
        if(element=='') return;
        var obj = {};
        $.ajax({
          url: "https://fakestoreapi.com/products/" + element,
          dataType: "json",
          success: function (res) {
            oModel.setProperty("/ProductListCart1", res);
            sap.ui.core.BusyIndicator.hide();
            arr.push(res);
            arr.sort((a, b) => a.id - b.id);
            oModel.setProperty("/arr", arr)
          }
        })
      });
      sap.ui.core.BusyIndicator.hide();
    },

    urunSil: function (oEvent) {
      var urn = oEvent.oSource.getBindingContext().sPath.split("/");
      urn = urn.slice(-1);
      var x = "" + oModel.oData.arr[urn].id;

      function urnsil(arr, element) {
        if (arr.indexOf(element) > -1) {
          arr.splice(arr.indexOf(element), 1);
        }
        return arr;
      }
      urnsil(storedProducts, x);
      localStorage.setItem("selectedProduct", storedProducts);

      if (!localStorage.getItem("selectedProduct")) {
        localStorage.removeItem("selectedProduct");
      }
      for (var i = 0; i < oModel.oData.arr.length; i++) {
        if (oModel.oData.arr[i].id == x) {
          oModel.oData.arr.splice(i, 1);
          oModel.refresh(true);
        }
      }
      if (oEvent.oSource.mProperties.text == "SİL") {
        sap.m.MessageToast.show("ürün silindi.")
      }
      else { sap.m.MessageToast.show("ürün satın alındı.") }
    },
    onNavBack: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      oRouter.navTo("HomePage");
    },
  })
});