# Callout body alignment — September 14, 2026

Updated the active V2 builder to give callouts the same **Body left** override already available on title cards. The button appears alongside **Pipe bullets** and **Numbered**. With the override off, the body follows the card alignment. With it on, only the body is left-aligned. Choosing the toolbar's overall text alignment clears the override, matching the title-card behavior.

The saved `calloutBodyAlign` property survives normalization and exports. The override's CSS and rendering are included in both standalone player modes; the editor buttons are omitted from the players.

Browser verification in an isolated copy of the actual updated builder:
- Added a callout and entered a heading and two body lines.
- **Text center** produced computed center alignment for both heading and body.
- **Body left** produced a centered heading and left-aligned body without changing the text.
- Reload retained the override and both body lines.
- Switching **Body left** off restored a centered body.
- Actual Tutorial and Video/Demo export previews both retained the centered heading and left-aligned body, with no body-format editor controls.
- Browser reported no JavaScript errors. Builder JavaScript parsed successfully.

Backup: `backups/before-callout-body-align-20260914-005922/`. Embedded `project-state` is unchanged. The user's live draft was not modified or reloaded during the isolated test. Only the current V2 builder was changed; the historical V1 builders are outside the user's explicitly requested current workflow.
