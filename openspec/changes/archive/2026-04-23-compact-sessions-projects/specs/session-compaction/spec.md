# Session Compaction Specification

## Purpose

Enable users to consolidate multiple sessions into a single session via a destructive recreate operation.

## Destructive Nature

**WARNING**: Session compaction is DESTRUCTIVE. The process:
1. Creates new observations with a new session_id
2. Deletes the original observations
3. Deletes the source sessions

Original observation IDs and timestamps are NOT preserved. Only content and tags are migrated.

## Requirements

### Requirement: Modal Display

The system SHALL display a "Compact Sessions" tab within the CompactModal when the user navigates to the Compact feature.

#### Scenario: Display compact sessions tab

- GIVEN the user has opened the Compact modal
- WHEN the user clicks the "Compact Sessions" tab
- THEN the system SHALL display a list of available sessions with checkboxes

#### Scenario: Sessions grouped by project

- GIVEN the user is on the "Compact Sessions" tab
- WHEN sessions are displayed
- THEN sessions SHALL be grouped by their parent project
- AND each session SHALL show name, observation count, and date

### Requirement: Selection and Preview

The system SHALL display a preview panel showing selection counts before compaction.

#### Scenario: Preview updates on selection

- GIVEN the user has selected one or more sessions
- WHEN the selection changes
- THEN the preview panel SHALL update to show the count of selected sessions
- AND the preview SHALL show the total number of observations to be compacted

#### Scenario: Empty selection state

- GIVEN the user has not selected any sessions
- THEN the preview panel SHALL indicate no sessions are selected
- AND the "Compact" button SHALL be disabled

### Requirement: Session Name Input

The system SHALL require a non-empty name for the compacted session before enabling the compact action.

#### Scenario: Valid session name

- GIVEN the user has selected one or more sessions
- WHEN the user enters a non-empty session name
- THEN the "Compact" button SHALL become enabled

#### Scenario: Empty session name

- GIVEN the user has entered an empty session name
- THEN the "Compact" button SHALL remain disabled
- AND an error message SHALL NOT be shown (validation is passive)

### Requirement: Destructive Warning Display

The system MUST display a prominent warning about data loss before the compact action executes.

#### Scenario: Warning visibility

- GIVEN the user is on the "Compact Sessions" tab
- THEN the system SHALL display a warning stating that original timestamps will be lost
- AND the warning SHALL appear above the action buttons

#### Scenario: Warning content

- GIVEN the warning is displayed
- THEN the warning text SHALL state: "This will recreate observations with new session IDs. Original timestamps will be lost."

### Requirement: Session Compaction Execution

The system SHALL execute session compaction via recreate-and-delete pattern when the user confirms.

#### Scenario: Successful session compaction

- GIVEN the user has selected sessions, entered a name, and clicked "Compact"
- WHEN the compaction completes successfully
- THEN the system SHALL create a new session with the specified name
- AND the system SHALL create new observations in the new session (preserving content and tags)
- AND the system SHALL delete each original observation
- AND the system SHALL delete each source session (now empty)
- AND the system SHALL display a success message with stats

#### Scenario: Compaction failure at observation recreation

- GIVEN the user has initiated compaction
- WHEN an error occurs during observation recreation
- THEN the system SHALL abort the remaining operations
- AND the system SHALL display an error message indicating the failure
- AND source sessions SHALL remain intact (no partial deletion)

#### Scenario: Compaction failure at observation deletion

- GIVEN observations have been successfully recreated in the new session
- WHEN an error occurs during deletion of original observations
- THEN the system SHALL continue attempting to delete remaining originals
- AND the system SHALL report partial success with counts of recreated vs deleted

### Requirement: Localization

The system SHALL display success messages in the user's current locale.

#### Scenario: English success message

- GIVEN the user's locale is English
- WHEN compaction completes successfully
- THEN the success message SHALL show "X sesiones → 1 sesión"

#### Scenario: Spanish success message

- GIVEN the user's locale is Spanish
- WHEN compaction completes successfully
- THEN the success message SHALL show "✅ Compactación exitosa"
- AND the stats SHALL show "X sesiones → 1 sesión" and "X observaciones preservadas"