import { fromObject } from "@nativescript/core";

import { SelectedPageService } from "../shared/selected-page-service";

export function UsersViewModel() {
  SelectedPageService.getInstance().updateSelectedPage("Users");

  const viewModel = fromObject({
    /* Add your view model properties here */
  });

  return viewModel;
}
