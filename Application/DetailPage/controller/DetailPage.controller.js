sap.ui.define(
  ["com/UI5Starter/Application/Base/BaseController",
    "sap/ui/core/routing/History"],
  function (BaseController, History) {
    var oRouter;
    var base;
    return BaseController.extend("com.UI5Starter.UI5-main.Application.DetailPage.controller.DetailPage",
      {
        onInit: function () {
          
        },
        onNavBack: function () {
          var oController;
          if (!oController) {
            oController = sap.ui.controller('com.UI5Starter.Application.Dashboard.controller.Dashboard')
            oController.routeFirsPage()
          } else {
            oController.routeFirsPage()
          }
        },
        incrementQuantity: function () {
          var currentQuantity = parseInt(this.getView().byId("quantity").getValue());
          this.getView().byId("quantity").setValue(currentQuantity + 1);
        },
        decrementQuantity: function () {
          var currentQuantity = parseInt(this.getView().byId("quantity").getValue());
          if (currentQuantity > 0) {
            this.getView().byId("quantity").setValue(currentQuantity - 1);
          }
        },
        sepetEkle: function (oEvent) {
          let model = oModel.oData.SelectedProduct
          let selected = model ? model.id : oModel.getProperty(oEvent.oSource.oBindingContexts.undefined.sPath)
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("CartPage", {
            param: "id="+selected
          });

        }
      }
    );
  }
);
