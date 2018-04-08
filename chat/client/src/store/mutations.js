
export default {
  setBaseUrl (state, options) {
    state.imgBaseUrl = options.imgBaseUrl;
    state.fileBaseUrl = options.fileBaseUrl;
    state.fileUploadUrl = options.fileUploadUrl;
    state.fileDownloadUrl = options.fileDownloadUrl;
  }
}
