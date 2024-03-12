import { fromObject } from "@nativescript/core";

import { SelectedPageService } from "../shared/selected-page-service";

export function ReportViewModel() {
  SelectedPageService.getInstance().updateSelectedPage("Report");

  const viewModel = fromObject({
    /* Add your view model properties here */
  });

  return viewModel;
}
