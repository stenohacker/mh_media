# Popup video title change

Changed current V2 builder only. Add Popup Video now opens a title dialog; Choose Video uses the existing media-file picker and passes the entered title directly to the new annotation. The permanent toolbar title field is removed. Empty title retains the existing Video fallback. Picker cancellation/failure leaves the dialog open for retry; Cancel/Escape adds nothing. A slide-ID and closed-dialog guard prevent late insertion into another slide or after dismissal.

Backup: backups/before-video-title-popup-20260912-184935/tutorial-demo-builder-v2.html. Embedded project-state is byte-identical to backup. Existing video annotations and main-video-slide controls are unchanged. Export/editable-copy clones exclude both temporary link and video dialogs.

Passed syntax, project JSON, original-state preservation, simulated form and file-picker tests, explicit-title routing, wrong-slide/dismissal/cancellation checks, three-row toolbar and export cleanup assertions. Actual browser/file-picker interaction and downloaded exports remain unverified due to the previously reported browser URL-policy limitation. No website published.
