import { Frame, Application, ApplicationSettings } from "@nativescript/core";

import { AppRootViewModel } from "./app-root-view-model";

var context = new AppRootViewModel();

export function onLoaded(args) {
  const drawerComponent = args.object;

  const __as = ApplicationSettings;
  if (!__as.hasKey("setup")) {
    __as.setBoolean("setup", true);
  }
  context.set("isSetup", __as.getBoolean("setup"));
  context.set("shop_name", __as.getString("shop_name"));

  drawerComponent.bindingContext = context;
}

export function onNavigationItemTap(args) {
  const component = args.object;
  const componentRoute = component.route;
  const componentTitle = component.title;
  const bindingContext = component.bindingContext;

  bindingContext.set("selectedPage", componentTitle);

  Frame.topmost().navigate({
    moduleName: componentRoute,
    transition: {
      name: "fade",
    },
  });

  const drawerComponent = Application.getRootView();
  drawerComponent.closeDrawer();
}
