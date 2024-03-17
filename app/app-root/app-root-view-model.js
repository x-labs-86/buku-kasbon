import { fromObject, ObservableArray } from "@nativescript/core";

import { SelectedPageService } from "../shared/selected-page-service";

export function AppRootViewModel() {
  // const viewModel = fromObject({
  //   selectedPage: '',
  // })

  var viewModel = new ObservableArray({
    selectedPage: "",
  });

  SelectedPageService.getInstance().selectedPage$.subscribe((selectedPage) => {
    viewModel.selectedPage = selectedPage;
  });

  return viewModel;
}
