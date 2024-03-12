import { fromObject } from "@nativescript/core";

import { SelectedPageService } from "../shared/selected-page-service";

export function TransactionsViewModel() {
  SelectedPageService.getInstance().updateSelectedPage("Transactions");

  const viewModel = fromObject({
    /* Add your view model properties here */
  });

  return viewModel;
}
