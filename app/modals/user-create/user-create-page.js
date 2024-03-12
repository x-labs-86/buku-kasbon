import {
  fromObject,
  Page,
  Button,
  ShownModallyData,
  EventData,
} from "@nativescript/core";

export function onShownModally(args) {
  console.log("onShown MODAL");
  const page = args.Page;
  const context = fromObject({
    ...args.context,
    onClose(args) {
      const button = args.Button;
      button.closeModal({
        name: context.name, // 'John Doe - EDITED'
      });
    },
  });
  page.bindingContext = context;
}
