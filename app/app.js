import { Application } from "@nativescript/core";
import { Theme } from "@nativescript/theme";

Theme.setMode(Theme.Light);
Application.run({ moduleName: "app-root/app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
